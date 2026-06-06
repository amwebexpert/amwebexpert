import { FadeInItem } from "~/components/fade-in-item";
import { Col, Row, Tag, theme, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

interface AiTechCategory {
  key: string;
  techs: string[];
}

const AI_TECH_CATEGORIES: AiTechCategory[] = [
  {
    key: "llm",
    techs: ["PyTorch", "TorchVision", "Transformers.js", "ExecutorTorch", "Qwen", "Jina Embeddings v2"],
  },
  {
    key: "rag",
    techs: ["Vector embeddings", "sqlite-vec", "BM25 / FTS5", "RRF fusion", "Cross-encoder reranking", "Cosine similarity"],
  },
  {
    key: "cv",
    techs: ["Mask R-CNN", "ResNet-50 + FPN", "Instance segmentation", "OpenCV", "MJPEG streaming"],
  },
  {
    key: "parsing",
    techs: ["Tree-sitter", "TypeScript AST", "Python AST", "C++ / C# parsing", "Call graph analysis"],
  },
  {
    key: "protocols",
    techs: ["MCP (Model Context Protocol)", "WebSocket async", "Claude Code", "Cursor IDE", "OpenAI-compatible"],
  },
  {
    key: "mobileAI",
    techs: ["React Native + ExecutorTorch", "Quantized models (0.6B–3B)", "On-device inference", "SQLite vectors", "Voice recognition"],
  },
];

export const AiTechStack: FunctionComponent = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <Row gutter={[16, 16]}>
      {AI_TECH_CATEGORIES.map(({ key, techs }, index) => (
        <Col xs={24} md={12} key={key}>
          <FadeInItem index={index} style={{ height: "100%" }}>
            <div
              style={{
                padding: 16,
                borderRadius: token.borderRadiusLG,
                background: token.colorBgElevated,
                border: `1px solid ${token.colorBorder}`,
                height: "100%",
              }}
            >
              <Typography.Text strong style={{ display: "block", marginBottom: 10, color: token.colorPrimary }}>
                {t(`ai:${key}`)}
              </Typography.Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {techs.map((tech) => (
                  <Tag key={tech} style={{ margin: 0, fontSize: 12 }}>
                    {tech}
                  </Tag>
                ))}
              </div>
            </div>
          </FadeInItem>
        </Col>
      ))}
    </Row>
  );
};
