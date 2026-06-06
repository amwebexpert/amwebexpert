import type { FunctionComponent } from "react";
import { useThemeMode } from "../../store/ui-preferences.store";

const LOGO_SIZE = 81;

/** Fixed surfaces paired with theme-specific logo assets. */
const LOGO_SURFACES = {
  light: {
    background: "#ffffff",
    border: "rgba(0, 0, 0, 0.1)",
  },
  dark: {
    background: "#0f1117",
    border: "rgba(255, 255, 255, 0.12)",
  },
} as const;

type ExperienceCompanyLogoProps = {
  logoLight: string;
  logoDark: string;
  alt: string;
  size?: number;
};

export const experienceLogoSize = LOGO_SIZE;

const resolveLogoSrc = (logoLight: string, logoDark: string, themeMode: "light" | "dark") => {
  const path = themeMode === "dark" ? logoDark : logoLight;
  return `${import.meta.env.BASE_URL}${path}`;
};

export const ExperienceCompanyLogo: FunctionComponent<ExperienceCompanyLogoProps> = ({
  logoLight,
  logoDark,
  alt,
  size = LOGO_SIZE,
}) => {
  const themeMode = useThemeMode();
  const { background, border } = LOGO_SURFACES[themeMode];

  return (
    <img
      src={resolveLogoSrc(logoLight, logoDark, themeMode)}
      alt={alt}
      width={size}
      height={size}
      style={{
        display: "block",
        objectFit: "contain",
        borderRadius: 6,
        background,
        border: `1px solid ${border}`,
        padding: 3,
        boxSizing: "border-box",
      }}
    />
  );
};
