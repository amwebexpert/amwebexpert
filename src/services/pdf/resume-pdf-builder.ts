import { yieldToMainThread } from "@lichens-innovation/ts-common";
import { DEFAULT_OPTIONS, DEFAULT_THEME, PdfGenerator, type ThemeConfig } from "@lichens-innovation/ts-common/pdf";
import { fetchUrlAsDataUri } from "@lichens-innovation/ts-common/web";
import i18next from "i18next";
import { autoTable } from "jspdf-autotable";
import { AI_PROJECT_ENTRIES } from "~/screens/ai/ai-projects.data";
import { EDUCATION_ENTRIES } from "~/screens/about/education.data";
import { EXPERIENCE_ENTRIES } from "~/screens/about/experience.data";
import { OPENSOURCE_PROJECT_ENTRIES } from "~/screens/achievements/opensource-projects.data";
import { buildResumePdfIconDataUri, RESUME_PDF_CONTACT_ICON_PATHS } from "./resume-pdf-icons.utils";
import {
  fitImageInBox,
  type GenerateResumePdfArgs,
  getImageDimensions,
  loadLogoForPdf,
} from "./resume-pdf.utils";

const RESUME_THEME: ThemeConfig = {
  ...DEFAULT_THEME,
  primaryColor: { r: 30, g: 58, b: 95 },
};

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const SECTION_TITLE_HEIGHT = 0.42;
const LOGO_BOX = 0.72;
const LOGO_IMG = 0.5;
const LOGO_IMG_PAD = (LOGO_BOX - LOGO_IMG) / 2;
const TIMELINE_CX = LOGO_BOX / 2;
const CONTENT_OFFSET = LOGO_BOX + 0.18;
const CARD_LOGO = 0.55;
const CARD_CONTENT_X = CARD_LOGO + 0.16;

// ---------------------------------------------------------------------------
// Method parameter interfaces
// ---------------------------------------------------------------------------

type LogoData = Awaited<ReturnType<typeof loadLogoForPdf>>;

interface FooterCellArgs {
  align: "left" | "center" | "right";
  currentPage: number;
  totalPages: number;
}

interface DrawCoverProfileArgs {
  centerX: number;
  pictureCy: number;
  pictureRadius: number;
}

interface DrawCoverHeadlineArgs {
  centerX: number;
  y: number;
}

interface DrawCoverContactsArgs {
  centerX: number;
  y: number;
  iconColor: string;
}

interface DrawCoverSummaryArgs {
  centerX: number;
  y: number;
}

interface DrawPillBadgesArgs {
  tags: string[];
  startX: number;
  y: number;
  availableWidth: number;
}

interface DrawCenteredContactLinkArgs {
  centerX: number;
  y: number;
  iconDataUri: string;
  label: string;
  url: string;
}

interface DrawExperienceEntryArgs {
  entry: (typeof EXPERIENCE_ENTRIES)[number];
  logo: LogoData;
  index: number;
}

interface DrawOpenSourceEntryArgs {
  entry: (typeof OPENSOURCE_PROJECT_ENTRIES)[number];
  logo: LogoData;
}

interface DrawAiEntryArgs {
  entry: (typeof AI_PROJECT_ENTRIES)[number];
}

interface RenderPageFooterArgs {
  currentPage: number;
  totalPages: number;
  mailIconUri: string;
  githubIconUri: string;
  startY: number;
  textY: number;
  iconY: number;
  cellWidth: number;
  iconSize: number;
  iconGap: number;
}

// ---------------------------------------------------------------------------
// ResumePdfBuilder
// ---------------------------------------------------------------------------

export class ResumePdfBuilder {
  private readonly generator: PdfGenerator;
  private readonly locale: string;

  constructor({ locale }: GenerateResumePdfArgs) {
    this.locale = locale;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const filename = `andre-masson-resume-${locale}-${dateStr}.pdf`;
    this.generator = new PdfGenerator({
      filename,
      theme: RESUME_THEME,
      margin: DEFAULT_OPTIONS.margin * 2,
      footerCellBuilder: (args) => this.buildFooterCell(args),
    });
  }

  // ---------------------------------------------------------------------------
  // Convenience getters
  // ---------------------------------------------------------------------------

  private get doc() {
    return this.generator.getDoc();
  }

  private get margin() {
    return this.generator.margin;
  }

  private get availableWidth() {
    return this.generator.availableWidth;
  }

