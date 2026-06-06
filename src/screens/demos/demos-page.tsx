import { GithubOutlined, StarOutlined } from "@ant-design/icons";
import { Alert, Card, Col, Input, Row, Spin, Tag, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGitHubRepos } from "./use-github-repos";

export const DemosPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { data: repos, isLoading, isError } = useGitHubRepos();
  const [search, setSearch] = useState("");

  const filtered = repos?.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      (repo.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("demos:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
        {t("demos:subtitle")}
      </Typography.Paragraph>

      <Input.Search
        placeholder={t("demos:searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 24, maxWidth: 400 }}
        allowClear
      />

      {isLoading && (
        <div style={{ textAlign: "center", padding: 48 }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>{t("demos:loading")}</div>
        </div>
      )}

      {isError && <Alert type="error" message={t("demos:error")} style={{ marginBottom: 24 }} />}

      {filtered && filtered.length === 0 && !isLoading && (
        <Typography.Text type="secondary">{t("demos:noResults")}</Typography.Text>
      )}

      <Row gutter={[16, 16]}>
        {filtered?.map((repo) => (
          <Col xs={24} sm={12} md={8} key={repo.id}>
            <Card
              size="small"
              style={{ height: "100%" }}
              title={repo.name}
              extra={
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("demos:viewOnGitHub")}
                >
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
          </Col>
        ))}
      </Row>
    </div>
  );
};
