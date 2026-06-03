import { InfoOutlined } from "@ant-design/icons";
import { useToggle } from "@uidotdev/usehooks";
import { Button, Flex, Space } from "antd";
import type { FunctionComponent } from "react";
import { AppAboutInfoModal } from "./app-about-info-modal";
import { AppLanguageSelector } from "./app-language-selector";
import { AppThemeModeSelector } from "./app-theme-mode-selector";

export const AppHeader: FunctionComponent = () => {
  const [isAboutModalOpen, toggleAboutModal] = useToggle(false);

  return (
    <>
      <Flex justify="flex-end" align="center" style={{ width: "100%" }}>
        <Space>
          <AppThemeModeSelector />
          <AppLanguageSelector />
          <Button type="text" shape="circle" icon={<InfoOutlined />} onClick={() => toggleAboutModal()} />
        </Space>
      </Flex>

      <AppAboutInfoModal open={isAboutModalOpen} onClose={toggleAboutModal} />
    </>
  );
};