  private get primaryColor() {
    return RESUME_THEME.primaryColor;
  }

  // ---------------------------------------------------------------------------
  // Shared helpers
  // ---------------------------------------------------------------------------

  private t(key: string, opts?: Record<string, unknown>): string {
    return i18next.t(key, { lng: this.locale, ...opts }) as string;
  }

  private buildFooterCell({ align, currentPage, totalPages }: FooterCellArgs): string {
    if (align === "left") return "André Masson — amwebexpert@gmail.com";
    if (align === "center") return "github.com/amwebexpert";
    return `${currentPage} / ${totalPages}`;
  }

  private ensureSpace(needed: number): void {
    const { generator } = this;
    if (generator.currentY + needed > generator.pageHeight - generator.margin - generator.footerHeight) {
      generator.addPage();
      generator.setCurrentY(generator.margin);
    }
  }

  private startSection(): void {
    this.generator.addPage();
    this.generator.setCurrentY(this.generator.margin);
  }

  private addSectionTitle(title: string): void {
    const { doc, margin } = this;
    const { r: pr, g: pg, b: pb } = this.primaryColor;
    const y = this.generator.currentY;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(pr, pg, pb);
    doc.text(title, margin, y + 0.15);

    doc.setTextColor(0, 0, 0);
    this.generator.setCurrentY(y + SECTION_TITLE_HEIGHT);
  }

  private drawPillBadges({ tags, startX, y, availableWidth }: DrawPillBadgesArgs): number {
    const { doc } = this;
    const H_PAD = 0.075;
    const PILL_H = 0.17;
    const GAP_X = 0.055;
    const ROW_GAP = 0.08;

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");

    let x = startX;
    let rowY = y;

    for (const tag of tags) {
      const textW = doc.getTextWidth(tag);
      const pillW = textW + H_PAD * 2;

      if (x + pillW > startX + availableWidth && x > startX) {
        x = startX;
        rowY += PILL_H + ROW_GAP;
      }

      doc.setFillColor(233, 236, 244);
      doc.roundedRect(x, rowY - 0.12, pillW, PILL_H, 0.04, 0.04, "F");
      doc.setTextColor(35, 40, 60);
      doc.text(tag, x + H_PAD, rowY);

      x += pillW + GAP_X;
    }

    return rowY + PILL_H * 0.5;
  }

  private drawCenteredContactLink({ centerX, y, iconDataUri, label, url }: DrawCenteredContactLinkArgs): void {
    const { doc } = this;
    const iconSize = 0.11;
    const iconGap = 0.06;
    const textWidth = doc.getTextWidth(label);
    const rowWidth = iconSize + iconGap + textWidth;
    const rowLeft = centerX - rowWidth / 2;
    const iconY = y - iconSize * 0.78;
    const textX = rowLeft + iconSize + iconGap;

    doc.addImage(iconDataUri, "PNG", rowLeft, iconY, iconSize, iconSize);
    doc.link(rowLeft, iconY, iconSize, iconSize, { url });
    doc.textWithLink(label, textX, y, { url });
  }

  private drawCircleClippedImage({ dataUri, cx, cy, r, aspectRatio }: { dataUri: string; cx: number; cy: number; r: number; aspectRatio: number }): void {
    const { doc } = this;
    const kappa = 0.5522847498;
    const ox = r * kappa;
    const oy = r * kappa;
    const x = cx - r;
    const y = cy - r;
    const xr = cx + r;
    const yb = cy + r;

    doc.saveGraphicsState();
    doc
      .moveTo(x, cy)
      .curveTo(x, cy - oy, cx - ox, y, cx, y)
      .curveTo(cx + ox, y, xr, cy - oy, xr, cy)
      .curveTo(xr, cy + oy, cx + ox, yb, cx, yb)
      .curveTo(cx - ox, yb, x, cy + oy, x, cy)
      .clip()
      .discardPath();

    const diameter = r * 2;
    const [imgW, imgH, imgX, imgY] =
      aspectRatio >= 1
        ? [diameter * aspectRatio, diameter, cx - (diameter * aspectRatio) / 2, cy - r]
        : [diameter, diameter / aspectRatio, cx - r, cy - diameter / aspectRatio / 2];

    doc.addImage(dataUri, "JPEG", imgX, imgY, imgW, imgH);
    doc.restoreGraphicsState();
  }

