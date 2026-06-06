import type { FunctionComponent } from "react";
import { useThemeMode } from "../../store/ui-preferences.store";
import { EXPERIENCE_LOGO_SIZE } from "./experience-company-logo.constants";

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

interface ExperienceCompanyLogoProps {
  logoLight: string;
  logoDark: string;
  alt: string;
  size?: number;
}

interface ResolveLogoSrcArgs {
  logoLight: string;
  logoDark: string;
  themeMode: "light" | "dark";
}

const resolveLogoSrc = ({ logoLight, logoDark, themeMode }: ResolveLogoSrcArgs): string => {
  const path = themeMode === "dark" ? logoDark : logoLight;
  return `${import.meta.env.BASE_URL}${path}`;
};

export const ExperienceCompanyLogo: FunctionComponent<ExperienceCompanyLogoProps> = ({
  logoLight,
  logoDark,
  alt,
  size = EXPERIENCE_LOGO_SIZE,
}) => {
  const themeMode = useThemeMode();
  const { background, border } = LOGO_SURFACES[themeMode];

  return (
    <img
      src={resolveLogoSrc({ logoLight, logoDark, themeMode })}
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
