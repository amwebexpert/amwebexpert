import { Col, Row, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { OPENSOURCE_PROJECT_ENTRIES } from "./opensource-projects.data";
import { ProjectCard } from "./project-card";

export const AchievementsPage: FunctionComponent = () => {
  const { t } = useTranslation();

  const projects = OPENSOURCE_PROJECT_ENTRIES.map(({ key, tags, githubUrl }) => ({
    title: t(`achievements:projects.${key}.title`),
    description: t(`achievements:projects.${key}.description`),
    tags,
    githubUrl,
  }));

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("achievements:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("achievements:subtitle")}
      </Typography.Paragraph>

      <Row gutter={[16, 16]}>
        {projects.map((project) => (
          <Col xs={24} md={12} key={project.title}>
            <ProjectCard project={project} githubLabel={t("achievements:viewOnGitHub")} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
