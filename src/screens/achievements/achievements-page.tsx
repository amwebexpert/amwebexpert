import { Col, Row, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { ProjectCard, type ProjectInfo } from "./project-card";

const OPENSOURCE_PROJECTS: ProjectInfo[] = [
  {
    title: "Web Toolbox",
    description: "ReactJS/TypeScript collection of developer tools. Includes formatters, converters, and utilities. Available as a desktop app via Electron.",
    tags: ["React", "TypeScript", "Redux", "Electron", "Material-UI"],
    githubUrl: "https://github.com/amwebexpert/etoolbox",
  },
  {
    title: "amwebexpert",
    description: "Interactive professional CV and portfolio webapp. React/TypeScript SPA with Ant Design, TanStack Router, multilingual support (EN/FR), and GitHub Pages deployment.",
    tags: ["React", "TypeScript", "Ant Design", "TanStack Router", "Vite", "i18next"],
    githubUrl: "https://github.com/amwebexpert/amwebexpert",
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

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("achievements:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("achievements:subtitle")}
      </Typography.Paragraph>

      <Row gutter={[16, 16]}>
        {OPENSOURCE_PROJECTS.map((project) => (
          <Col xs={24} md={12} key={project.title}>
            <ProjectCard project={project} githubLabel={t("achievements:viewOnGitHub")} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
