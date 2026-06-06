export type AiProjectKey =
  | "grizzlyDetector"
  | "codeCrawler"
  | "offlineRagApp"
  | "telegramAssistant";

export type AiProjectEntry = {
  key: AiProjectKey;
  tags: string[];
};

export const AI_PROJECT_ENTRIES: AiProjectEntry[] = [
  {
    key: "grizzlyDetector",
    tags: ["PyTorch", "Mask R-CNN", "ResNet-50", "OpenCV", "WebSocket", "Python", "NestJS"],
  },
  {
    key: "codeCrawler",
    tags: ["Transformers.js", "MCP", "RAG", "sqlite-vec", "Tree-sitter", "NestJS", "TypeScript"],
  },
  {
    key: "offlineRagApp",
    tags: ["React Native", "ExecutorTorch", "Qwen", "SQLite", "RAG", "Expo", "TypeScript"],
  },
  {
    key: "telegramAssistant",
    tags: ["Claude Agent SDK", "Telegram", "MCP", "Zapier", "TypeScript", "Node.js", "PM2"],
  },
];
