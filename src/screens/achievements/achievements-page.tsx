import { Col, Row, Tabs, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { ProjectCard, type ProjectInfo } from "./project-card";

const ENTERPRISE_PROJECTS: ProjectInfo[] = [
  {
    title: "Desjardins — AccesD Platform",
    description: "AccesD platform: Funds & PGLM management, N3 enterprise frameworks, electronic documents architecture.",
    tags: ["Spring Boot", "Oracle", "REST", "TypeScript"],
  },
  {
    title: "La Presse — Météo Média",
    description: "FTP module for Météo Média weather data retrieval. Automated template generation for weather statistics reporting.",
    tags: ["Spring Boot", "FTP", "JasperReport", "iText"],
  },
  {
    title: "ARMM — Drug Research Module",
    description: "Drug research module and membership management screens for pharmaceutical research system.",
    tags: ["Spring Boot", "Hibernate", "SQL Server"],
  },
];

const OPENSOURCE_PROJECTS: ProjectInfo[] = [
  {
    title: "Web Toolbox",
    description: "ReactJS/TypeScript collection of developer tools. Includes formatters, converters, and utilities. Available as a desktop app via Electron.",
    tags: ["React", "TypeScript", "Redux", "Electron", "Material-UI"],
    githubUrl: "https://github.com/amwebexpert/etoolbox",
  },
  {
    title: "Resume Template",
    description: "Responsive Bootstrap CV template with multilingual support (EN/FR) and GitHub Pages deployment.",
    tags: ["Bootstrap", "TypeScript", "i18next"],
    githubUrl: "https://github.com/amwebexpert/resume-template",
  },
  {
    title: "Guess the Text",
    description: "Flutter/Dart educational word game (hangman). State management with MobX, local DB with Sembast/sqflite, Node.js backend.",
    tags: ["Flutter", "Dart", "MobX", "SQLite", "Node.js"],
    githubUrl: "https://github.com/amwebexpert/guess_the_text",
  },
  {
    title: "Chrome Extensions Collection",
    description: "Collection of Chrome extensions to streamline developer workflows. Tab management, clipboard helpers, and productivity utilities.",
    tags: ["TypeScript", "React", "Chrome API", "Vite"],
    githubUrl: "https://github.com/amwebexpert/chrome-extensions-collection",
  },
  {
    title: "Open Mindset App",
    description: "Python native desktop app for mindset journaling and personal growth tracking, built with KivyMD.",
    tags: ["Python", "KivyMD", "SQLite"],
    githubUrl: "https://github.com/amwebexpert/open-mindset",
  },
];

export const AchievementsPage: FunctionComponent = () => {
  const { t } = useTranslation();

  const tabItems = [
    {
      key: "enterprise",
      label: t("achievements:enterprise"),
      children: (
        <Row gutter={[16, 16]}>
          {ENTERPRISE_PROJECTS.map((project) => (
            <Col xs={24} md={12} key={project.title}>
              <ProjectCard project={project} githubLabel={t("achievements:viewOnGitHub")} />
            </Col>
          ))}
        </Row>
      ),
    },
    {
      key: "opensource",
      label: t("achievements:opensource"),
      children: (
        <Row gutter={[16, 16]}>
          {OPENSOURCE_PROJECTS.map((project) => (
            <Col xs={24} md={12} key={project.title}>
              <ProjectCard project={project} githubLabel={t("achievements:viewOnGitHub")} />
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("achievements:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("achievements:subtitle")}
      </Typography.Paragraph>

      <Tabs items={tabItems} />
    </div>
  );
};
