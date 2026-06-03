import { theme } from "antd";
import type { CSSProperties } from "react";
import { SIDER_WIDTH } from "../app-layout.constants";

interface AppLayoutStyles {
  siderStyle: CSSProperties;
  contentStyle: CSSProperties;
  drawerBodyStyle: CSSProperties;
}

export const useAppLayoutStyles = (): AppLayoutStyles => {
  const { token } = theme.useToken();

  return {
    siderStyle: {
      overflow: "auto",
      height: "100vh",
      position: "fixed",
      insetInlineStart: 0,
      top: 0,
      bottom: 0,
      scrollbarWidth: "thin",
      borderRight: `1px solid ${token.colorBorder}`,
    },
    contentStyle: {
      minHeight: "100vh",
      background: token.colorBgLayout,
      overflowX: "hidden",
    },
    drawerBodyStyle: {
      padding: 0,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: token.colorBgContainer,
      width: SIDER_WIDTH,
    },
  };
};
