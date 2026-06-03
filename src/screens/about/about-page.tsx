import { BookOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Divider, Row, Tag, theme, Timeline, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

const EDUCATION = [
  {
    degree: "Baccalauréat en informatique",
    degreeEn: "Bachelor's degree in Computer Science",
    school: "Université du Québec à Trois-Rivières",
    years: "1992 – 1995",
  },
  {
    degree: "Baccalauréat en mathématiques",
    degreeEn: "Bachelor's degree in Mathematics",
    school: "Université du Québec à Trois-Rivières",
    years: "1988 – 1992",
  },
];

const EXPERTISE_ITEMS = [
  "Mobile app architecture & development (Flutter, React Native)",
  "Full-stack web development (React, NestJS, Node.js)",
  "OAuth2, Auth0, Firebase authentication",
  "Cloud (AWS, GCP, Docker) & CI/CD pipelines",
  "AI / RAG / On-device ML (PyTorch, Transformers.js)",
];

const EXPERTISE_ITEMS_FR = [
  "Architecture & développement mobile (Flutter, React Native)",
  "Développement full-stack (React, NestJS, Node.js)",
  "Authentification OAuth2, Auth0, Firebase",
  "Cloud (AWS, GCP, Docker) & pipelines CI/CD",
  "IA / RAG / ML on-device (PyTorch, Transformers.js)",
];

export const AboutPage: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const { token } = theme.useToken();

  const expertiseItems = i18n.language === "fr" ? EXPERTISE_ITEMS_FR : EXPERTISE_ITEMS;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Title level={2}>{t("aboutPage:title")}</Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("aboutPage:experience")}
      </Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: "center" }}>
            <Avatar src="/profile.jpg" size={120} style={{ fontSize: 40, marginBottom: 16 }}>
              AM
            </Avatar>
            <Title level={4} style={{ margin: "8px 0 4px" }}>
              André Masson
            </Title>
            <Text type="secondary">{t("aboutPage:subtitle")}</Text>

            <Divider />

            <div style={{ textAlign: "left" }}>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                {t("aboutPage:languagesTitle")}
              </Text>
              <Tag color="blue" style={{ marginBottom: 4 }}>
                {t("aboutPage:french")}
              </Tag>
              <br />
              <Tag color="green">{t("aboutPage:english")}</Tag>

              <Divider style={{ margin: "16px 0" }} />

              <Text strong style={{ display: "block", marginBottom: 8 }}>
                {t("aboutPage:industriesTitle")}
              </Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {t("aboutPage:industriesList")}
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card style={{ marginBottom: 16 }}>
            <Paragraph style={{ fontSize: 15, lineHeight: 1.8, margin: 0 }}>{t("aboutPage:summary")}</Paragraph>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <Title level={5} style={{ marginBottom: 16 }}>
              {t("aboutPage:expertiseTitle")}
            </Title>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {expertiseItems.map((item) => (
                <li key={item} style={{ marginBottom: 8 }}>
                  <Text style={{ color: token.colorText }}>{item}</Text>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <Title level={5} style={{ marginBottom: 16 }}>
              <BookOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
              {t("aboutPage:educationTitle")}
            </Title>
            <Timeline
              items={EDUCATION.map(({ degree, degreeEn, school, years }) => ({
                color: token.colorPrimary,
                children: (
                  <div>
                    <Text strong style={{ display: "block" }}>
                      {i18n.language === "fr" ? degree : degreeEn}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {school}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                      {years}
                    </Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
