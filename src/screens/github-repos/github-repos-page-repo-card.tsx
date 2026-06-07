import { GithubOutlined, StarOutlined } from "@ant-design/icons";
import { Card, Tag, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { FadeInItem } from "~/components/fade-in-item";
import type { GitHubRepo } from "./use-github-repos";

interface GitHubReposPageRepoCardProps {
  repo: GitHubRepo;
  index: number;
}

export const GitHubReposPageRepoCard: FunctionComponent<GitHubReposPageRepoCardProps> = ({ repo, index }) => {
  const { t } = useTranslation();

  return (
    <FadeInItem index={index} style={{ height: "100%" }}>
      <Card
        size="small"
        style={{ height: "100%" }}
        title={repo.name}
        extra={
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" aria-label={t("githubRepos:viewOnGitHub")}>
            <GithubOutlined />
          </a>
        }
      >
        {repo.description && (
          <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 8 }} ellipsis={{ rows: 2 }}>
            {repo.description}
          </Typography.Paragraph>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {repo.language && <Tag style={{ margin: 0, fontSize: 11 }}>{repo.language}</Tag>}
          {repo.stargazers_count > 0 && (
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              <StarOutlined /> {repo.stargazers_count}
            </Typography.Text>
          )}
        </div>
      </Card>
    </FadeInItem>
  );
};
