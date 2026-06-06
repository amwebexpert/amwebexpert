import { Col, Divider, Row, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { FadeInItem } from "~/components/fade-in-item";
import { AiProjectCard } from "./ai-project-card";
import { AI_PROJECT_ENTRIES } from "./ai-projects.data";
import { AiTechStack } from "./ai-tech-stack";

export const AiPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("ai:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        {t("ai:subtitle")}
      </Typography.Paragraph>
      <Typography.Paragraph style={{ marginBottom: 32, fontSize: 15, lineHeight: 1.8 }}>
        {t("ai:intro")}
      </Typography.Paragraph>

      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {t("ai:techStackTitle")}
      </Typography.Title>
      <AiTechStack />

      <Divider style={{ margin: "40px 0 32px" }} />

      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {t("ai:projectsTitle")}
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {AI_PROJECT_ENTRIES.map((project, index) => (
          <Col xs={24} md={12} key={project.key}>
            <FadeInItem index={index} style={{ height: "100%" }}>
              <AiProjectCard project={project} />
            </FadeInItem>
          </Col>
        ))}
      </Row>
    </div>
  );
};
