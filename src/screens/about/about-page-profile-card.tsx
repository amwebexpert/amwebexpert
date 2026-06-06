import { Avatar, Card, Divider, Tag, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

export const AboutPageProfileCard: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
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
  );
};
