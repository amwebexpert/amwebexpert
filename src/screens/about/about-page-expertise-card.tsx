import { Card, theme, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
const { Text, Title } = Typography;

export const AboutPageExpertiseCard: FunctionComponent = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const expertiseItems = t("aboutPage:expertiseItems", { returnObjects: true }) as string[];

  return (
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
  );
};
