import { LinkOutlined } from "@ant-design/icons";
import { Card, theme, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { PUBLICATION_ENTRIES } from "./publications.data";

const { Title } = Typography;

export const AboutPagePublications: FunctionComponent = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <Card style={{ marginTop: 24 }}>
      <Title level={5} style={{ marginBottom: 16 }}>
        <LinkOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
        {t("aboutPage:publicationsTitle")}
      </Title>
      <ul style={{ paddingLeft: 20, margin: 0 }}>
        {PUBLICATION_ENTRIES.map((pub) => (
          <li key={pub.url} style={{ marginBottom: 8 }}>
            <a href={pub.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14 }}>
              {t(pub.titleKey)}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};
