import { yieldToMainThread } from "@lichens-innovation/ts-common";
import { DEFAULT_THEME, Gaps, PdfColors, PdfGenerator, type ThemeConfig } from "@lichens-innovation/ts-common/pdf";
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

// ---------------------------------------------------------------------------
// Cover page
// ---------------------------------------------------------------------------

type JsPdfDoc = ReturnType<PdfGenerator["getDoc"]>;

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

  // --- Profile picture ---
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

  // --- Name ---
  let y = pictureCy + pictureRadius + 0.48;
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("André Masson", centerX, y, { align: "center" });

  // --- Role ---
  y += 0.4;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(pr, pg, pb);
  const role = isFr ? EXPERIENCE_ENTRIES[0].roleFr : EXPERIENCE_ENTRIES[0].role;
  const roleLabel = `${role} — ${EXPERIENCE_ENTRIES[0].company}`;
  doc.text(roleLabel, centerX, y, { align: "center" });

  // --- Tagline ---
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

  // --- Contact links ---
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

  // --- Summary ---
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
// Section title (dark band with white text, drawn directly on doc)
// ---------------------------------------------------------------------------

const addSectionTitle = (generator: PdfGenerator, title: string): void => {
  const doc = generator.getDoc();
  const { r: pr, g: pg, b: pb } = RESUME_THEME.primaryColor;
  const { margin, availableWidth } = generator;
  const bandH = 0.22;
  const bandY = generator.currentY;

  doc.setFillColor(pr, pg, pb);
  doc.rect(margin, bandY, availableWidth, bandH, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), margin + 0.1, bandY + bandH / 2 + 9 / 72 / 2);

  doc.setTextColor(0, 0, 0);

  generator.setCurrentY(bandY + bandH);
  generator.addVerticalGap(Gaps.SMALL);
};

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

const addExperienceSection = (generator: PdfGenerator, locale: string): void => {
  const isFr = locale === "fr";
  addSectionTitle(generator, t("aboutPage:experienceTitle", locale));

  for (const entry of EXPERIENCE_ENTRIES) {
    const role = isFr ? entry.roleFr : entry.role;
    const bullets = isFr ? entry.bulletsFr : entry.bullets;

    generator.addTable({
      body: [[entry.company, role, entry.period]],
      columnWidths: [2.2, 3.55, 1.75],
      columnStyles: {
        0: { fontStyle: "bold", fillColor: PdfColors.LIGHT_GRAY },
        2: { halign: "right" },
      },
    });

    generator.addTable({
      body: bullets.map((b) => [`• ${b}`]),
      columnWidths: [generator.availableWidth],
      drawLineForTable: false,
      drawLineForCells: false,
    });

    if (entry.tags && entry.tags.length > 0) {
      generator.addTable({
        body: [[entry.tags.join(" · ")]],
        columnWidths: [generator.availableWidth],
        drawLineForTable: false,
        drawLineForCells: false,
        columnStyles: { 0: { fontStyle: "bold" } },
      });
    }

    generator.addVerticalGap(Gaps.MEDIUM);
  }
};

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

const addEducationSection = (generator: PdfGenerator, locale: string): void => {
  const isFr = locale === "fr";
  addSectionTitle(generator, t("aboutPage:educationTitle", locale));

  generator.addTable({
    body: EDUCATION_ENTRIES.map((e) => [isFr ? e.degree : e.degreeEn, e.school, e.years]),
    columnWidths: [3.0, 3.0, 1.5],
    columnStyles: {
      0: { fontStyle: "bold" },
      2: { halign: "right" },
    },
  });

  generator.addVerticalGap(Gaps.MEDIUM);
};

// ---------------------------------------------------------------------------
// Technologies
// ---------------------------------------------------------------------------

const addTechnologiesSection = (generator: PdfGenerator, locale: string): void => {
  addSectionTitle(generator, t("technologies:title", locale));

  generator.addTable({
    body: TECH_CATEGORIES.map(({ key, techs }) => [t(`technologies:${key}`, locale), techs.join(", ")]),
    columnWidths: [1.8, 5.7],
    columnStyles: {
      0: { fontStyle: "bold", fillColor: PdfColors.LIGHT_GRAY },
    },
  });
};

// ---------------------------------------------------------------------------
// Open Source Projects
// ---------------------------------------------------------------------------

const addOpenSourceSection = (generator: PdfGenerator, locale: string): void => {
  addSectionTitle(generator, t("achievements:title", locale));

  for (const { key, tags, githubUrl } of OPENSOURCE_PROJECT_ENTRIES) {
    const title = t(`achievements:projects.${key}.title`, locale);
    const description = t(`achievements:projects.${key}.description`, locale);

    generator.addTable({
      body: [[title, `github.com/${githubUrl.split("github.com/")[1]}`]],
      columnWidths: [5.0, 2.5],
      columnStyles: {
        0: { fontStyle: "bold", fillColor: PdfColors.LIGHT_GRAY },
        1: { halign: "right" },
      },
    });

    generator.addTable({
      body: [[description], [tags.join(" · ")]],
      columnWidths: [generator.availableWidth],
      drawLineForTable: false,
      drawLineForCells: false,
      columnStyles: { 0: {} },
    });

    generator.addVerticalGap(Gaps.SMALL);
  }

  generator.addVerticalGap(Gaps.MEDIUM);
};

// ---------------------------------------------------------------------------
// AI & ML Projects
// ---------------------------------------------------------------------------

const addAiSection = (generator: PdfGenerator, locale: string): void => {
  addSectionTitle(generator, t("ai:title", locale));

  for (const project of AI_PROJECTS) {
    generator.addTable({
      body: [[project.title, project.company]],
      columnWidths: [5.0, 2.5],
      columnStyles: {
        0: { fontStyle: "bold", fillColor: PdfColors.LIGHT_GRAY },
        1: { halign: "right" },
      },
    });

    generator.addTable({
      body: [[project.description], ...project.bullets.map((b) => [`• ${b}`])],
      columnWidths: [generator.availableWidth],
      drawLineForTable: false,
      drawLineForCells: false,
    });

    generator.addTable({
      body: [[project.tags.join(" · ")]],
      columnWidths: [generator.availableWidth],
      drawLineForTable: false,
      drawLineForCells: false,
      columnStyles: { 0: { fontStyle: "bold" } },
    });

    generator.addVerticalGap(Gaps.SMALL);
  }
};

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

const addContactSection = (generator: PdfGenerator, locale: string): void => {
  addSectionTitle(generator, t("contact:title", locale));

  const isFr = locale === "fr";

  generator.addTable({
    body: [
      [isFr ? "Courriel" : "Email", "amwebexpert@gmail.com"],
      ["LinkedIn", "https://www.linkedin.com/in/amwebexpert/"],
      ["GitHub", "https://github.com/amwebexpert"],
      [isFr ? "Localisation" : "Location", "Montréal, Québec, Canada"],
    ],
    columnWidths: [1.5, 6.0],
    columnStyles: {
      0: { fontStyle: "bold", fillColor: PdfColors.LIGHT_GRAY },
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
  addExperienceSection(generator, locale);
  await yieldToMainThread();
  addEducationSection(generator, locale);
  await yieldToMainThread();

  // Technologies
  startSection(generator);
  addTechnologiesSection(generator, locale);
  await yieldToMainThread();

  // Achievements & AI
  startSection(generator);
  addOpenSourceSection(generator, locale);
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
