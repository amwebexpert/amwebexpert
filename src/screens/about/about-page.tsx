import { Col, Row, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { FadeInItem } from "~/components/fade-in-item";
import { AboutPageEducationCard } from "./about-page-education-card";
import { AboutPageExperienceTimeline } from "./about-page-experience-timeline";
import { AboutPageExpertiseCard } from "./about-page-expertise-card";
import { AboutPageProfileCard } from "./about-page-profile-card";
import { AboutPagePublications } from "./about-page-publications";
import { AboutPageSummaryCard } from "./about-page-summary-card";
import { AboutPageTestimonials } from "./about-page-testimonials";

const { Paragraph, Title } = Typography;

export const AboutPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Title level={2}>{t("aboutPage:title")}</Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("aboutPage:experience")}
      </Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <FadeInItem index={0} style={{ height: "100%" }}>
            <AboutPageProfileCard />
          </FadeInItem>
        </Col>

        <Col xs={24} md={16}>
          <FadeInItem index={1}>
            <AboutPageSummaryCard />
          </FadeInItem>
          <FadeInItem index={2}>
            <AboutPageExpertiseCard />
          </FadeInItem>
          <FadeInItem index={3}>
            <AboutPageEducationCard />
          </FadeInItem>
        </Col>
      </Row>

      <FadeInItem index={4}>
        <AboutPageExperienceTimeline />
      </FadeInItem>

      <FadeInItem index={5}>
        <AboutPageTestimonials />
      </FadeInItem>

      <FadeInItem index={6}>
        <AboutPagePublications />
      </FadeInItem>
    </div>
  );
};
