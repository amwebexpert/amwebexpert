import type { CSSProperties, FunctionComponent, ReactNode } from "react";

interface FadeInItemProps {
  index: number;
  children: ReactNode;
  baseDelayMs?: number;
  stepDelayMs?: number;
  style?: CSSProperties;
}

export const FadeInItem: FunctionComponent<FadeInItemProps> = ({
  index,
  children,
  baseDelayMs = 0,
  stepDelayMs = 80,
  style,
}) => (
  <div
    style={{
      opacity: 0,
      animation: "fadeInUp 0.5s ease forwards",
      animationDelay: `${baseDelayMs + index * stepDelayMs}ms`,
      ...style,
    }}
  >
    {children}
  </div>
);
