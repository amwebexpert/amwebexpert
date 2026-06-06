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

export interface GenerateResumePdfArgs {
  locale: string;
}

const RESUME_THEME: ThemeConfig = {
  ...DEFAULT_THEME,
  primaryColor: { r: 30, g: 58, b: 95 },
};

const t = (key: string, locale: string, opts?: Record<string, unknown>) =>
  i18next.t(key, { lng: locale, ...opts });

type JsPdfDoc = ReturnType<PdfGenerator["getDoc"]>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const rasterizeSvgToPng = (svg: string, maxSize = 256): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const [canvasW, canvasH] =
        aspectRatio >= 1
          ? [maxSize, Math.round(maxSize / aspectRatio)]
          : [Math.round(maxSize * aspectRatio), maxSize];

      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvasW, canvasH);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to rasterize SVG"));
    };
    img.src = objectUrl;
  });

interface LogoForPdf {
  dataUri: string;
  width: number;
  height: number;
}

const loadLogoForPdf = async (relativePath: string): Promise<LogoForPdf | null> => {
  const url = `${window.location.origin}${import.meta.env.BASE_URL}${relativePath}`;
  const dataUri = relativePath.endsWith(".svg")
    ? await fetch(url)
        .then((r) => r.text())
        .then((svgText) => rasterizeSvgToPng(svgText, 256))
    : ((await fetchUrlAsDataUri(url)) ?? "");

  if (!dataUri) return null;

  const { width, height } = await getImageDimensions(dataUri);
  return { dataUri, width, height };
};

const fitImageInBox = (
  naturalWidth: number,
  naturalHeight: number,
  boxWidth: number,
  boxHeight: number,
): { offsetX: number; offsetY: number; width: number; height: number } => {
  const aspectRatio = naturalWidth / naturalHeight;
  let width = boxWidth;
  let height = boxWidth / aspectRatio;

  if (height > boxHeight) {
    height = boxHeight;
    width = boxHeight * aspectRatio;
  }

  return {
    offsetX: (boxWidth - width) / 2,
    offsetY: (boxHeight - height) / 2,
    width,
    height,
  };
};

interface DrawPillBadgesArgs {
  doc: JsPdfDoc;
  tags: string[];
  startX: number;
  y: number;
  availableWidth: number;
}

const drawPillBadges = ({ doc, tags, startX, y, availableWidth }: DrawPillBadgesArgs): number => {
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
};

const ensureSpace = (generator: PdfGenerator, needed: number): void => {
  if (generator.currentY + needed > generator.pageHeight - generator.margin - generator.footerHeight) {
    generator.addPage();
    generator.setCurrentY(generator.margin);
  }
};

// ---------------------------------------------------------------------------
// Cover page
// ---------------------------------------------------------------------------

const getImageDimensions = (dataUri: string): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Failed to load image dimensions"));
    img.src = dataUri;
  });

const drawCircleClippedImage = (
  doc: JsPdfDoc,
  dataUri: string,
  cx: number,
  cy: number,
  r: number,
  aspectRatio: number,
): void => {
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
};

const drawCenteredContactLink = (
  doc: JsPdfDoc,
  centerX: number,
  y: number,
  iconDataUri: string,
  label: string,
  url: string,
): void => {
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
};

