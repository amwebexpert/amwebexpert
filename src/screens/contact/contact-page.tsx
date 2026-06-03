import { GithubOutlined, MailOutlined, PhoneOutlined, ReadOutlined } from "@ant-design/icons";
import { Card, Col, Row, theme, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

interface ContactItem {
  icon: React.ReactNode;
  labelKey: string;
  value: string;
  href: string;
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    icon: <MailOutlined />,
    labelKey: "contact:email",
    value: "amwebexpert@gmail.com",
    href: "mailto:amwebexpert@gmail.com",
  },
  {
    icon: <PhoneOutlined />,
    labelKey: "contact:phone",
    value: "514-928-7658",
    href: "tel:+15149287658",
  },
  {
    icon: <GithubOutlined />,
    labelKey: "contact:github",
    value: "github.com/amwebexpert",
    href: "https://github.com/amwebexpert",
  },
  {
    icon: <ReadOutlined />,
    labelKey: "contact:blog",
    value: "Chroniques d'un dev",
    href: "https://amwebexpert.wordpress.com",
  },
];

export const ContactPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 640, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("contact:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("contact:subtitle")}
      </Typography.Paragraph>

      <Row gutter={[16, 16]}>
        {CONTACT_ITEMS.map(({ icon, labelKey, value, href }) => (
          <Col xs={24} sm={12} key={labelKey}>
            <Card
              size="small"
              hoverable
              onClick={() => window.open(href, "_blank")}
              style={{ cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    fontSize: 24,
                    color: token.colorPrimary,
                    width: 40,
                    textAlign: "center",
                  }}
                >
                  {icon}
                </div>
                <div>
                  <Typography.Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                    {t(labelKey)}
                  </Typography.Text>
                  <Typography.Text strong style={{ color: token.colorPrimary }}>
                    {value}
                  </Typography.Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Typography.Text type="secondary">
          📍 {t("contact:location")}
        </Typography.Text>
      </div>
    </div>
  );
};
