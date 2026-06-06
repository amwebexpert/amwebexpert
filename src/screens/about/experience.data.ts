export interface ExperienceEntry {
  key: string;
  company: string;
  logoLight: string;
  logoDark: string;
  period: string;
  tags?: string[];
  aiPageLink?: boolean;
}

export const EXPERIENCE_ENTRIES: ExperienceEntry[] = [
  {
    key: "lichensInnovation",
    company: "Lichens Innovation",
    logoLight: "companies/lichens-light.png",
    logoDark: "companies/lichens-dark.png",
    period: "Dec 2024 – Present",
    tags: ["PyTorch", "MCP", "RAG", "NestJS", "React Native", "Expo", "Three.js", "TypeScript", "Tanstack", "Ant Design"],
    aiPageLink: true,
  },
  {
    key: "thirdbridge",
    company: "Thirdbridge",
    logoLight: "companies/thirdbridge-light.svg",
    logoDark: "companies/thirdbridge-dark.svg",
    period: "Nov 2023 – Dec 2024",
    tags: ["React Native", "Okta", "GraphQL", "TypeScript", "Tanstack Query", "MobX"],
  },
  {
    key: "nordaStelo",
    company: "Norda Stelo",
    logoLight: "companies/norda-stelo-light.png",
    logoDark: "companies/norda-stelo-dark.png",
    period: "Nov 2022 – Nov 2023",
    tags: ["React Native", "Ant Design", "AWS Cognito", "Cypress", "TypeScript", "Tanstack Query"],
  },
  {
    key: "levio",
    company: "Levio",
    logoLight: "companies/levio-light.svg",
    logoDark: "companies/levio-dark.svg",
    period: "Mar 2021 – Oct 2022",
    tags: ["Flutter", "React Native", "Auth0", "NestJS", "TypeScript", "Tanstack Query"],
  },
  {
    key: "upwave",
    company: "Upwave",
    logoLight: "companies/upwave-light.svg",
    logoDark: "companies/upwave-dark.svg",
    period: "Feb 2020 – Feb 2021",
    tags: ["React", "Redux", "Spring Boot", "Grails", "AWS"],
  },
  {
    key: "desjardins",
    company: "Desjardins",
    logoLight: "companies/desjardins-light.png",
    logoDark: "companies/desjardins-dark.png",
    period: "Jan 2019 – Jan 2020",
    tags: ["Spring Boot", "React", "Angular", "Kotlin", "RabbitMQ"],
  },
  {
    key: "acceoSolutions",
    company: "ACCEO Solutions",
    logoLight: "companies/acceo-light.png",
    logoDark: "companies/acceo-dark.png",
    period: "Oct 2013 – Sep 2017",
    tags: ["Java", "Spring", "Angular", "Jersey", "Jenkins"],
  },
];
