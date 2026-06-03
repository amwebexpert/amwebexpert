import type { ThemeConfig } from "antd";
import type { ThemeMode } from "~/store/ui-preferences.types";
import { CV_DARK_THEME, CV_LIGHT_THEME } from "./skins/theme-cv";

interface GetThemeConfigArgs {
  mode: ThemeMode;
}

export const getThemeConfig = ({ mode }: GetThemeConfigArgs): ThemeConfig =>
  mode === "dark" ? CV_DARK_THEME : CV_LIGHT_THEME;
