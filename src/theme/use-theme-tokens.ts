import { theme } from "antd";
import type { GlobalToken } from "antd/es/theme/interface";

export const useThemeTokens = (): GlobalToken => {
  const { token } = theme.useToken();
  return token;
};
