import { Card, Space, Tag, theme, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import type { AiProjectEntry } from "./ai-projects.data";

interface AiProjectCardProps {
  project: AiProjectEntry;
}

export const AiProjectCard: FunctionComponent<AiProjectCardProps> = ({ project }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { key, tags } = project;
  const bullets = t(`ai:projects.${key}.bullets`, { returnObjects: true }) as unknown as string[];

  return (
    <Card
      style={{ height: "100%", borderTop: `3px solid ${token.colorPrimary}` }}
      title={
        <div>
          <Typography.Text strong>{t(`ai:projects.${key}.title`)}</Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
            {t(`ai:projects.${key}.company`)}
          </Typography.Text>
        </div>
      }
    >
      <Typography.Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 12 }}>
        {t(`ai:projects.${key}.description`)}
      </Typography.Paragraph>

      <ul style={{ paddingLeft: 16, margin: "0 0 16px 0" }}>
        {bullets.map((bullet) => (
          <li key={bullet} style={{ marginBottom: 4, fontSize: 13, color: token.colorTextSecondary }}>
            {bullet}
          </li>
        ))}
      </ul>

      <Space size={[4, 4]} wrap>
        {tags.map((tag) => (
          <Tag key={tag} color="blue" style={{ margin: 0, fontSize: 11 }}>
            {tag}
          </Tag>
        ))}
      </Space>
    </Card>
  );
};
