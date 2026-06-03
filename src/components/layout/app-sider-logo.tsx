import { theme, Typography } from "antd";
import type { FunctionComponent } from "react";
import { AppLogo } from "~/components/logos/app-logo";
import { HEADER_HEIGHT } from "./app-layout.constants";

interface AppSiderLogoProps {
  height?: number;
}

export const AppSiderLogo: FunctionComponent<AppSiderLogoProps> = ({ height = HEADER_HEIGHT }) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 16px",
        borderBottom: `1px solid ${token.colorBorder}`,
      }}
    >
      <AppLogo width={32} />
      <Typography.Text strong style={{ fontSize: 14, color: token.colorPrimary }}>
        André Masson
      </Typography.Text>
    </div>
  );
};
