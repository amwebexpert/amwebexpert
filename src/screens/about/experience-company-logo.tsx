import { theme } from "antd";
import type { FunctionComponent } from "react";

const LOGO_SIZE = 36;

type ExperienceCompanyLogoProps = {
  src: string;
  alt: string;
  size?: number;
};

export const experienceLogoSize = LOGO_SIZE;

export const ExperienceCompanyLogo: FunctionComponent<ExperienceCompanyLogoProps> = ({
  src,
  alt,
  size = LOGO_SIZE,
}) => {
  const { token } = theme.useToken();

  return (
    <img
      src={`${import.meta.env.BASE_URL}${src}`}
      alt={alt}
      width={size}
      height={size}
      style={{
        display: "block",
        objectFit: "contain",
        borderRadius: 6,
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        padding: 3,
        boxSizing: "border-box",
      }}
    />
  );
};