const drawCoverPage = async (generator: PdfGenerator, locale: string): Promise<void> => {
  const doc = generator.getDoc();
  const { margin, pageWidth } = generator;
  const { r: pr, g: pg, b: pb } = RESUME_THEME.primaryColor;
  const centerX = pageWidth / 2;
  const isFr = locale === "fr";

  const profileUrl = `${window.location.origin}${import.meta.env.BASE_URL}profile.jpg`;
  const profileDataUri = await fetchUrlAsDataUri(profileUrl);

  const pictureRadius = 0.85;
  const pictureCx = centerX;
  const pictureCy = margin + 0.6 + pictureRadius;

  if (profileDataUri) {
    const { width, height } = await getImageDimensions(profileDataUri);
    drawCircleClippedImage(doc, profileDataUri, pictureCx, pictureCy, pictureRadius, width / height);
  }

  doc.setDrawColor(pr, pg, pb);
  doc.setLineWidth(0.025);
  doc.circle(pictureCx, pictureCy, pictureRadius, "S");

  let y = pictureCy + pictureRadius + 0.48;
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("André Masson", centerX, y, { align: "center" });

  y += 0.4;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(pr, pg, pb);
  const role = isFr ? EXPERIENCE_ENTRIES[0].roleFr : EXPERIENCE_ENTRIES[0].role;
  const roleLabel = `${role} — ${EXPERIENCE_ENTRIES[0].company}`;
  doc.text(roleLabel, centerX, y, { align: "center" });

  y += 0.3;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  const tagline = isFr
    ? "20+ ans à concevoir des applications mobiles, plateformes web, logiciels d'entreprise et IA industrielle pour les mines"
    : "20+ years building mobile apps, web platforms, enterprise software & industrial AI for mining";
  const taglineLines = doc.splitTextToSize(tagline, 5.5) as string[];
  doc.text(taglineLines, centerX, y, { align: "center" });
  y += taglineLines.length * 0.16;

  y += 0.18;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(pr, pg, pb);

  const iconColor = `rgb(${pr}, ${pg}, ${pb})`;
  const contactLinks = [
    {
      label: "amwebexpert@gmail.com",
      url: "mailto:amwebexpert@gmail.com",
      iconPath: RESUME_PDF_CONTACT_ICON_PATHS.mail,
    },
    {
      label: "github.com/amwebexpert",
      url: "https://github.com/amwebexpert",
      iconPath: RESUME_PDF_CONTACT_ICON_PATHS.github,
    },
    {
      label: "linkedin.com/in/amwebexpert",
      url: "https://www.linkedin.com/in/amwebexpert/",
      iconPath: RESUME_PDF_CONTACT_ICON_PATHS.linkedin,
    },
  ] as const;

  const iconDataUris = await Promise.all(
    contactLinks.map(({ iconPath }) => buildResumePdfIconDataUri(iconPath, iconColor)),
  );

  for (const [index, { label, url }] of contactLinks.entries()) {
    drawCenteredContactLink(doc, centerX, y, iconDataUris[index], label, url);
    y += 0.2;
  }

  const summaryWidth = 5.0;

  y += 0.45;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(pr, pg, pb);
  doc.text(t("aboutPage:summaryTitle", locale), centerX, y, { align: "center" });

  y += 0.22;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  const summaryLines = doc.splitTextToSize(t("aboutPage:summary", locale), summaryWidth) as string[];
  doc.text(summaryLines, centerX, y, { align: "center" });
};

// ---------------------------------------------------------------------------
// Section title (dark band, white text)
// ---------------------------------------------------------------------------

const addSectionTitle = (generator: PdfGenerator, title: string): void => {
  const doc = generator.getDoc();
  const { r: pr, g: pg, b: pb } = RESUME_THEME.primaryColor;
  const { margin } = generator;
  const y = generator.currentY;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(pr, pg, pb);
  doc.text(title, margin, y + 0.15);

  doc.setTextColor(0, 0, 0);
  generator.setCurrentY(y + 0.32);
};

// ---------------------------------------------------------------------------
// Experience — timeline layout with company logos
// ---------------------------------------------------------------------------

const LOGO_BOX = 0.72;
const LOGO_IMG = 0.5;
const LOGO_IMG_PAD = (LOGO_BOX - LOGO_IMG) / 2;
const TIMELINE_CX = LOGO_BOX / 2;
const CONTENT_OFFSET = LOGO_BOX + 0.18;

