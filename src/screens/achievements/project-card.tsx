import { GithubOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Space, Tag, Typography } from "antd";
import type { FunctionComponent } from "react";

export interface ProjectInfo {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  logo?: string;
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
        <Button
          key="github"
          type="link"
          icon={<GithubOutlined />}
          href={project.githubUrl}
          target="_blank"
          size="small"
          styles={{ icon: { marginInlineEnd: 6 } }}
        >
          {githubLabel}
        </Button>
      ),
    ].filter(Boolean)}
  >
    <Flex align="center" gap={12} style={{ marginBottom: 12 }}>
      {project.logo && (
        <Avatar
          src={`${import.meta.env.BASE_URL}${project.logo}`}
          alt={project.title}
          size={48}
          shape="square"
          style={{ flexShrink: 0, borderRadius: 8 }}
        />
      )}
      <Typography.Title level={5} style={{ margin: 0 }}>
        {project.title}
      </Typography.Title>
    </Flex>
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
