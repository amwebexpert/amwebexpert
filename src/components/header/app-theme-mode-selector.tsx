import { CheckOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, type MenuProps } from "antd";
import type { FunctionComponent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useSetThemeMode, useThemeMode } from "~/store/ui-preferences.store";
import type { ThemeMode } from "~/store/ui-preferences.types";

interface ModeChoice {
  code: ThemeMode;
  selectionLabel: string;
  icon: ReactNode;
}

export const AppThemeModeSelector: FunctionComponent = () => {
  const { t } = useTranslation();
  const themeMode = useThemeMode();
  const setThemeMode = useSetThemeMode();

  const choices: ModeChoice[] = [
    { code: "dark", selectionLabel: t("theme:dark"), icon: <MoonOutlined /> },
    { code: "light", selectionLabel: t("theme:light"), icon: <SunOutlined /> },
  ];

  const menuItems: MenuProps["items"] = choices.map(({ code, selectionLabel, icon }) => {
    const isSelected = themeMode === code;

    return {
      key: code,
      disabled: isSelected,
      onClick: () => setThemeMode(code),
      label: (
        <Flex align="center" gap={8}>
          {icon} {selectionLabel} {isSelected && <CheckOutlined style={{ fontSize: "10px" }} />}
        </Flex>
      ),
    };
  });

  const current = choices.find(({ code }) => code === themeMode);
  const currentIcon = current?.icon ?? <MoonOutlined />;

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Button type="text" shape="circle" icon={currentIcon} />
    </Dropdown>
  );
};
