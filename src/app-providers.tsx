import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntDesignAppWrapper, ConfigProvider } from "antd";
import "antd/dist/reset.css";
import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { StrictMode, useEffect } from "react";
import { useCurrentLocale } from "./i18n/use-current-locale";
import { useThemeMode } from "./store/ui-preferences.store";
import { getThemeConfig } from "./theme/app-theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000 },
  },
});

export const AppProviders = ({ children }: PropsWithChildren) => {
  const locale = useCurrentLocale();
  const mode = useThemeMode();

  useEffect(() => {
    document.body.dataset.theme = mode;
  }, [mode]);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={getThemeConfig({ mode })} locale={locale}>
          <AntDesignAppWrapper>
            <Toaster richColors position="bottom-right" />
            {children}
          </AntDesignAppWrapper>
        </ConfigProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};