const addExperienceSection = async (generator: PdfGenerator, locale: string): Promise<void> => {
  const isFr = locale === "fr";
  const doc = generator.getDoc();
  const { margin, availableWidth } = generator;
  const { r: pr, g: pg, b: pb } = RESUME_THEME.primaryColor;

  addSectionTitle(generator, t("aboutPage:experienceTitle", locale));

  const logos = await Promise.all(
    EXPERIENCE_ENTRIES.map((entry) => loadLogoForPdf(entry.logoLight)),
  );

  for (const [index, entry] of EXPERIENCE_ENTRIES.entries()) {
    ensureSpace(generator, 1.5);
    const entryY = generator.currentY;
    const contentX = margin + CONTENT_OFFSET;
    const contentWidth = availableWidth - CONTENT_OFFSET;
    const logo = logos[index];

    // Logo box — white fill + primary border
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.012);
    doc.roundedRect(margin, entryY, LOGO_BOX, LOGO_BOX, 0.06, 0.06, "FD");

    if (logo) {
      const fit = fitImageInBox(logo.width, logo.height, LOGO_IMG, LOGO_IMG);
      doc.addImage(
        logo.dataUri,
        "PNG",
        margin + LOGO_IMG_PAD + fit.offsetX,
        entryY + LOGO_IMG_PAD + fit.offsetY,
        fit.width,
        fit.height,
      );
    }

    // Role
    let y = entryY + 0.2;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(18, 22, 40);
    doc.text(isFr ? entry.roleFr : entry.role, contentX, y);

    // Company · Period
    y += 0.22;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(105, 110, 125);
    doc.text(`${entry.company}  ·  ${entry.period}`, contentX, y);

    // Bullets
    y += 0.24;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(48, 52, 65);
    const bullets = isFr ? entry.bulletsFr : entry.bullets;

    for (const bullet of bullets) {
      const lines = doc.splitTextToSize(`• ${bullet}`, contentWidth) as string[];
      lines.forEach((line, i) => doc.text(line, contentX, y + i * 0.185));
      y += lines.length * 0.185;
    }

    // Tech pills
    if (entry.tags && entry.tags.length > 0) {
      y += 0.1;
      y = drawPillBadges({ doc, tags: entry.tags, startX: contentX, y, availableWidth: contentWidth });
    }

    const entryBottom = Math.max(y, entryY + LOGO_BOX + 0.1);

    // Dashed timeline connector (skip for last entry)
    if (index < EXPERIENCE_ENTRIES.length - 1) {
      const timelineX = margin + TIMELINE_CX;
      doc.setDrawColor(pr, pg, pb);
      doc.setLineWidth(0.01);
      doc.setLineDashPattern([0.04, 0.06], 0);
      doc.line(timelineX, entryY + LOGO_BOX, timelineX, entryBottom + 0.16);
      doc.setLineDashPattern([], 0);
    }

    generator.setCurrentY(entryBottom + 0.2);
  }
};

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

