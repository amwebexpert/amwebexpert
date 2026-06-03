export const isDevelopment = (): boolean => import.meta.env.DEV;
export const isProduction = (): boolean => import.meta.env.PROD;
export const getEnvironmentName = (): string => import.meta.env.MODE;

/** Router basepath; must match Vite `base` (see vite.config.ts). */
export const getBasepath = (): string => import.meta.env.BASE_URL;
