import { Grid } from "antd";
import type { FunctionComponent, ReactNode } from "react";
import { AppLayoutDesktop } from "./app-layout-desktop";
import { AppLayoutMobile } from "./app-layout-mobile";

const { useBreakpoint } = Grid;

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({ children }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  if (isMobile) return <AppLayoutMobile>{children}</AppLayoutMobile>;
  return <AppLayoutDesktop>{children}</AppLayoutDesktop>;
};
