import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, theme } from "antd";
import type { FunctionComponent } from "react";
import { HEADER_HEIGHT, SIDER_WIDTH } from "./app-layout.constants";

interface AppMenuTogglerProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const AppMenuToggler: FunctionComponent<AppMenuTogglerProps> = ({ isCollapsed, onToggle }) => {
  const { token } = theme.useToken();

  return (
    <Button
      type="text"
      size="small"
      icon={isCollapsed ? <RightOutlined /> : <LeftOutlined />}
      onClick={onToggle}
      style={{
        position: "fixed",
        left: isCollapsed ? 8 : SIDER_WIDTH - 12,
        top: (HEADER_HEIGHT - 24) / 2 + HEADER_HEIGHT,
        zIndex: 200,
        transition: "left 200ms ease",
        width: 24,
        height: 24,
        borderRadius: "50%",
        border: `1px solid ${token.colorBorder}`,
        background: token.colorBgContainer,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        fontSize: 10,
      }}
    />
  );
};
