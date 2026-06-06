import type { CSSProperties, FunctionComponent } from "react";

interface AppLogoProps {
  width?: number;
  style?: CSSProperties;
}

export const AppLogo: FunctionComponent<AppLogoProps> = ({ width = 48, style }) => (
  <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AM" width={width} height={width} style={{ borderRadius: 8, ...style }} />
);
