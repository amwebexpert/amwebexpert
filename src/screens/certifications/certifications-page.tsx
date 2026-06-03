import { CheckCircleFilled } from "@ant-design/icons";
import { Card, Col, Row, Tag, theme, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

interface Certification {
  title: string;
  issuer: string;
  category: string;
  color: string;
}

const CERTIFICATIONS: Certification[] = [
  { title: "CSS Fundamentals", issuer: "Pluralsight", category: "Web", color: "red" },
  { title: "RxJS", issuer: "Pluralsight", category: "Web", color: "red" },
  { title: "eDesigner Pro", issuer: "Actuate", category: "Reporting", color: "orange" },
];

export const CertificationsPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("certifications:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("certifications:subtitle")}
      </Typography.Paragraph>

      <Row gutter={[16, 16]}>
        {CERTIFICATIONS.map((cert) => (
          <Col xs={24} sm={12} md={8} key={cert.title}>
            <Card
              size="small"
              style={{
                height: "100%",
                borderLeft: `3px solid ${token.colorPrimary}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <CheckCircleFilled style={{ color: token.colorPrimary, fontSize: 18, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <Typography.Text strong style={{ display: "block", fontSize: 13 }}>
                    {cert.title}
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {cert.issuer}
                  </Typography.Text>
                  <br />
                  <Tag color={cert.color} style={{ marginTop: 6, fontSize: 11 }}>
                    {cert.category}
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
