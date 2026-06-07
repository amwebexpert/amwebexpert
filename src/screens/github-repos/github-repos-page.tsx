import { Alert, Col, Input, Row, Spin, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GitHubReposPageRepoCard } from "./github-repos-page-repo-card";
import { useGitHubRepos } from "./use-github-repos";

export const GitHubReposPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { data: repos, isLoading, isError } = useGitHubRepos();
  const [search, setSearch] = useState("");

  const filtered = repos?.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      (repo.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const hasNoResults = !isLoading && filtered?.length === 0;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("githubRepos:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
        {t("githubRepos:subtitle")}
      </Typography.Paragraph>

      <Input.Search
        placeholder={t("githubRepos:searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 24, maxWidth: 400 }}
        allowClear
      />

      {isLoading && (
        <div style={{ textAlign: "center", padding: 48 }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>{t("githubRepos:loading")}</div>
        </div>
      )}

      {isError && <Alert type="error" message={t("githubRepos:error")} style={{ marginBottom: 24 }} />}

      {hasNoResults && <Typography.Text type="secondary">{t("githubRepos:noResults")}</Typography.Text>}

      <Row gutter={[16, 16]}>
        {filtered?.map((repo, index) => (
          <Col xs={24} sm={12} md={8} key={repo.id}>
            <GitHubReposPageRepoCard repo={repo} index={index} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
