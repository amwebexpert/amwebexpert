import { MenuOutlined } from "@ant-design/icons";
import { useToggle } from "@uidotdev/usehooks";
import { Button, Drawer, Layout } from "antd";
import type { FunctionComponent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AppHeader } from "~/components/header/app-header";
import { SIDER_WIDTH } from "./app-layout.constants";
import { AppNavMenu } from "./app-nav-menu";
import { AppSiderLogo } from "./app-sider-logo";
import { useAppLayoutStyles } from "./hooks/use-app-layout-styles";
import { useHeaderStyles } from "./hooks/use-header-styles";

interface AppLayoutMobileProps {
  children: ReactNode;
}

export const AppLayoutMobile: FunctionComponent<AppLayoutMobileProps> = ({ children }) => {
  const { t } = useTranslation();
  const { mobileHeaderStyle, headerHeight } = useHeaderStyles();
  const { contentStyle, drawerBodyStyle } = useAppLayoutStyles();
  const [isDrawerOpen, toggleDrawer] = useToggle(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header style={mobileHeaderStyle}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => toggleDrawer()}
          aria-label={t("menu:openMenu")}
          style={{ marginRight: 8 }}
        />
        <AppHeader />
      </Layout.Header>

      <Layout.Content style={contentStyle}>{children}</Layout.Content>

      <Drawer
        title={null}
        placement="left"
        open={isDrawerOpen}
        onClose={() => toggleDrawer()}
        styles={{ body: drawerBodyStyle, wrapper: { width: SIDER_WIDTH } }}
      >
        <AppSiderLogo height={headerHeight} />
        <div style={{ flex: 1, overflow: "auto" }}>
          <AppNavMenu onItemClick={() => toggleDrawer()} />
        </div>
      </Drawer>
    </Layout>
  );
};
