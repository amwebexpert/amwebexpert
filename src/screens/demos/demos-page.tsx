import { Alert, Col, Input, Row, Spin, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemosPageRepoCard } from "./demos-page-repo-card";
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

  const hasNoResults = !isLoading && filtered?.length === 0;

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

      {hasNoResults && <Typography.Text type="secondary">{t("demos:noResults")}</Typography.Text>}

      <Row gutter={[16, 16]}>
        {filtered?.map((repo, index) => (
          <Col xs={24} sm={12} md={8} key={repo.id}>
            <DemosPageRepoCard repo={repo} index={index} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