const addEducationSection = (generator: PdfGenerator, locale: string): void => {
  const isFr = locale === "fr";
  const doc = generator.getDoc();
  const { margin, availableWidth } = generator;
  const { r: pr, g: pg, b: pb } = RESUME_THEME.primaryColor;

  addSectionTitle(generator, t("aboutPage:educationTitle", locale));

  const educationColWeights = [3.1, 3.0, 1.4] as const;
  const educationColWeightSum = educationColWeights.reduce((sum, weight) => sum + weight, 0);
  const [degreeColWidth, schoolColWidth, yearsColWidth] = educationColWeights.map(
    (weight) => (weight / educationColWeightSum) * availableWidth,
  );

  autoTable(doc, {
    startY: generator.currentY,
    margin: { left: margin, right: margin },
    tableWidth: availableWidth,
    theme: "plain",
    body: EDUCATION_ENTRIES.map((e) => [isFr ? e.degree : e.degreeEn, e.school, e.years]),
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
    generator.setCurrentY(finalY + 0.15);
  }
};

// ---------------------------------------------------------------------------
// Open Source Projects — thumbnail cards with logos
// ---------------------------------------------------------------------------

const CARD_LOGO = 0.55;
const CARD_CONTENT_X = CARD_LOGO + 0.16;

const addOpenSourceSection = async (generator: PdfGenerator, locale: string): Promise<void> => {
  const doc = generator.getDoc();
  const { margin, availableWidth } = generator;
  const { r: pr, g: pg, b: pb } = RESUME_THEME.primaryColor;

  addSectionTitle(generator, t("achievements:title", locale));

  const logos = await Promise.all(
    OPENSOURCE_PROJECT_ENTRIES.map(({ logo }) => loadLogoForPdf(logo)),
  );

  for (const [index, { key, tags, githubUrl }] of OPENSOURCE_PROJECT_ENTRIES.entries()) {
    ensureSpace(generator, 1.05);
    const entryY = generator.currentY;
    const contentX = margin + CARD_CONTENT_X;
    const contentWidth = availableWidth - CARD_CONTENT_X;
    const logo = logos[index];

    // Logo thumbnail with border
    doc.setDrawColor(210, 213, 225);
    doc.setLineWidth(0.008);
    doc.roundedRect(margin, entryY, CARD_LOGO, CARD_LOGO, 0.05, 0.05, "S");
    if (logo) {
      const pad = 0.05;
      const innerSize = CARD_LOGO - pad * 2;
      const fit = fitImageInBox(logo.width, logo.height, innerSize, innerSize);
      doc.addImage(
        logo.dataUri,
        "PNG",
        margin + pad + fit.offsetX,
        entryY + pad + fit.offsetY,
        fit.width,
        fit.height,
      );
    }

    // Title
    let y = entryY + 0.17;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(18, 22, 40);
    doc.text(t(`achievements:projects.${key}.title`, locale), contentX, y);

    // GitHub link
    y += 0.2;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(pr, pg, pb);
    const ghLabel = `github.com/${githubUrl.split("github.com/")[1]}`;
    doc.textWithLink(ghLabel, contentX, y, { url: githubUrl });

    // Description
    y += 0.2;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(48, 52, 65);
    const descLines = doc.splitTextToSize(
      t(`achievements:projects.${key}.description`, locale),
      contentWidth,
    ) as string[];
    descLines.forEach((line, i) => doc.text(line, contentX, y + i * 0.168));
    y += descLines.length * 0.168;

    // Tags
    y += 0.07;
    y = drawPillBadges({ doc, tags, startX: contentX, y, availableWidth: contentWidth });

    const entryBottom = Math.max(y, entryY + CARD_LOGO + 0.06);

    // Separator
    doc.setDrawColor(215, 218, 228);
    doc.setLineWidth(0.006);
    doc.line(margin, entryBottom + 0.09, margin + availableWidth, entryBottom + 0.09);

    generator.setCurrentY(entryBottom + 0.22);
  }
};

// ---------------------------------------------------------------------------
// AI & ML Projects — cards
// ---------------------------------------------------------------------------

const addAiSection = (generator: PdfGenerator, locale: string): void => {
  const doc = generator.getDoc();
  const { margin, availableWidth } = generator;

  addSectionTitle(generator, t("ai:title", locale));

  for (const { key, tags } of AI_PROJECT_ENTRIES) {
    ensureSpace(generator, 1.1);
    const entryY = generator.currentY;
    let y = entryY;
    const company = t(`ai:projects.${key}.company`, locale);

    // Title + Company row
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(18, 22, 40);
    doc.text(t(`ai:projects.${key}.title`, locale), margin, y + 0.17);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(105, 110, 125);
    const companyW = doc.getTextWidth(company);
    doc.text(company, margin + availableWidth - companyW, y + 0.17);

    y += 0.34;

    // Description
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(48, 52, 65);
    const descLines = doc.splitTextToSize(
      t(`ai:projects.${key}.description`, locale),
      availableWidth,
    ) as string[];
    descLines.forEach((line, i) => doc.text(line, margin, y + i * 0.178));
    y += descLines.length * 0.178;

    // Bullets
    y += 0.07;
    doc.setFontSize(8);
    const bullets = t(`ai:projects.${key}.bullets`, locale, { returnObjects: true }) as unknown as string[];
    for (const bullet of bullets) {
      const lines = doc.splitTextToSize(`• ${bullet}`, availableWidth) as string[];
      lines.forEach((line, i) => doc.text(line, margin, y + i * 0.175));
      y += lines.length * 0.175;
    }

    // Tags
    y += 0.1;
    y = drawPillBadges({ doc, tags, startX: margin, y, availableWidth });

    // Separator
    doc.setDrawColor(215, 218, 228);
    doc.setLineWidth(0.006);
    doc.line(margin, y + 0.09, margin + availableWidth, y + 0.09);

    generator.setCurrentY(y + 0.22);
  }
};

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

const startSection = (generator: PdfGenerator): void => {
  generator.addPage();
  generator.setCurrentY(generator.margin);
};

type ResumeFooterCellBuilder = (args: {
  align: "left" | "center" | "right";
  currentPage: number;
  totalPages: number;
}) => string;

const renderResumeFooters = async (
  generator: PdfGenerator,
  footerCellBuilder: ResumeFooterCellBuilder,
): Promise<void> => {
  const doc = generator.getDoc();
  const totalPages = doc.getNumberOfPages();
  const { r: pr, g: pg, b: pb } = RESUME_THEME.primaryColor;
  const iconColor = `rgb(${pr}, ${pg}, ${pb})`;

  const [mailIconUri, githubIconUri] = await Promise.all([
    buildResumePdfIconDataUri(RESUME_PDF_CONTACT_ICON_PATHS.mail, iconColor),
    buildResumePdfIconDataUri(RESUME_PDF_CONTACT_ICON_PATHS.github, iconColor),
  ]);

  const cellWidth = generator.availableWidth / 3;
  const startY = generator.pageHeight - generator.margin - generator.footerHeight;
  const textY = startY + generator.footerHeight * 0.65;
  const iconSize = 0.11;
  const iconGap = 0.05;
  const iconY = textY - iconSize * 0.78;

  for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
    doc.setPage(currentPage);

    // Thin separator line above footer
    doc.setDrawColor(200, 203, 215);
    doc.setLineWidth(0.007);
    doc.line(generator.margin, startY, generator.margin + generator.availableWidth, startY);

    doc.setFontSize(generator.footerFontSizePoints);
    doc.setFont(generator.font, "normal");
    doc.setTextColor(80, 85, 100);

    // Left: mail icon + email hyperlink
    const emailLabel = "amwebexpert@gmail.com";
    const emailUrl = "mailto:amwebexpert@gmail.com";
    doc.addImage(mailIconUri, "PNG", generator.margin, iconY, iconSize, iconSize);
    doc.link(generator.margin, iconY, iconSize, iconSize, { url: emailUrl });
    doc.textWithLink(emailLabel, generator.margin + iconSize + iconGap, textY, { url: emailUrl });

    // Center: github icon + github link (centered in middle third)
    const ghLabel = "github.com/amwebexpert";
    const ghUrl = "https://github.com/amwebexpert";
    const ghTextWidth = doc.getTextWidth(ghLabel);
    const ghRowWidth = iconSize + iconGap + ghTextWidth;
    const centerX = generator.margin + cellWidth * 1.5;
    const ghRowLeft = centerX - ghRowWidth / 2;
    doc.addImage(githubIconUri, "PNG", ghRowLeft, iconY, iconSize, iconSize);
    doc.link(ghRowLeft, iconY, iconSize, iconSize, { url: ghUrl });
    doc.textWithLink(ghLabel, ghRowLeft + iconSize + iconGap, textY, { url: ghUrl });

    // Right: page number, right-aligned
    const pageLabel = footerCellBuilder({ align: "right", currentPage, totalPages });
    const pageTextWidth = doc.getTextWidth(pageLabel);
    doc.text(pageLabel, generator.margin + generator.availableWidth - pageTextWidth, textY);
  }
};

