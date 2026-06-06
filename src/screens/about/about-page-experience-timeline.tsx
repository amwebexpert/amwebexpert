import { SolutionOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Card, Space, Tag, theme, Timeline, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { ExperienceCompanyLogo } from "./experience-company-logo";
import { EXPERIENCE_LOGO_SIZE } from "./experience-company-logo.constants";
import { EXPERIENCE_ENTRIES } from "./experience.data";

const { Text, Title } = Typography;

const experienceIconTopOffset = Math.round((EXPERIENCE_LOGO_SIZE - 22) / 2);
const experienceRailTop = EXPERIENCE_LOGO_SIZE + experienceIconTopOffset;

export const AboutPageExperienceTimeline: FunctionComponent = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <Card style={{ marginTop: 24 }}>
      <Title level={5} style={{ marginBottom: 16 }}>
        <SolutionOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
        {t("aboutPage:experienceTitle")}
      </Title>
      <Timeline
        items={EXPERIENCE_ENTRIES.map((entry) => ({
          color: token.colorPrimary,
          icon: (
            <ExperienceCompanyLogo
              logoLight={entry.logoLight}
              logoDark={entry.logoDark}
              alt={entry.company}
            />
          ),
          styles: {
            root: {
              ["--ant-cmp-steps-icon-size" as string]: `${EXPERIENCE_LOGO_SIZE}px`,
              ["--ant-cmp-steps-icon-size-max" as string]: `${EXPERIENCE_LOGO_SIZE}px`,
              ["--ant-cmp-steps-icon-size-active" as string]: `${EXPERIENCE_LOGO_SIZE}px`,
            },
            icon: {
              width: EXPERIENCE_LOGO_SIZE,
              height: EXPERIENCE_LOGO_SIZE,
              minWidth: EXPERIENCE_LOGO_SIZE,
              lineHeight: `${EXPERIENCE_LOGO_SIZE}px`,
              flexShrink: 0,
              background: "none",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: experienceIconTopOffset,
            },
            rail: {
              top: experienceRailTop,
              bottom: -experienceIconTopOffset,
            },
          },
          content: (
            <div>
              <Text strong style={{ display: "block" }}>
                {t(`experience:${entry.key}.role`)}
              </Text>
              <Text style={{ fontSize: 13, display: "block" }}>
                {entry.company}
                <Text type="secondary"> · {entry.period}</Text>
              </Text>
              <ul style={{ paddingLeft: 20, margin: "8px 0", fontSize: 13 }}>
                {(t(`experience:${entry.key}.bullets`, { returnObjects: true }) as string[]).map((bullet) => (
                  <li key={bullet} style={{ marginBottom: 4 }}>
                    <Text type="secondary">{bullet}</Text>
                  </li>
                ))}
              </ul>
              {entry.tags && (
                <Space size={[4, 4]} wrap style={{ marginBottom: 8 }}>
                  {entry.tags.map((tag) => (
                    <Tag key={tag} style={{ margin: 0, fontSize: 11 }}>
                      {tag}
                    </Tag>
                  ))}
                </Space>
              )}
              {entry.aiPageLink && (
                <div>
                  <Link to="/ai" style={{ fontSize: 13 }}>
                    {t("aboutPage:viewAiProjects")} →
                  </Link>
                </div>
              )}
            </div>
          ),
        }))}
      />
    </Card>
  );
};
