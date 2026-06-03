import { Card, Space, Tag, theme, Typography } from "antd";
import type { FunctionComponent } from "react";

export interface AiProjectInfo {
  title: string;
  company: string;
  description: string;
  bullets: string[];
  tags: string[];
}

interface AiProjectCardProps {
  project: AiProjectInfo;
}

export const AiProjectCard: FunctionComponent<AiProjectCardProps> = ({ project }) => {
  const { token } = theme.useToken();

  return (
    <Card
      style={{ height: "100%", borderTop: `3px solid ${token.colorPrimary}` }}
      title={
        <div>
          <Typography.Text strong>{project.title}</Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
            {project.company}
          </Typography.Text>
        </div>
      }
    >
      <Typography.Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 12 }}>
        {project.description}
      </Typography.Paragraph>

      <ul style={{ paddingLeft: 16, margin: "0 0 16px 0" }}>
        {project.bullets.map((bullet) => (
          <li key={bullet} style={{ marginBottom: 4, fontSize: 13, color: token.colorTextSecondary }}>
            {bullet}
          </li>
        ))}
      </ul>

      <Space size={[4, 4]} wrap>
        {project.tags.map((tag) => (
          <Tag key={tag} color="blue" style={{ margin: 0, fontSize: 11 }}>
            {tag}
          </Tag>
        ))}
      </Space>
    </Card>
  );
};
