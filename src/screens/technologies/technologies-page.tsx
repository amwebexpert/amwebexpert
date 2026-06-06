import { Col, Row, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { TechCategory } from "./tech-category";

const TECH_CATEGORIES = [
  {
    key: "languages",
    techs: ["TypeScript", "JavaScript", "Kotlin", "Dart", "Python", "Swift"],
  },
  {
    key: "mobile",
    techs: ["Flutter", "React Native", "Android SDK", "iOS / Swift", "Expo", "MobX"],
  },
  {
    key: "frontend",
    techs: ["React", "TanStack Router", "TanStack Query", "Ant Design", "Material-UI", "Redux", "Zustand"],
  },
  {
    key: "backend",
    techs: ["NestJS", "Node.js", "GraphQL", "Apollo", "REST", "OpenApi", "Swagger"],
  },
  {
    key: "databases",
    techs: ["PostgreSQL", "Oracle", "MySQL", "SQLite", "DynamoDB", "SQL Server", "DB2", "Sybase"],
  },
  {
    key: "devtools",
    techs: ["VSCode", "Cursor", "Claude Code", "IntelliJ", "Android Studio", "Xcode", "Git", "GitHub", "Gradle", "Maven", "Jenkins", "SonarQube"],
  },
  {
    key: "cloud",
    techs: ["AWS (S3, DynamoDB)", "Google Cloud", "Firebase", "Auth0", "Docker", "PCF", "GitHub Actions"],
  },
  {
    key: "ai",
    techs: ["PyTorch", "Transformers.js", "RAG / Embeddings", "LLMs", "Vector search", "MCP", "ExecutorTorch", "Tree-sitter"],
  },
];

export const TechnologiesPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("technologies:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("technologies:subtitle")}
      </Typography.Paragraph>

      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          {TECH_CATEGORIES.slice(0, 4).map(({ key, techs }) => (
            <TechCategory key={key} title={t(`technologies:${key}`)} techs={techs} />
          ))}
        </Col>
        <Col xs={24} md={12}>
          {TECH_CATEGORIES.slice(4).map(({ key, techs }) => (
            <TechCategory key={key} title={t(`technologies:${key}`)} techs={techs} />
          ))}
        </Col>
      </Row>
    </div>
  );
};
