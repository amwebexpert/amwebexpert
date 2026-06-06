export const SHARED_TOKENS = {
  borderRadius: 6,
  borderRadiusLG: 8,
  borderRadiusSM: 4,
  fontSize: 14,
  fontSizeSM: 12,
  fontSizeLG: 16,
  fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
  fontFamilyCode: "'JetBrains Mono', 'Fira Code', monospace",
  lineHeight: 1.6,
  padding: 16,
  paddingSM: 12,
  paddingLG: 20,
  margin: 16,
  marginSM: 8,
  marginLG: 24,
} as const;

export const SHARED_COMPONENT_TOKENS = {
  Card: { borderRadiusLG: 8 },
  Button: { borderRadius: 6 },
  Input: { borderRadius: 6 },
  Menu: {
    itemBg: "transparent" as const,
    itemBorderRadius: 6,
    activeBarWidth: 2,
  },
} as const;
