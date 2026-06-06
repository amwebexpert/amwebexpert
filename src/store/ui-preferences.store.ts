import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { ThemeMode, UiPreferencesStore } from "./ui-preferences.types";

type SetFn = (
  partial: Partial<UiPreferencesStore> | ((state: UiPreferencesStore) => Partial<UiPreferencesStore>)
) => void;

const stateCreator = (set: SetFn): UiPreferencesStore => ({
  themeMode: "dark",
  setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
  isSiderCollapsed: false,
  toggleSider: () => set((state) => ({ isSiderCollapsed: !state.isSiderCollapsed })),
});

const PERSISTED_STORE_NAME = "cv-ui-preferences";

const persistedStateCreator = persist<UiPreferencesStore>(stateCreator, {
  name: PERSISTED_STORE_NAME,
  storage: createJSONStorage(() => localStorage),
});

export const useUiPreferencesStore = create<UiPreferencesStore>()(
  devtools(persistedStateCreator, { name: PERSISTED_STORE_NAME })
);

export const useThemeMode = (): ThemeMode => useUiPreferencesStore((state) => state.themeMode);
export const useSetThemeMode = (): ((mode: ThemeMode) => void) => useUiPreferencesStore((state) => state.setThemeMode);
export const useIsSiderCollapsed = (): boolean => useUiPreferencesStore((state) => state.isSiderCollapsed);
export const useToggleSider = (): (() => void) => useUiPreferencesStore((state) => state.toggleSider);
