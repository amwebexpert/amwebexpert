import { Tag, theme, Typography } from "antd";
import type { FunctionComponent } from "react";

interface TechCategoryProps {
  title: string;
  techs: string[];
}

export const TechCategory: FunctionComponent<TechCategoryProps> = ({ title, techs }) => {
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
      <Typography.Title level={5} style={{ marginBottom: 12, color: token.colorPrimary }}>
        {title}
      </Typography.Title>
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