export const generateResumePdf = async ({ locale }: GenerateResumePdfArgs): Promise<string> => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const filename = `andre-masson-resume-${locale}-${dateStr}.pdf`;

  const footerCellBuilder: ResumeFooterCellBuilder = ({ align, currentPage, totalPages }) => {
    if (align === "left") return "André Masson — amwebexpert@gmail.com";
    if (align === "center") return "github.com/amwebexpert";
    return `${currentPage} / ${totalPages}`;
  };

  const generator = new PdfGenerator({
    filename,
    theme: RESUME_THEME,
    margin: DEFAULT_OPTIONS.margin * 2,
    footerCellBuilder,
  });

  // Page 1: Cover
  await drawCoverPage(generator, locale);
  await yieldToMainThread();

  // Page 2+: Experience & Education
  startSection(generator);
  await addExperienceSection(generator, locale);
  await yieldToMainThread();
  addEducationSection(generator, locale);
  await yieldToMainThread();

  // Achievements
  startSection(generator);
  await addOpenSourceSection(generator, locale);
  await yieldToMainThread();

  // Artificial Intelligence
  startSection(generator);
  addAiSection(generator, locale);
  await yieldToMainThread();

  await renderResumeFooters(generator, footerCellBuilder);
  generator.save();

  return filename;
};
