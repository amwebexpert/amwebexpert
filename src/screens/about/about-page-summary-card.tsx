import { Card, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

const { Paragraph } = Typography;

export const AboutPageSummaryCard: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <Card style={{ marginBottom: 16 }}>
      <Paragraph style={{ fontSize: 15, lineHeight: 1.8, margin: 0 }}>{t("aboutPage:summary")}</Paragraph>
    </Card>
  );
};
