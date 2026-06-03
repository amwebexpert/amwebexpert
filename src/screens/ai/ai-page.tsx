import { Col, Divider, Row, Typography } from "antd";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { AiProjectCard, type AiProjectInfo } from "./ai-project-card";
import { AiTechStack } from "./ai-tech-stack";

const AI_PROJECTS: AiProjectInfo[] = [
  {
    title: "Grizzly Detector",
    company: "Lichens Innovation",
    description: "Real-time computer vision service for industrial equipment monitoring in mining environments.",
    bullets: [
      "Mask R-CNN (ResNet-50 + FPN) for multi-class instance segmentation: rock, metal mesh, metal bar, rock pile",
      "Async pipeline: WebSocket video frames → PyTorch inference → SVG polygon output → React UI",
      "Automatic hardware selection: Apple Silicon MPS / NVIDIA CUDA / CPU fallback",
      "Configurable confidence threshold, real-time frame processing",
    ],
    tags: ["PyTorch", "Mask R-CNN", "ResNet-50", "OpenCV", "WebSocket", "Python", "NestJS"],
  },
  {
    title: "Code Crawler",
    company: "Lichens Innovation",
    description: "MCP server for semantic code search across large Git repositories — fully local, zero cloud dependencies.",
    bullets: [
      "Jina Embeddings v2 (Transformers.js) + hybrid search: vector KNN + BM25/FTS5 with RRF fusion",
      "Jina Reranker cross-encoder for precision reranking, RAG generation via Qwen2.5 Coder 1.5B",
      "AST-aligned chunking via tree-sitter (TypeScript, Python, C++, C#) with call graph enrichment",
      "MCP + REST + static UI, SQLite + sqlite-vec in-process — no external services",
      "Integrated with Claude Code and Cursor via Model Context Protocol",
    ],
    tags: ["Transformers.js", "MCP", "RAG", "sqlite-vec", "Tree-sitter", "NestJS", "TypeScript"],
  },
  {
    title: "Offline RAG App",
    company: "Lichens Innovation",
    description: "Mobile application with complete RAG pipeline running entirely on-device — no internet, no cloud.",
    bullets: [
      "MULTI_QA_MINILM multilingual embeddings + Qwen3 0.6B quantized LLM via ExecutorTorch",
      "PDF ingestion, text extraction, chunking (800 tokens / 150 overlap), cosine similarity search",
      "Multi-turn RAG chat with context injection from semantic search results",
      "Voice recognition for hands-free queries, biometric auth, FR/EN bilingual",
    ],
    tags: ["React Native", "ExecutorTorch", "Qwen", "SQLite", "RAG", "Expo", "TypeScript"],
  },
];

export const AiPage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <Typography.Title level={2}>{t("ai:title")}</Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 32 }}>
        {t("ai:subtitle")}
      </Typography.Paragraph>

      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {t("ai:techStackTitle")}
      </Typography.Title>
      <AiTechStack />

      <Divider style={{ margin: "40px 0 32px" }} />

      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {t("ai:projectsTitle")}
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {AI_PROJECTS.map((project) => (
          <Col xs={24} md={12} key={project.title}>
            <AiProjectCard project={project} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
