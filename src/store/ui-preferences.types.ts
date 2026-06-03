export type ThemeMode = "light" | "dark";

export interface UiPreferencesStore {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isSiderCollapsed: boolean;
  toggleSider: () => void;
}
