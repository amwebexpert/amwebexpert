import { BookOutlined } from "@ant-design/icons";
import { Card, theme, Timeline, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { EDUCATION_ENTRIES } from "./education.data";

const { Text, Title } = Typography;

export const AboutPageEducationCard: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const { token } = theme.useToken();
  const isFrench = i18n.language === "fr";

  return (
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
  );
};
