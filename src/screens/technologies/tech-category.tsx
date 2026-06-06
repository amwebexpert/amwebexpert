import { Flex, Tag, theme, Typography } from "antd";
import type { FunctionComponent, ReactNode } from "react";

interface TechCategoryProps {
  title: string;
  techs: string[];
  icon: ReactNode;
}

export const TechCategory: FunctionComponent<TechCategoryProps> = ({ title, techs, icon }) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        marginBottom: 24,
        padding: 20,
        borderRadius: token.borderRadiusLG,
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorder}`,
      }}
    >
      <Flex align="center" gap={10} style={{ marginBottom: 12 }}>
        <span style={{ display: "flex", fontSize: 20, color: token.colorPrimary, lineHeight: 1 }}>{icon}</span>
        <Typography.Title level={5} style={{ margin: 0, color: token.colorPrimary }}>
          {title}
        </Typography.Title>
      </Flex>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {techs.map((tech) => (
          <Tag key={tech} style={{ margin: 0, fontSize: 13 }}>
            {tech}
          </Tag>
        ))}
      </div>
    </div>
  );
};
