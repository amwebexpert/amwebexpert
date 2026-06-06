import { GithubOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Modal, Space, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { APP_VERSION_INFO } from "~/constants";

const { Text, Title } = Typography;

interface AppAboutInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export const AppAboutInfoModal: FunctionComponent<AppAboutInfoModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t("about:title")}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          {t("common:ok")}
        </Button>,
      ]}
      centered
    >
      <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
        <Avatar src={`${import.meta.env.BASE_URL}profile.jpg`} size={96} style={{ fontSize: 36 }}>
          AM
        </Avatar>
        <Title level={5} style={{ marginTop: 12, marginBottom: 0 }}>
          André Masson
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {APP_VERSION_INFO.DESCRIPTION}
        </Text>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <Space orientation="vertical" size="small" style={{ width: "100%", textAlign: "center" }}>
        <div>
          <Text>{t("about:webappRelease")} </Text>
          <Text strong>
            {APP_VERSION_INFO.VERSION} — {APP_VERSION_INFO.VERSION_DATE}
          </Text>
        </div>
        <Button
          type="link"
          icon={<GithubOutlined />}
          href={APP_VERSION_INFO.REPOSITORY}
          target="_blank"
          rel="noopener noreferrer"
          styles={{ icon: { marginInlineEnd: 6 } }}
        >
          {t("common:viewOnGitHub")}
        </Button>
      </Space>
    </Modal>
  );
};
