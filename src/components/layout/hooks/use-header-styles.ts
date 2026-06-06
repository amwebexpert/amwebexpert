import { theme } from "antd";
import type { CSSProperties } from "react";
import { HEADER_HEIGHT } from "../app-layout.constants";

interface HeaderStyles {
  headerHeight: number;
  headerStyle: CSSProperties;
  mobileHeaderStyle: CSSProperties;
}

export const useHeaderStyles = (): HeaderStyles => {
  const { token } = theme.useToken();

  const base: CSSProperties = {
    height: HEADER_HEIGHT,
    lineHeight: `${HEADER_HEIGHT}px`,
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    background: `${token.colorBgContainer}e6`,
    backdropFilter: "blur(12px) saturate(180%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%)",
    boxShadow: `0 1px 0 ${token.colorBorder}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
  };

  return {
    headerHeight: HEADER_HEIGHT,
    headerStyle: base,
    mobileHeaderStyle: { ...base, padding: "0 16px" },
  };
};
