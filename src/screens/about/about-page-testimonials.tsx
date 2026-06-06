import { Card, theme, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { TESTIMONIAL_ENTRIES } from "./testimonials.data";

const { Paragraph, Text, Title } = Typography;

export const AboutPageTestimonials: FunctionComponent = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <Card style={{ marginTop: 24 }}>
      <Title level={5} style={{ marginBottom: 16 }}>
        {t("aboutPage:testimonialsTitle")}
      </Title>
      {TESTIMONIAL_ENTRIES.map((testimonial) => (
        <div key={testimonial.author} style={{ marginBottom: 20 }}>
          <Paragraph
            italic
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 4,
              borderLeft: `3px solid ${token.colorPrimary}`,
              paddingLeft: 12,
            }}
          >
            &ldquo;{t(`aboutPage:testimonials.${testimonial.key}.quote`)}&rdquo;
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
  );
};
