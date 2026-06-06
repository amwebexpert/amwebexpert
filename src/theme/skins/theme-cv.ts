import type { ThemeConfig } from "antd";
import { theme } from "antd";
import { SHARED_COMPONENT_TOKENS, SHARED_TOKENS } from "./shared-tokens";

/** Professional CV theme — Architectural Precision */

export const CV_LIGHT_THEME: ThemeConfig = {
  token: {
    ...SHARED_TOKENS,
    colorPrimary: "#1e3a5f",
    colorPrimaryHover: "#2d5186",
    colorPrimaryActive: "#152b47",
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f8f6f2",
    colorBgElevated: "#f4f1eb",
    colorBgSpotlight: "#ede9e0",
    colorBorder: "#ddd8ce",
    colorBorderSecondary: "#ede9e0",
    colorText: "#1a1814",
    colorTextSecondary: "#4a4540",
    colorTextTertiary: "#7a746e",
    colorError: "#b91c1c",
    colorErrorBg: "#fee2e2",
  },
  components: {
    Layout: {
      headerBg: "#ffffff",
      siderBg: "#ffffff",
      bodyBg: "#f8f6f2",
      triggerBg: "#ffffff",
      triggerColor: "#1e3a5f",
    },
    Card: {
      ...SHARED_COMPONENT_TOKENS.Card,
      colorBgContainer: "#ffffff",
    },
    Button: {
      ...SHARED_COMPONENT_TOKENS.Button,
      primaryColor: "#ffffff",
    },
    Avatar: {
      colorBgContainer: "#dde8f5",
      colorText: "#1e3a5f",
    },
    Input: { ...SHARED_COMPONENT_TOKENS.Input },
    Menu: {
      ...SHARED_COMPONENT_TOKENS.Menu,
      itemSelectedBg: "#edf2f9",
      itemSelectedColor: "#1e3a5f",
    },
    Tooltip: {
      colorBgSpotlight: "#1a1814",
      colorTextLightSolid: "#ffffff",
    },
  },
};

export const CV_DARK_THEME: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...SHARED_TOKENS,
    colorPrimary: "#22d3ee",
    colorPrimaryHover: "#38bdf8",
    colorPrimaryActive: "#0ea5e9",
    colorBgContainer: "#13151f",
    colorBgLayout: "#0c0e14",
    colorBgElevated: "#1b1e2d",
    colorBgSpotlight: "#252839",
    colorBorder: "#2d3147",
    colorBorderSecondary: "#1b1e2d",
    colorText: "#e2e8f0",
    colorTextSecondary: "#94a3b8",
    colorTextTertiary: "#64748b",
    colorError: "#f87171",
    colorErrorBg: "#450a0a",
  },
  components: {
    Layout: {
      headerBg: "#13151f",
      siderBg: "#13151f",
      bodyBg: "#0c0e14",
      triggerBg: "#13151f",
      triggerColor: "#22d3ee",
    },
    Card: {
      ...SHARED_COMPONENT_TOKENS.Card,
      colorBgContainer: "#1b1e2d",
    },
    Button: {
      ...SHARED_COMPONENT_TOKENS.Button,
      primaryColor: "#0c0e14",
    },
    Avatar: {
      colorBgContainer: "#1a3040",
      colorText: "#22d3ee",
    },
    Input: {
      ...SHARED_COMPONENT_TOKENS.Input,
      colorTextPlaceholder: "#64748b",
    },
    Menu: {
      ...SHARED_COMPONENT_TOKENS.Menu,
      itemSelectedBg: "#1a2535",
      itemColor: "#94a3b8",
      itemSelectedColor: "#22d3ee",
      itemDisabledColor: "#64748b",
    },
  },
};
