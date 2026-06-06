import {
  BulbOutlined,
  ContactsOutlined,
  HomeOutlined,
  LaptopOutlined,
  RobotOutlined,
  StarOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "@tanstack/react-router";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import type { FunctionComponent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { APP_NAV_ROUTES } from "~/route.constants";

type NavItemConfig = {
  key: string;
  icon: ReactNode;
  labelKey: string;
};

const NAV_ITEMS: NavItemConfig[] = [
  { key: APP_NAV_ROUTES.home, icon: <HomeOutlined />, labelKey: "nav:home" },
  { key: APP_NAV_ROUTES.about, icon: <ContactsOutlined />, labelKey: "nav:about" },
  { key: APP_NAV_ROUTES.technologies, icon: <ToolOutlined />, labelKey: "nav:technologies" },
  { key: APP_NAV_ROUTES.achievements, icon: <StarOutlined />, labelKey: "nav:achievements" },
  { key: APP_NAV_ROUTES.ai, icon: <RobotOutlined />, labelKey: "nav:ai" },
  { key: APP_NAV_ROUTES.demos, icon: <LaptopOutlined />, labelKey: "nav:demos" },
  { key: APP_NAV_ROUTES.contact, icon: <BulbOutlined />, labelKey: "nav:contact" },
];

interface AppNavMenuProps {
  onItemClick?: () => void;
}

export const AppNavMenu: FunctionComponent<AppNavMenuProps> = ({ onItemClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick: MenuProps["onClick"] = ({ key }) => {
    navigate({ to: key });
    onItemClick?.();
  };

  const items: MenuProps["items"] = NAV_ITEMS.map(({ key, icon, labelKey }) => ({
    key,
    icon,
    label: t(labelKey),
  }));

  return (
    <Menu
      className="app-nav-menu"
      mode="inline"
      selectedKeys={[pathname]}
      items={items}
      onClick={handleClick}
      style={{ height: "100%", borderRight: 0, paddingTop: 8 }}
    />
  );
};
