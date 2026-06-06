import { Button, Tooltip } from "antd";
import type { FunctionComponent, ReactNode } from "react";

interface AsyncActionButtonProps {
  onAction: () => void;
  isLoading: boolean;
  icon: ReactNode;
  title: string;
  disabled?: boolean;
}

export const AsyncActionButton: FunctionComponent<AsyncActionButtonProps> = ({
  onAction,
  isLoading,
  icon,
  title,
  disabled = false,
}) => (
  <Tooltip title={isLoading ? undefined : title}>
    <Button
      type="text"
      shape="circle"
      icon={icon}
      loading={isLoading}
      disabled={disabled || isLoading}
      onClick={onAction}
      aria-label={title}
    />
  </Tooltip>
);
