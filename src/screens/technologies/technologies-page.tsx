import {
  ApiOutlined,
  CloudOutlined,
  DatabaseOutlined,
  JavaScriptOutlined,
  LayoutOutlined,
  MobileOutlined,
  RobotOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import type { FunctionComponent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FadeInItem } from "~/components/fade-in-item";
import { TechCategory } from "./tech-category";

const TECH_CATEGORIES: { key: string; icon: ReactNode; techs: string[] }[] = [
  {
    key: "languages",
    icon: <JavaScriptOutlined />,
    techs: ["TypeScript", "JavaScript", "Java", "Kotlin", "Dart", "Python", "Groovy", "Swift"],
  },
  {
    key: "mobile",
    icon: <MobileOutlined />,
    techs: ["Flutter", "React Native", "Android SDK", "iOS / Swift", "Expo", "React Navigation", "MMKV", "MobX"],
  },
  {
    key: "frontend",
    icon: <LayoutOutlined />,
    techs: ["React", "TanStack Router", "TanStack Query", "Ant Design", "Material-UI", "Redux", "Zustand", "Angular"],
  },
  {
    key: "backend",
    icon: <ApiOutlined />,
    techs: ["NestJS", "Node.js", "Spring Boot", "Grails", "GraphQL", "Apollo", "REST", "RabbitMQ", "OpenApi", "Swagger"],
  },
  {
    key: "databases",
    icon: <DatabaseOutlined />,
    techs: ["PostgreSQL", "Oracle", "MySQL", "SQLite", "DynamoDB", "SQL Server", "DB2", "Sybase"],
  },
  {
    key: "devtools",
    icon: <ToolOutlined />,
    techs: ["VSCode", "Cursor", "Claude Code", "IntelliJ", "Android Studio", "Xcode", "Git", "GitHub", "Gradle", "Maven", "Jenkins", "Cypress", "Jira", "SonarQube"],
  },
  {
    key: "cloud",
    icon: <CloudOutlined />,
    techs: ["AWS (S3, DynamoDB, Cognito)", "Google Cloud", "Firebase", "Auth0", "Okta", "Docker", "PCF", "GitHub Actions"],
  },
  {
    key: "ai",
    icon: <RobotOutlined />,
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
          {TECH_CATEGORIES.slice(0, 4).map(({ key, icon, techs }, index) => (
            <FadeInItem key={key} index={index}>
              <TechCategory title={t(`technologies:${key}`)} icon={icon} techs={techs} />
            </FadeInItem>
          ))}
        </Col>
        <Col xs={24} md={12}>
          {TECH_CATEGORIES.slice(4).map(({ key, icon, techs }, index) => (
            <FadeInItem key={key} index={index + 4}>
              <TechCategory title={t(`technologies:${key}`)} icon={icon} techs={techs} />
            </FadeInItem>
          ))}
        </Col>
      </Row>
    </div>
  );
};
