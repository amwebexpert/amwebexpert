export type OpenSourceProjectKey =
  | "webToolbox"
  | "amwebexpert"
  | "guessTheText"
  | "chromeExtensions"
  | "codingGuideHelper"
  | "rnPocCollection"
  | "openMindset";

export type OpenSourceProjectEntry = {
  key: OpenSourceProjectKey;
  tags: string[];
  githubUrl: string;
};

export const OPENSOURCE_PROJECT_ENTRIES: OpenSourceProjectEntry[] = [
  {
    key: "webToolbox",
    tags: ["React", "TypeScript", "Redux", "Electron", "Material-UI"],
    githubUrl: "https://github.com/amwebexpert/etoolbox",
  },
  {
    key: "amwebexpert",
    tags: ["React", "TypeScript", "Ant Design", "TanStack Router", "Vite", "i18next"],
    githubUrl: "https://github.com/amwebexpert/amwebexpert",
  },
  {
    key: "guessTheText",
    tags: ["Flutter", "Dart", "MobX", "SQLite", "Node.js", "NestJS"],
    githubUrl: "https://github.com/amwebexpert/guess_the_text",
  },
  {
    key: "chromeExtensions",
    tags: ["TypeScript", "React", "Chrome API", "Vite"],
    githubUrl: "https://github.com/amwebexpert/chrome-extensions-collection",
  },
  {
    key: "codingGuideHelper",
    tags: ["TypeScript", "Chrome API", "React", "Vite"],
    githubUrl: "https://github.com/amwebexpert/chrome-extensions-collection",
  },
  {
    key: "rnPocCollection",
    tags: ["React Native", "Expo", "OAuth2", "Three.js", "TypeScript"],
    githubUrl: "https://github.com/amwebexpert/poc-archiver-expo",
  },
  {
    key: "openMindset",
    tags: ["Python", "KivyMD", "SQLite"],
    githubUrl: "https://github.com/amwebexpert/open-mindset",
  },
];
