import { GithubOutlined } from "@ant-design/icons";
import { Button, Card, Space, Tag, Typography } from "antd";
import type { FunctionComponent } from "react";

export interface ProjectInfo {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
}

interface ProjectCardProps {
  project: ProjectInfo;
  githubLabel?: string;
}

export const ProjectCard: FunctionComponent<ProjectCardProps> = ({ project, githubLabel = "GitHub" }) => (
  <Card
    size="small"
    style={{ height: "100%" }}
    actions={[
      project.githubUrl && (
        <Button key="github" type="link" icon={<GithubOutlined />} href={project.githubUrl} target="_blank" size="small">
          {githubLabel}
        </Button>
      ),
    ].filter(Boolean)}
  >
    <Typography.Title level={5} style={{ marginBottom: 8 }}>
      {project.title}
    </Typography.Title>
    <Typography.Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 12 }}>
      {project.description}
    </Typography.Paragraph>
    <Space size={[4, 4]} wrap>
      {project.tags.map((tag) => (
        <Tag key={tag} style={{ margin: 0, fontSize: 11 }}>
          {tag}
        </Tag>
      ))}
    </Space>
  </Card>
);
