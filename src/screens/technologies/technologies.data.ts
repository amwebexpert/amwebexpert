export type TechCategoryKey =
  | "languages"
  | "mobile"
  | "frontend"
  | "backend"
  | "databases"
  | "devtools"
  | "cloud"
  | "ai";

export interface TechCategoryEntry {
  key: TechCategoryKey;
  techs: string[];
}

export const TECH_CATEGORY_ENTRIES: TechCategoryEntry[] = [
  {
    key: "languages",
    techs: ["TypeScript", "JavaScript", "Java", "Kotlin", "Dart", "Python", "Groovy", "Swift"],
  },
  {
    key: "mobile",
    techs: ["Flutter", "React Native", "Android SDK", "iOS / Swift", "Expo", "React Navigation", "MMKV", "MobX"],
  },
  {
    key: "frontend",
    techs: ["React", "TanStack Router", "TanStack Query", "Ant Design", "Material-UI", "Redux", "Zustand", "Angular"],
  },
  {
    key: "backend",
    techs: ["NestJS", "Node.js", "Spring Boot", "Grails", "GraphQL", "Apollo", "REST", "RabbitMQ", "OpenApi", "Swagger"],
  },
  {
    key: "databases",
    techs: ["PostgreSQL", "Oracle", "MySQL", "SQLite", "DynamoDB", "SQL Server", "DB2", "Sybase"],
  },
  {
    key: "devtools",
    techs: ["VSCode", "Cursor", "Claude Code", "IntelliJ", "Android Studio", "Xcode", "Git", "GitHub", "Gradle", "Maven", "Jenkins", "Cypress", "Jira", "SonarQube"],
  },
  {
    key: "cloud",
    techs: ["AWS (S3, DynamoDB, Cognito)", "Google Cloud", "Firebase", "Auth0", "Okta", "Docker", "PCF", "GitHub Actions"],
  },
  {
    key: "ai",
    techs: ["PyTorch", "Transformers.js", "RAG / Embeddings", "LLMs", "Vector search", "MCP", "ExecutorTorch", "Tree-sitter"],
  },
];
