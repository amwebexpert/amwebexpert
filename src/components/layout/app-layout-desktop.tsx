import { Layout } from "antd";
import type { FunctionComponent, ReactNode } from "react";
import { AppHeader } from "~/components/header/app-header";
import { useIsSiderCollapsed, useThemeMode, useToggleSider } from "~/store/ui-preferences.store";
import { SIDER_WIDTH } from "./app-layout.constants";
import { AppMenuToggler } from "./app-menu-toggler";
import { AppNavMenu } from "./app-nav-menu";
import { AppSiderLogo } from "./app-sider-logo";
import { useAppLayoutStyles } from "./hooks/use-app-layout-styles";
import { useHeaderStyles } from "./hooks/use-header-styles";

interface AppLayoutDesktopProps {
  children: ReactNode;
}

export const AppLayoutDesktop: FunctionComponent<AppLayoutDesktopProps> = ({ children }) => {
  const themeMode = useThemeMode();
  const { headerStyle, headerHeight } = useHeaderStyles();
  const { siderStyle, contentStyle } = useAppLayoutStyles();
  const isSiderCollapsed = useIsSiderCollapsed();
  const toggleSider = useToggleSider();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider
        width={SIDER_WIDTH}
        collapsed={isSiderCollapsed}
        collapsedWidth={0}
        theme={themeMode}
        style={siderStyle}
        trigger={null}
      >
        <AppSiderLogo height={headerHeight} />
        <AppNavMenu />
      </Layout.Sider>

      <AppMenuToggler isCollapsed={isSiderCollapsed} onToggle={toggleSider} />

      <Layout style={{ marginLeft: isSiderCollapsed ? 0 : SIDER_WIDTH, transition: "margin-left 200ms ease" }}>
        <Layout.Header style={headerStyle}>
          <AppHeader />
        </Layout.Header>
        <Layout.Content style={contentStyle}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
};