  // ---------------------------------------------------------------------------
  // Cover page helpers
  // ---------------------------------------------------------------------------

  private async drawCoverProfile({ centerX, pictureCy, pictureRadius }: DrawCoverProfileArgs): Promise<void> {
    const { doc } = this;
    const { r: pr, g: pg, b: pb } = this.primaryColor;
    const profileUrl = `${window.location.origin}${import.meta.env.BASE_URL}profile.jpg`;
    const profileDataUri = await fetchUrlAsDataUri(profileUrl);

    if (profileDataUri) {
      const { width, height } = await getImageDimensions(profileDataUri);
      this.drawCircleClippedImage({ dataUri: profileDataUri, cx: centerX, cy: pictureCy, r: pictureRadius, aspectRatio: width / height });
    }

    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.025);
    doc.circle(centerX, pictureCy, pictureRadius, "S");
  }

  private drawCoverHeadline({ centerX, y }: DrawCoverHeadlineArgs): number {
    const { doc } = this;
    const { r: pr, g: pg, b: pb } = this.primaryColor;

    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text("André Masson", centerX, y, { align: "center" });

    y += 0.4;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(pr, pg, pb);
    const role = this.t(`experience:${EXPERIENCE_ENTRIES[0].key}.role`);
    doc.text(`${role} — ${EXPERIENCE_ENTRIES[0].company}`, centerX, y, { align: "center" });

    y += 0.3;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const taglineLines = doc.splitTextToSize(this.t("home:subtitle"), 5.5) as string[];
    doc.text(taglineLines, centerX, y, { align: "center" });
    y += taglineLines.length * 0.16;

    return y;
  }

  private async drawCoverContacts({ centerX, y, iconColor }: DrawCoverContactsArgs): Promise<number> {
    const { doc } = this;
    const { r: pr, g: pg, b: pb } = this.primaryColor;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(pr, pg, pb);

    const contactLinks = [
      { label: "amwebexpert@gmail.com", url: "mailto:amwebexpert@gmail.com", iconPath: RESUME_PDF_CONTACT_ICON_PATHS.mail },
      { label: "github.com/amwebexpert", url: "https://github.com/amwebexpert", iconPath: RESUME_PDF_CONTACT_ICON_PATHS.github },
      { label: "linkedin.com/in/amwebexpert", url: "https://www.linkedin.com/in/amwebexpert/", iconPath: RESUME_PDF_CONTACT_ICON_PATHS.linkedin },
    ] as const;

    const iconDataUris = await Promise.all(
      contactLinks.map(({ iconPath }) => buildResumePdfIconDataUri({ pathD: iconPath, color: iconColor })),
    );

    for (const [index, { label, url }] of contactLinks.entries()) {
      this.drawCenteredContactLink({ centerX, y, iconDataUri: iconDataUris[index], label, url });
      y += 0.2;
    }

    return y;
  }

  private drawCoverSummary({ centerX, y }: DrawCoverSummaryArgs): void {
    const { doc } = this;
    const { r: pr, g: pg, b: pb } = this.primaryColor;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(pr, pg, pb);
    doc.text(this.t("aboutPage:summaryTitle"), centerX, y, { align: "center" });

    y += 0.22;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const summaryLines = doc.splitTextToSize(this.t("aboutPage:summary"), 5.0) as string[];
    doc.text(summaryLines, centerX, y, { align: "center" });
  }

  // ---------------------------------------------------------------------------
  // Cover page
  // ---------------------------------------------------------------------------

  private async drawCoverPage(): Promise<void> {
    const { margin } = this;
    const { r: pr, g: pg, b: pb } = this.primaryColor;
    const { pageWidth } = this.generator;
    const centerX = pageWidth / 2;
    const pictureRadius = 0.85;
    const pictureCy = margin + 0.6 + pictureRadius;
    const iconColor = `rgb(${pr}, ${pg}, ${pb})`;

    await this.drawCoverProfile({ centerX, pictureCy, pictureRadius });

    let y = pictureCy + pictureRadius + 0.48;
    y = this.drawCoverHeadline({ centerX, y });
    y += 0.18;
    y = await this.drawCoverContacts({ centerX, y, iconColor });
    y += 0.45;
    this.drawCoverSummary({ centerX, y });
  }

  // ---------------------------------------------------------------------------
  // Experience — timeline layout with company logos
  // ---------------------------------------------------------------------------

  private drawExperienceEntry({ entry, logo, index }: DrawExperienceEntryArgs): void {
    const { doc, margin, availableWidth } = this;
    const { r: pr, g: pg, b: pb } = this.primaryColor;

    this.ensureSpace(1.5);
    const entryY = this.generator.currentY;
    const contentX = margin + CONTENT_OFFSET;
    const contentWidth = availableWidth - CONTENT_OFFSET;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.012);
    doc.roundedRect(margin, entryY, LOGO_BOX, LOGO_BOX, 0.06, 0.06, "FD");

    if (logo) {
      const fit = fitImageInBox({ naturalWidth: logo.width, naturalHeight: logo.height, boxWidth: LOGO_IMG, boxHeight: LOGO_IMG });
      doc.addImage(logo.dataUri, "PNG", margin + LOGO_IMG_PAD + fit.offsetX, entryY + LOGO_IMG_PAD + fit.offsetY, fit.width, fit.height);
    }

    let y = entryY + 0.2;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(18, 22, 40);
    doc.text(this.t(`experience:${entry.key}.role`), contentX, y);

    y += 0.22;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(105, 110, 125);
    doc.text(`${entry.company}  ·  ${entry.period}`, contentX, y);

    y += 0.24;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(48, 52, 65);
    const bullets = this.t(`experience:${entry.key}.bullets`, { returnObjects: true }) as unknown as string[];

    for (const bullet of bullets) {
      const lines = doc.splitTextToSize(`• ${bullet}`, contentWidth) as string[];
      lines.forEach((line, i) => doc.text(line, contentX, y + i * 0.185));
      y += lines.length * 0.185;
    }

    if (entry.tags && entry.tags.length > 0) {
      y += 0.1;
      y = this.drawPillBadges({ tags: entry.tags, startX: contentX, y, availableWidth: contentWidth });
    }

    const entryBottom = Math.max(y, entryY + LOGO_BOX + 0.1);

    if (index < EXPERIENCE_ENTRIES.length - 1) {
      const timelineX = margin + TIMELINE_CX;
      doc.setDrawColor(pr, pg, pb);
      doc.setLineWidth(0.01);
      doc.setLineDashPattern([0.04, 0.06], 0);
      doc.line(timelineX, entryY + LOGO_BOX, timelineX, entryBottom + 0.16);
      doc.setLineDashPattern([], 0);
    }

    this.generator.setCurrentY(entryBottom + 0.2);
  }

  private async addExperienceSection(): Promise<void> {
    this.addSectionTitle(this.t("aboutPage:experienceTitle"));
    const logos = await Promise.all(EXPERIENCE_ENTRIES.map((entry) => loadLogoForPdf(entry.logoLight)));
    for (const [index, entry] of EXPERIENCE_ENTRIES.entries()) {
      this.drawExperienceEntry({ entry, logo: logos[index], index });
    }
  }

  // ---------------------------------------------------------------------------
  // Education
  // ---------------------------------------------------------------------------

  private addEducationSection(): void {
    const { doc, margin, availableWidth } = this;
    const { r: pr, g: pg, b: pb } = this.primaryColor;

    this.addSectionTitle(this.t("aboutPage:educationTitle"));

    const educationColWeights = [3.1, 3.0, 1.4] as const;
    const educationColWeightSum = educationColWeights.reduce((sum, weight) => sum + weight, 0);
    const [degreeColWidth, schoolColWidth, yearsColWidth] = educationColWeights.map(
      (weight) => (weight / educationColWeightSum) * availableWidth,
    );

    autoTable(doc, {
      startY: this.generator.currentY,
      margin: { left: margin, right: margin },
      tableWidth: availableWidth,
      theme: "plain",
      body: EDUCATION_ENTRIES.map((e) => [this.t(`aboutPage:educationEntries.${e.key}`), e.school, e.years] as string[]),
      bodyStyles: {
        fontSize: 8.5,
        cellPadding: { top: 0.08, bottom: 0.08, left: 0.1, right: 0.1 },
        lineWidth: { bottom: 0.006 },
        lineColor: [215, 218, 228],
      },
      alternateRowStyles: { fillColor: [247, 248, 252] },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: degreeColWidth, textColor: [18, 22, 40] },
        1: { cellWidth: schoolColWidth, textColor: [80, 85, 100] },
        2: { cellWidth: yearsColWidth, halign: "right", textColor: [pr, pg, pb], fontStyle: "bold" },
      },
    });

    const finalY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY;
    if (finalY !== undefined) {
      this.generator.setCurrentY(finalY + 0.15);
    }
  }

  // ---------------------------------------------------------------------------
  // Open Source Projects — thumbnail cards with logos
  // ---------------------------------------------------------------------------

  private drawOpenSourceEntry({ entry, logo }: DrawOpenSourceEntryArgs): void {
    const { doc, margin, availableWidth } = this;
    const { r: pr, g: pg, b: pb } = this.primaryColor;
    const { key, tags, githubUrl } = entry;

    this.ensureSpace(1.05);
    const entryY = this.generator.currentY;
    const contentX = margin + CARD_CONTENT_X;
    const contentWidth = availableWidth - CARD_CONTENT_X;

    doc.setDrawColor(210, 213, 225);
    doc.setLineWidth(0.008);
    doc.roundedRect(margin, entryY, CARD_LOGO, CARD_LOGO, 0.05, 0.05, "S");

    if (logo) {
      const pad = 0.05;
      const innerSize = CARD_LOGO - pad * 2;
      const fit = fitImageInBox({ naturalWidth: logo.width, naturalHeight: logo.height, boxWidth: innerSize, boxHeight: innerSize });
      doc.addImage(logo.dataUri, "PNG", margin + pad + fit.offsetX, entryY + pad + fit.offsetY, fit.width, fit.height);
    }

    let y = entryY + 0.17;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(18, 22, 40);
    doc.text(this.t(`achievements:projects.${key}.title`), contentX, y);

    y += 0.2;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(pr, pg, pb);
    const ghLabel = `github.com/${githubUrl.split("github.com/")[1]}`;
    doc.textWithLink(ghLabel, contentX, y, { url: githubUrl });

    y += 0.2;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(48, 52, 65);
    const descLines = doc.splitTextToSize(this.t(`achievements:projects.${key}.description`), contentWidth) as string[];
    descLines.forEach((line, i) => doc.text(line, contentX, y + i * 0.168));
    y += descLines.length * 0.168;

    y += 0.07;
    y = this.drawPillBadges({ tags, startX: contentX, y, availableWidth: contentWidth });

    const entryBottom = Math.max(y, entryY + CARD_LOGO + 0.06);

    doc.setDrawColor(215, 218, 228);
    doc.setLineWidth(0.006);
    doc.line(margin, entryBottom + 0.09, margin + availableWidth, entryBottom + 0.09);

    this.generator.setCurrentY(entryBottom + 0.22);
  }

  private async addOpenSourceSection(): Promise<void> {
    this.addSectionTitle(this.t("achievements:title"));
    const logos = await Promise.all(OPENSOURCE_PROJECT_ENTRIES.map(({ logo }) => loadLogoForPdf(logo)));
    for (const [index, entry] of OPENSOURCE_PROJECT_ENTRIES.entries()) {
      this.drawOpenSourceEntry({ entry, logo: logos[index] });
    }
  }

  // ---------------------------------------------------------------------------
  // AI & ML Projects — cards
  // ---------------------------------------------------------------------------

  private drawAiEntry({ entry }: DrawAiEntryArgs): void {
    const { doc, margin, availableWidth } = this;
    const { key, tags } = entry;

    this.ensureSpace(1.1);
    const entryY = this.generator.currentY;
    let y = entryY;
    const company = this.t(`ai:projects.${key}.company`);

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(18, 22, 40);
    doc.text(this.t(`ai:projects.${key}.title`), margin, y + 0.17);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(105, 110, 125);
    doc.text(company, margin + availableWidth - doc.getTextWidth(company), y + 0.17);

    y += 0.34;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(48, 52, 65);
    const descLines = doc.splitTextToSize(this.t(`ai:projects.${key}.description`), availableWidth) as string[];
    descLines.forEach((line, i) => doc.text(line, margin, y + i * 0.178));
    y += descLines.length * 0.178;

    y += 0.07;
    doc.setFontSize(8);
    const bullets = this.t(`ai:projects.${key}.bullets`, { returnObjects: true }) as unknown as string[];
    for (const bullet of bullets) {
      const lines = doc.splitTextToSize(`• ${bullet}`, availableWidth) as string[];
      lines.forEach((line, i) => doc.text(line, margin, y + i * 0.175));
      y += lines.length * 0.175;
    }

    y += 0.1;
    y = this.drawPillBadges({ tags, startX: margin, y, availableWidth });

    doc.setDrawColor(215, 218, 228);
    doc.setLineWidth(0.006);
    doc.line(margin, y + 0.09, margin + availableWidth, y + 0.09);

    this.generator.setCurrentY(y + 0.22);
  }

  private addAiSection(): void {
    this.addSectionTitle(this.t("ai:title"));
    for (const entry of AI_PROJECT_ENTRIES) {
      this.drawAiEntry({ entry });
    }
  }

  // ---------------------------------------------------------------------------
  // Footers
  // ---------------------------------------------------------------------------

  private renderPageFooter({ currentPage, totalPages, mailIconUri, githubIconUri, startY, textY, iconY, cellWidth, iconSize, iconGap }: RenderPageFooterArgs): void {
    const { doc, generator } = this;

    doc.setPage(currentPage);

    doc.setDrawColor(200, 203, 215);
    doc.setLineWidth(0.007);
    doc.line(generator.margin, startY, generator.margin + generator.availableWidth, startY);

    doc.setFontSize(generator.footerFontSizePoints);
    doc.setFont(generator.font, "normal");
    doc.setTextColor(80, 85, 100);

    const emailLabel = "amwebexpert@gmail.com";
    const emailUrl = "mailto:amwebexpert@gmail.com";
    doc.addImage(mailIconUri, "PNG", generator.margin, iconY, iconSize, iconSize);
    doc.link(generator.margin, iconY, iconSize, iconSize, { url: emailUrl });
    doc.textWithLink(emailLabel, generator.margin + iconSize + iconGap, textY, { url: emailUrl });

    const ghLabel = "github.com/amwebexpert";
    const ghUrl = "https://github.com/amwebexpert";
    const ghTextWidth = doc.getTextWidth(ghLabel);
    const ghRowWidth = iconSize + iconGap + ghTextWidth;
    const centerX = generator.margin + cellWidth * 1.5;
    const ghRowLeft = centerX - ghRowWidth / 2;
    doc.addImage(githubIconUri, "PNG", ghRowLeft, iconY, iconSize, iconSize);
    doc.link(ghRowLeft, iconY, iconSize, iconSize, { url: ghUrl });
    doc.textWithLink(ghLabel, ghRowLeft + iconSize + iconGap, textY, { url: ghUrl });

    const pageLabel = this.buildFooterCell({ align: "right", currentPage, totalPages });
    doc.text(pageLabel, generator.margin + generator.availableWidth - doc.getTextWidth(pageLabel), textY);
  }

  private async renderFooters(): Promise<void> {
    const { doc, generator } = this;
    const { r: pr, g: pg, b: pb } = this.primaryColor;
    const iconColor = `rgb(${pr}, ${pg}, ${pb})`;
    const totalPages = doc.getNumberOfPages();

    const [mailIconUri, githubIconUri] = await Promise.all([
      buildResumePdfIconDataUri({ pathD: RESUME_PDF_CONTACT_ICON_PATHS.mail, color: iconColor }),
      buildResumePdfIconDataUri({ pathD: RESUME_PDF_CONTACT_ICON_PATHS.github, color: iconColor }),
    ]);

    const cellWidth = generator.availableWidth / 3;
    const startY = generator.pageHeight - generator.margin - generator.footerHeight;
    const textY = startY + generator.footerHeight * 0.65;
    const iconSize = 0.11;
    const iconGap = 0.05;
    const iconY = textY - iconSize * 0.78;

    for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
      this.renderPageFooter({ currentPage, totalPages, mailIconUri, githubIconUri, startY, textY, iconY, cellWidth, iconSize, iconGap });
    }
  }

  // ---------------------------------------------------------------------------
  // Entry point
  // ---------------------------------------------------------------------------

  async build(): Promise<string> {
    await this.drawCoverPage();
    await yieldToMainThread();

    this.startSection();
    await this.addExperienceSection();
    await yieldToMainThread();
    this.addEducationSection();
    await yieldToMainThread();

    this.startSection();
    await this.addOpenSourceSection();
    await yieldToMainThread();

    this.startSection();
    this.addAiSection();
    await yieldToMainThread();

    await this.renderFooters();
    this.generator.save();

    return this.generator.filename;
  }
}
