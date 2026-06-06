import { theme, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { useTypewriter } from "~/hooks/use-typewriter";
import { TechBadgeCloud } from "./tech-badge-cloud";

const { Title, Paragraph, Text } = Typography;

export const HeroSection: FunctionComponent = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const roles = [t("home:role0"), t("home:role1"), t("home:role2"), t("home:role3"), t("home:role4")];
  const { displayText } = useTypewriter(roles);

  return (
    <div
      className="hero-section"
      style={{
        textAlign: "center",
        padding: "80px 24px 64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      <Title
        level={1}
        style={{
          margin: 0,
          color: token.colorText,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          opacity: 0,
          animation: "fadeInUp 0.6s ease forwards",
        }}
      >
        André Masson
      </Title>

      <Text
        type="secondary"
        style={{
          fontSize: 15,
          opacity: 0,
          animation: "fadeInUp 0.6s ease 100ms forwards",
        }}
      >
        {t("home:currentRole")}
      </Text>

      <div style={{ minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Title
          level={3}
          style={{
            margin: 0,
            color: token.colorPrimary,
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            fontWeight: 400,
            opacity: 0,
            animation: "fadeInUp 0.6s ease 200ms forwards",
          }}
        >
          {displayText}
          <span className="typewriter-cursor" style={{ color: token.colorPrimary }}>
            |
          </span>
        </Title>
      </div>

      <Paragraph
        style={{
          margin: 0,
          fontSize: 16,
          color: token.colorTextSecondary,
          maxWidth: 560,
          opacity: 0,
          animation: "fadeInUp 0.6s ease 400ms forwards",
        }}
      >
        {t("home:subtitle")}
      </Paragraph>

      <div
        style={{
          opacity: 0,
          animation: "fadeInUp 0.6s ease 500ms forwards",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TechBadgeCloud />
      </div>
    </div>
  );
};
