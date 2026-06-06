export type OpenSourceProjectKey =
  | "webToolbox"
  | "guessTheText"
  | "chromeExtensions"
  | "rnPocCollection"
  | "openMindset";

export interface OpenSourceProjectEntry {
  key: OpenSourceProjectKey;
  tags: string[];
  githubUrl: string;
  /** Path relative to `public/` — sourced from the GitHub repo app icon. */
  logo: string;
}

export const OPENSOURCE_PROJECT_ENTRIES: OpenSourceProjectEntry[] = [
  {
    key: "webToolbox",
    tags: ["React", "TypeScript", "Redux", "Electron", "Material-UI"],
    githubUrl: "https://github.com/amwebexpert/etoolbox",
    logo: "opensource/web-toolbox.png",
  },
  {
    key: "guessTheText",
    tags: ["Flutter", "Dart", "MobX", "SQLite", "Node.js", "NestJS"],
    githubUrl: "https://github.com/amwebexpert/guess_the_text",
    logo: "opensource/guess-the-text.png",
  },
  {
    key: "chromeExtensions",
    tags: ["TypeScript", "React", "Chrome API", "Vite"],
    githubUrl: "https://github.com/amwebexpert/chrome-extensions-collection",
    logo: "opensource/chrome-extensions.png",
  },
  {
    key: "rnPocCollection",
    tags: ["React Native", "Expo", "OAuth2", "Three.js", "TypeScript"],
    githubUrl: "https://github.com/amwebexpert/poc-archiver-expo",
    logo: "opensource/rn-poc-collection.png",
  },
  {
    key: "openMindset",
    tags: ["Python", "KivyMD", "SQLite"],
    githubUrl: "https://github.com/amwebexpert/open-mindset",
    logo: "opensource/open-mindset.png",
  },
];
