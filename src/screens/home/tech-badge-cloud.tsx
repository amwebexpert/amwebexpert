import { Tag, theme } from "antd";
import type { FunctionComponent } from "react";

const TECH_STACK = [
  "Flutter",
  "React Native",
  "React",
  "TypeScript",
  "TanStack Router",
  "Kotlin",
  "Dart",
  "Node.js",
  "NestJS",
  "Python",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Firebase",
  "GraphQL",
  "OAuth2",
  "GitHub Actions",
];

export const TechBadgeCloud: FunctionComponent = () => {
  const { token } = theme.useToken();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 640 }}>
      {TECH_STACK.map((tech, index) => (
        <Tag
          key={tech}
          style={{
            fontSize: 13,
            padding: "4px 12px",
            borderRadius: 20,
            border: `1px solid ${token.colorPrimary}`,
            color: token.colorPrimary,
            background: "transparent",
            opacity: 0,
            animation: "fadeInUp 0.5s ease forwards",
            animationDelay: `${600 + index * 70}ms`,
          }}
        >
          {tech}
        </Tag>
      ))}
    </div>
  );
};
