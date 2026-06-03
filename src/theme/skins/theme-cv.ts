import type { ThemeConfig } from "antd";
import { theme } from "antd";
import { SHARED_COMPONENT_TOKENS, SHARED_TOKENS } from "./shared-tokens";

/** Professional slate-blue CV theme */

export const CV_LIGHT_THEME: ThemeConfig = {
  token: {
    ...SHARED_TOKENS,
    colorPrimary: "#2563eb",
    colorPrimaryHover: "#3b82f6",
    colorPrimaryActive: "#1d4ed8",
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f8fafc",
    colorBgElevated: "#f1f5f9",
    colorBgSpotlight: "#e2e8f0",
    colorBorder: "#cbd5e1",
    colorBorderSecondary: "#e2e8f0",
    colorText: "#0f172a",
    colorTextSecondary: "#334155",
    colorTextTertiary: "#64748b",
    colorError: "#dc2626",
    colorErrorBg: "#fee2e2",
  },
  components: {
    Layout: {
      headerBg: "#ffffff",
      siderBg: "#ffffff",
      bodyBg: "#f8fafc",
      triggerBg: "#ffffff",
      triggerColor: "#2563eb",
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
      colorBgContainer: "#dbeafe",
      colorText: "#2563eb",
    },
    Input: { ...SHARED_COMPONENT_TOKENS.Input },
    Menu: {
      ...SHARED_COMPONENT_TOKENS.Menu,
      itemSelectedBg: "#eff6ff",
      itemSelectedColor: "#2563eb",
    },
  },
};

export const CV_DARK_THEME: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...SHARED_TOKENS,
    colorPrimary: "#4f8ef7",
    colorPrimaryHover: "#3b82f6",
    colorPrimaryActive: "#2563eb",
    colorBgContainer: "#0d1117",
    colorBgLayout: "#0d1117",
    colorBgElevated: "#161b22",
    colorBgSpotlight: "#21262d",
    colorBorder: "#30363d",
    colorBorderSecondary: "#21262d",
    colorText: "#e6edf3",
    colorTextSecondary: "#c9d1d9",
    colorTextTertiary: "#8b949e",
    colorError: "#f87171",
    colorErrorBg: "#450a0a",
  },
  components: {
    Layout: {
      headerBg: "#0d1117",
      siderBg: "#0d1117",
      bodyBg: "#0d1117",
      triggerBg: "#0d1117",
      triggerColor: "#4f8ef7",
    },
    Card: {
      ...SHARED_COMPONENT_TOKENS.Card,
      colorBgContainer: "#161b22",
    },
    Button: {
      ...SHARED_COMPONENT_TOKENS.Button,
      primaryColor: "#ffffff",
    },
    Avatar: {
      colorBgContainer: "#1d3461",
      colorText: "#4f8ef7",
    },
    Input: {
      ...SHARED_COMPONENT_TOKENS.Input,
      colorTextPlaceholder: "#8b949e",
    },
    Menu: {
      ...SHARED_COMPONENT_TOKENS.Menu,
      itemSelectedBg: "#1d3461",
      itemColor: "#c9d1d9",
      itemSelectedColor: "#4f8ef7",
      itemDisabledColor: "#8b949e",
    },
  },
};
