import { CheckOutlined, GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, type MenuProps } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { storeSelectedLanguage, SUPPORTED_LANGUAGES, type AppLanguageType } from "~/i18n/i18n";

export const AppLanguageSelector: FunctionComponent = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (languageCode: AppLanguageType) => {
    i18n.changeLanguage(languageCode);
    storeSelectedLanguage(languageCode);
  };

  const menuItems: MenuProps["items"] = SUPPORTED_LANGUAGES.map(({ code, selectionLabel }) => {
    const isSelected = i18n.language === code;

    return {
      key: code,
      disabled: isSelected,
      onClick: () => handleLanguageChange(code),
      label: (
        <Flex align="center" gap={8}>
          {selectionLabel} {isSelected && <CheckOutlined style={{ fontSize: "10px" }} />}
        </Flex>
      ),
    };
  });

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Button type="text" shape="circle" icon={<GlobalOutlined />} />
    </Dropdown>
  );
};
