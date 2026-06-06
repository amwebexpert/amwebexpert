import { yieldToMainThread } from "@lichens-innovation/ts-common";
import { DEFAULT_THEME, PdfGenerator, type ThemeConfig } from "@lichens-innovation/ts-common/pdf";
import { fetchUrlAsDataUri } from "@lichens-innovation/ts-common/web";
import i18next from "i18next";
import { autoTable } from "jspdf-autotable";
import { AI_PROJECTS } from "~/screens/ai/ai-page";
import { EDUCATION_ENTRIES } from "~/screens/about/education.data";
import { EXPERIENCE_ENTRIES } from "~/screens/about/experience.data";
import { OPENSOURCE_PROJECT_ENTRIES } from "~/screens/achievements/opensource-projects.data";
import { TECH_CATEGORIES } from "~/screens/technologies/technologies-page";
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

const rasterizeSvgToPng = (svg: string, size = 256): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to rasterize SVG"));
    };
    img.src = objectUrl;
  });

const loadLogoForPdf = async (relativePath: string): Promise<string> => {
  const url = `${window.location.origin}${import.meta.env.BASE_URL}${relativePath}`;
  if (relativePath.endsWith(".svg")) {
    const svgText = await fetch(url).then((r) => r.text());
    return rasterizeSvgToPng(svgText, 256);
  }
  return (await fetchUrlAsDataUri(url)) ?? "";
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

  const logoDataUris = await Promise.all(
    EXPERIENCE_ENTRIES.map((entry) => loadLogoForPdf(entry.logoLight)),
  );

  for (const [index, entry] of EXPERIENCE_ENTRIES.entries()) {
    ensureSpace(generator, 1.5);
    const entryY = generator.currentY;
    const contentX = margin + CONTENT_OFFSET;
    const contentWidth = availableWidth - CONTENT_OFFSET;
    const logoDataUri = logoDataUris[index];

    // Logo box — white fill + primary border
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.012);
    doc.roundedRect(margin, entryY, LOGO_BOX, LOGO_BOX, 0.06, 0.06, "FD");

    if (logoDataUri) {
      doc.addImage(logoDataUri, "PNG", margin + LOGO_IMG_PAD, entryY + LOGO_IMG_PAD, LOGO_IMG, LOGO_IMG);
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
      doc.text(lines, contentX, y);
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
      0: { fontStyle: "bold", cellWidth: 3.1, textColor: [18, 22, 40] },
      1: { cellWidth: 3.0, textColor: [80, 85, 100] },
      2: { cellWidth: 1.4, halign: "right", textColor: [pr, pg, pb], fontStyle: "bold" },
    },
  });

  const finalY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY;
  if (finalY !== undefined) {
    generator.setCurrentY(finalY + 0.15);
  }
};

// ---------------------------------------------------------------------------
// Technologies — tinted category bands + inline pills
// ---------------------------------------------------------------------------

