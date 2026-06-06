import { BookOutlined, LinkOutlined, SolutionOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Divider, Row, Space, Tag, theme, Timeline, Typography } from "antd";
import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { EDUCATION_ENTRIES } from "./education.data";
import { ExperienceCompanyLogo, experienceLogoSize } from "./experience-company-logo";
import { EXPERIENCE_ENTRIES } from "./experience.data";
import { PUBLICATION_ENTRIES } from "./publications.data";
import { TESTIMONIAL_ENTRIES } from "./testimonials.data";

const { Title, Paragraph, Text } = Typography;

const EXPERTISE_ITEMS = [
  "Mobile app architecture & development (Flutter, React Native)",
  "Full-stack web development (React, NestJS, Node.js)",
  "Technical leadership & mentoring",
  "Spring Boot / microservices (enterprise backends)",
  "OAuth2, Auth0, Firebase authentication",
  "Cloud (AWS, GCP, Docker) & CI/CD pipelines",
  "AI / RAG / On-device ML (PyTorch, Transformers.js)",
];

const EXPERTISE_ITEMS_FR = [
  "Architecture & développement mobile (Flutter, React Native)",
  "Développement full-stack (React, NestJS, Node.js)",
  "Leadership technique & mentorat",
  "Spring Boot / microservices (backends d'entreprise)",
  "Authentification OAuth2, Auth0, Firebase",
  "Cloud (AWS, GCP, Docker) & pipelines CI/CD",
  "IA / RAG / ML on-device (PyTorch, Transformers.js)",
];

export const AboutPage: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const { token } = theme.useToken();
  const isFrench = i18n.language === "fr";

  const expertiseItems = isFrench ? EXPERTISE_ITEMS_FR : EXPERTISE_ITEMS;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Title level={2}>{t("aboutPage:title")}</Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("aboutPage:experience")}
      </Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: "center" }}>
            <Avatar src={`${import.meta.env.BASE_URL}profile.jpg`} size={120} style={{ fontSize: 40, marginBottom: 16 }}>
              AM
            </Avatar>
            <Title level={4} style={{ margin: "8px 0 4px" }}>
              André Masson
            </Title>
            <Text type="secondary">{t("aboutPage:subtitle")}</Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="purple">{t("aboutPage:currentEmployer")}</Tag>
            </div>

            <Divider />

            <div style={{ textAlign: "left" }}>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                {t("aboutPage:certificationTitle")}
              </Text>
              <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 16 }}>
                {t("aboutPage:certification")}
              </Text>

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
              items={EDUCATION_ENTRIES.map(({ degree, degreeEn, school, years }) => ({
                color: token.colorPrimary,
                content: (
                  <div>
                    <Text strong style={{ display: "block" }}>
                      {isFrench ? degree : degreeEn}
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

      <Card style={{ marginTop: 24 }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          <SolutionOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
          {t("aboutPage:experienceTitle")}
        </Title>
        <Timeline
          items={EXPERIENCE_ENTRIES.map((entry) => ({
            color: token.colorPrimary,
            icon: <ExperienceCompanyLogo src={entry.logo} alt={entry.company} />,
            styles: {
              icon: {
                width: experienceLogoSize,
                height: experienceLogoSize,
                minWidth: experienceLogoSize,
                lineHeight: `${experienceLogoSize}px`,
                flexShrink: 0,
                background: "none",
                border: "none",
              },
            },
            content: (
              <div>
                <Text strong style={{ display: "block" }}>
                  {isFrench ? entry.roleFr : entry.role}
                </Text>
                <Text style={{ fontSize: 13, display: "block" }}>
                  {entry.company}
                  <Text type="secondary"> · {entry.period}</Text>
                </Text>
                <ul style={{ paddingLeft: 20, margin: "8px 0", fontSize: 13 }}>
                  {(isFrench ? entry.bulletsFr : entry.bullets).map((bullet) => (
                    <li key={bullet} style={{ marginBottom: 4 }}>
                      <Text type="secondary">{bullet}</Text>
                    </li>
                  ))}
                </ul>
                {entry.tags && (
                  <Space size={[4, 4]} wrap style={{ marginBottom: 8 }}>
                    {entry.tags.map((tag) => (
                      <Tag key={tag} style={{ margin: 0, fontSize: 11 }}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                )}
                {entry.aiPageLink && (
                  <div>
                    <Link to="/ai" style={{ fontSize: 13 }}>
                      {t("aboutPage:viewAiProjects")} →
                    </Link>
                  </div>
                )}
              </div>
            ),
          }))}
        />
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          {t("aboutPage:testimonialsTitle")}
        </Title>
        {TESTIMONIAL_ENTRIES.map((testimonial) => (
          <div key={testimonial.author} style={{ marginBottom: 20 }}>
            <Paragraph
              italic
              style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 4, borderLeft: `3px solid ${token.colorPrimary}`, paddingLeft: 12 }}
            >
              &ldquo;{isFrench ? testimonial.quoteFr : testimonial.quote}&rdquo;
            </Paragraph>
            <Text strong style={{ fontSize: 13 }}>
              {testimonial.author}
            </Text>
            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
              {t(testimonial.roleKey)}
            </Text>
          </div>
        ))}
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          <LinkOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
          {t("aboutPage:publicationsTitle")}
        </Title>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {PUBLICATION_ENTRIES.map((pub) => (
            <li key={pub.url} style={{ marginBottom: 8 }}>
              <a href={pub.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14 }}>
                {t(pub.titleKey)}
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
