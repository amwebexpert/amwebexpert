import { Button, Card, Divider, Modal, Space, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { AppLogo } from "~/components/logos/app-logo";
import { APP_VERSION_INFO } from "~/constants";

const { Text } = Typography;

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
      <Card
        style={{ textAlign: "center", marginTop: 16 }}
        cover={
          <div style={{ padding: "16px 0 8px", display: "flex", justifyContent: "center" }}>
            <AppLogo width={64} />
          </div>
        }
      >
        <Divider />
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <div>
            <Text>{t("about:webappRelease")} </Text>
            <Text strong>
              {APP_VERSION_INFO.VERSION} — {APP_VERSION_INFO.VERSION_DATE}
            </Text>
          </div>
          <div>
            <Text type="secondary">{APP_VERSION_INFO.AUTHOR}</Text>
          </div>
        </Space>
      </Card>
    </Modal>
  );
};