const addTechnologiesSection = (generator: PdfGenerator, locale: string): void => {
  const doc = generator.getDoc();
  const { margin, availableWidth } = generator;
  const { r: pr, g: pg, b: pb } = RESUME_THEME.primaryColor;

  addSectionTitle(generator, t("technologies:title", locale));

  for (const { key, techs } of TECH_CATEGORIES) {
    ensureSpace(generator, 0.65);
    const y = generator.currentY;
    const bandH = 0.21;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(pr, pg, pb);
    doc.text(t(`technologies:${key}`, locale), margin, y + bandH / 2 + 8.5 / 72 / 2);

    const pillsStartY = y + bandH + 0.19;
    const newY = drawPillBadges({ doc, tags: techs, startX: margin, y: pillsStartY, availableWidth });

    generator.setCurrentY(newY + 0.12);
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

  const logoDataUris = await Promise.all(
    OPENSOURCE_PROJECT_ENTRIES.map(({ logo }) => loadLogoForPdf(logo)),
  );

  for (const [index, { key, tags, githubUrl }] of OPENSOURCE_PROJECT_ENTRIES.entries()) {
    ensureSpace(generator, 1.05);
    const entryY = generator.currentY;
    const contentX = margin + CARD_CONTENT_X;
    const contentWidth = availableWidth - CARD_CONTENT_X;
    const logoDataUri = logoDataUris[index];

    // Logo thumbnail with border
    doc.setDrawColor(210, 213, 225);
    doc.setLineWidth(0.008);
    doc.roundedRect(margin, entryY, CARD_LOGO, CARD_LOGO, 0.05, 0.05, "S");
    if (logoDataUri) {
      const pad = 0.05;
      doc.addImage(logoDataUri, "PNG", margin + pad, entryY + pad, CARD_LOGO - pad * 2, CARD_LOGO - pad * 2);
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
    doc.text(descLines, contentX, y);
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

  for (const project of AI_PROJECTS) {
    ensureSpace(generator, 1.1);
    const entryY = generator.currentY;
    let y = entryY;

    // Title + Company row
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(18, 22, 40);
    doc.text(project.title, margin, y + 0.17);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(105, 110, 125);
    const companyW = doc.getTextWidth(project.company);
    doc.text(project.company, margin + availableWidth - companyW, y + 0.17);

    y += 0.34;

    // Description
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(48, 52, 65);
    const descLines = doc.splitTextToSize(project.description, availableWidth) as string[];
    doc.text(descLines, margin, y);
    y += descLines.length * 0.178;

    // Bullets
    y += 0.07;
    doc.setFontSize(8);
    for (const bullet of project.bullets) {
      const lines = doc.splitTextToSize(`• ${bullet}`, availableWidth) as string[];
      doc.text(lines, margin, y);
      y += lines.length * 0.175;
    }

    // Tags
    y += 0.1;
    y = drawPillBadges({ doc, tags: project.tags, startX: margin, y, availableWidth });

    // Separator
    doc.setDrawColor(215, 218, 228);
    doc.setLineWidth(0.006);
    doc.line(margin, y + 0.09, margin + availableWidth, y + 0.09);

    generator.setCurrentY(y + 0.22);
  }
};

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

const addContactSection = (generator: PdfGenerator, locale: string): void => {
  const doc = generator.getDoc();
  const { margin, availableWidth } = generator;
  const { r: pr, g: pg, b: pb } = RESUME_THEME.primaryColor;
  const isFr = locale === "fr";

  addSectionTitle(generator, t("contact:title", locale));

  autoTable(doc, {
    startY: generator.currentY,
    margin: { left: margin, right: margin },
    tableWidth: availableWidth,
    theme: "plain",
    body: [
      [isFr ? "Courriel" : "Email", "amwebexpert@gmail.com"],
      ["LinkedIn", "https://www.linkedin.com/in/amwebexpert/"],
      ["GitHub", "https://github.com/amwebexpert"],
      [isFr ? "Localisation" : "Location", "Montréal, Québec, Canada"],
    ],
    bodyStyles: {
      fontSize: 9,
      cellPadding: { top: 0.08, bottom: 0.08, left: 0.1, right: 0.1 },
      lineWidth: { bottom: 0.006 },
      lineColor: [215, 218, 228],
    },
    alternateRowStyles: { fillColor: [247, 248, 252] },
    columnStyles: {
      0: { cellWidth: 1.5, fontStyle: "bold", textColor: [pr, pg, pb] },
      1: { cellWidth: 6.0, textColor: [48, 52, 65] },
    },
  });
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

const renderResumeFooters = (generator: PdfGenerator, footerCellBuilder: ResumeFooterCellBuilder): void => {
  const doc = generator.getDoc();
  const totalPages = doc.getNumberOfPages();
  const cellWidth = generator.availableWidth / 3;
  const columnStyles = {
    0: { cellWidth, halign: "left" as const },
    1: { cellWidth, halign: "center" as const },
    2: { cellWidth, halign: "right" as const },
  };
  const startY = generator.pageHeight - generator.margin - generator.footerHeight;

  for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
    doc.setPage(currentPage);
    const footerCells = (["left", "center", "right"] as const).map((align) => ({
      content: footerCellBuilder({ align, currentPage, totalPages }),
    }));

    autoTable(doc, {
      startY,
      body: [footerCells],
      theme: "plain",
      bodyStyles: { fontSize: generator.footerFontSizePoints, font: generator.font },
      margin: { left: generator.margin, right: generator.margin },
      columnStyles,
    });
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

  // Technologies
  startSection(generator);
  addTechnologiesSection(generator, locale);
  await yieldToMainThread();

  // Achievements & AI
  startSection(generator);
  await addOpenSourceSection(generator, locale);
  await yieldToMainThread();
  addAiSection(generator, locale);
  await yieldToMainThread();

  // Contact
  startSection(generator);
  addContactSection(generator, locale);
  await yieldToMainThread();

  renderResumeFooters(generator, footerCellBuilder);
  generator.save();

  return filename;
};
