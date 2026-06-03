import { Col, Row, theme, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { HeroSection } from "./hero-section";

const { Title, Paragraph } = Typography;

interface ExpertiseCard {
  key: string;
  icon: string;
  titleKey: string;
  descKey: string;
}

const EXPERTISE_CARDS: ExpertiseCard[] = [
  { key: "mobile", icon: "📱", titleKey: "home:mobile", descKey: "home:mobileDesc" },
  { key: "web", icon: "🌐", titleKey: "home:web", descKey: "home:webDesc" },
  { key: "enterprise", icon: "☁️", titleKey: "home:enterprise", descKey: "home:enterpriseDesc" },
];

export const HomePage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <div>
      <HeroSection />

      <div style={{ padding: "48px 24px 64px", maxWidth: 960, margin: "0 auto" }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
          {t("home:expertiseTitle")}
        </Title>

        <Row gutter={[24, 24]}>
          {EXPERTISE_CARDS.map(({ key, icon, titleKey, descKey }) => (
            <Col xs={24} md={8} key={key}>
              <div
                style={{
                  padding: 24,
                  borderRadius: token.borderRadiusLG,
                  background: token.colorBgElevated,
                  border: `1px solid ${token.colorBorder}`,
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  {t(titleKey)}
                </Title>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                  {t(descKey)}
                </Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
