import {
  ApiOutlined,
  CloudOutlined,
  DatabaseOutlined,
  JavaScriptOutlined,
  LayoutOutlined,
  MobileOutlined,
  RobotOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import type { FunctionComponent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FadeInItem } from "~/components/fade-in-item";
import { TechCategory } from "./tech-category";
import { TECH_CATEGORY_ENTRIES, type TechCategoryKey } from "./technologies.data";

const TECH_CATEGORY_ICONS: Record<TechCategoryKey, ReactNode> = {
  languages: <JavaScriptOutlined />,
  mobile: <MobileOutlined />,
  frontend: <LayoutOutlined />,
  backend: <ApiOutlined />,
  databases: <DatabaseOutlined />,
  devtools: <ToolOutlined />,
  cloud: <CloudOutlined />,
  ai: <RobotOutlined />,
};

export const TechnologiesPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("technologies:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("technologies:subtitle")}
      </Typography.Paragraph>

      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          {TECH_CATEGORY_ENTRIES.slice(0, 4).map(({ key, techs }, index) => (
            <FadeInItem key={key} index={index}>
              <TechCategory title={t(`technologies:${key}`)} icon={TECH_CATEGORY_ICONS[key]} techs={techs} />
            </FadeInItem>
          ))}
        </Col>
        <Col xs={24} md={12}>
          {TECH_CATEGORY_ENTRIES.slice(4).map(({ key, techs }, index) => (
            <FadeInItem key={key} index={index + 4}>
              <TechCategory title={t(`technologies:${key}`)} icon={TECH_CATEGORY_ICONS[key]} techs={techs} />
            </FadeInItem>
          ))}
        </Col>
      </Row>
    </div>
  );
};
