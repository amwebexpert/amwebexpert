export type ExperienceEntry = {
  company: string;
  logoLight: string;
  logoDark: string;
  role: string;
  roleFr: string;
  period: string;
  bullets: string[];
  bulletsFr: string[];
  tags?: string[];
  aiPageLink?: boolean;
};

export const EXPERIENCE_ENTRIES: ExperienceEntry[] = [
  {
    company: "Lichens Innovation",
    logoLight: "companies/lichens-light.png",
    logoDark: "companies/lichens-dark.png",
    role: "Senior Software Engineer",
    roleFr: "Ingénieur logiciel senior",
    period: "Dec 2024 – Present",
    bullets: [
      "Industrial AI solutions for mining & metallurgy: computer vision, RAG, MCP tooling",
      "Real-time CV pipelines (Mask R-CNN), semantic code search, on-device mobile RAG",
      "Technology advisor — practical, reliable AI tools for industry stakeholders",
      "Mobile field app (Expo): MJPEG live view, native streamer, real-time 3D pipe tracking (Three.js, WebSocket)",
      "Manufacture QA app: auto inspections, cam/GPS diagnosis, PDF/Excel export, OTA & factory provisioning",
    ],
    bulletsFr: [
      "Solutions IA industrielles pour mines et métallurgie : vision par ordinateur, RAG, outils MCP",
      "Pipelines CV temps réel (Mask R-CNN), recherche sémantique de code, RAG mobile on-device",
      "Conseiller technologique — outils IA pratiques et fiables pour l'industrie",
      "App terrain (Expo) : flux MJPEG, streaming natif, suivi 3D temps réel des conduites (Three.js, WebSocket)",
      "App QA manufacture : inspections auto, diagnostic cam/GPS, export PDF/Excel, OTA et paramétrage usine",
    ],
    tags: ["PyTorch", "MCP", "RAG", "NestJS", "React Native", "Expo", "Three.js", "TypeScript", "Tanstack", "Ant Design"],
    aiPageLink: true,
  },
  {
    company: "Thirdbridge",
    logoLight: "companies/thirdbridge-light.svg",
    logoDark: "companies/thirdbridge-dark.svg",
    role: "Mobile Engineer",
    roleFr: "Ingénieur mobile",
    period: "Nov 2023 – Dec 2024",
    bullets: [
      "Technical lead & mentoring on native mobile app architecture",
      "Improved coding guidelines, UI components, and business logic implementation",
      "React Native, Okta, geofencing, GraphQL, Firebase, MobX",
    ],
    bulletsFr: [
      "Lead technique et mentorat sur l'architecture d'application mobile native",
      "Amélioration des guides de codage, composants UI et logique métier",
      "React Native, Okta, géorepérage, GraphQL, Firebase, MobX",
    ],
    tags: ["React Native", "Okta", "GraphQL", "TypeScript", "Tanstack Query", "MobX"],
  },
  {
    company: "Norda Stelo",
    logoLight: "companies/norda-stelo-light.png",
    logoDark: "companies/norda-stelo-dark.png",
    role: "Senior Software Engineer",
    roleFr: "Ingénieur logiciel senior",
    period: "Nov 2022 – Nov 2023",
    bullets: [
      "Full-stack development of native mobile and web applications",
      "OAuth2 security pattern and Material Design UI principles",
      "React Native with Paper, web apps with Ant Design and Vite",
    ],
    bulletsFr: [
      "Développement full-stack d'applications mobiles natives et web",
      "Sécurité OAuth2 et principes Material Design pour l'interface",
      "React Native avec Paper, applications web avec Ant Design et Vite",
    ],
    tags: ["React Native", "Ant Design", "AWS Cognito", "Cypress", "TypeScript", "Tanstack Query"],
  },
  {
    company: "Levio",
    logoLight: "companies/levio-light.svg",
    logoDark: "companies/levio-dark.svg",
    role: "Mobile Software Engineer",
    roleFr: "Ingénieur logiciel mobile",
    period: "Mar 2021 – Oct 2022",
    bullets: [
      "Architecture and development of the Beneva native mobile application",
      "Flutter & React Native POCs, Auth0, Firebase, GraphQL, NestJS backend",
      "UI design, OAuth2 authentication, Agile delivery with Jira",
    ],
    bulletsFr: [
      "Architecture et développement de l'application mobile native Beneva",
      "POC Flutter et React Native, Auth0, Firebase, GraphQL, backend NestJS",
      "Conception UI, authentification OAuth2, livraison Agile avec Jira",
    ],
    tags: ["Flutter", "React Native", "Auth0", "NestJS", "TypeScript", "Tanstack Query"],
  },
  {
    company: "Upwave",
    logoLight: "companies/upwave-light.svg",
    logoDark: "companies/upwave-dark.svg",
    role: "Full-stack Software Engineer",
    roleFr: "Ingénieur logiciel full-stack",
    period: "Feb 2020 – Feb 2021",
    bullets: [
      "React/Redux data-visualization dashboard for marketing budget decisions",
      "Self-serve features with robust frontend testing (Cypress, Jest, RTL)",
      "Backend API with Groovy, Grails, Spring Boot on AWS (S3, DynamoDB)",
    ],
    bulletsFr: [
      "Tableau de bord React/Redux de visualisation de données pour le marketing",
      "Fonctionnalités self-serve avec tests frontend robustes (Cypress, Jest, RTL)",
      "API backend Groovy, Grails, Spring Boot sur AWS (S3, DynamoDB)",
    ],
    tags: ["React", "Redux", "Spring Boot", "Grails", "AWS"],
  },
  {
    company: "Desjardins",
    logoLight: "companies/desjardins-light.png",
    logoDark: "companies/desjardins-dark.png",
    role: "Full Stack Software Engineer",
    roleFr: "Ingénieur logiciel full-stack",
    period: "Jan 2019 – Jan 2020",
    bullets: [
      "Architecture and development of loan recovery management system",
      "RESTful microservices (Spring Boot) with SPA frontend (React, Angular)",
      "OAuth2, RabbitMQ, Spring Batch, Pivotal Cloud Foundry deployment",
    ],
    bulletsFr: [
      "Architecture et développement du système de gestion de recouvrement de prêts",
      "Microservices RESTful (Spring Boot) avec frontend SPA (React, Angular)",
      "OAuth2, RabbitMQ, Spring Batch, déploiement Pivotal Cloud Foundry",
    ],
    tags: ["Spring Boot", "React", "Angular", "Kotlin", "RabbitMQ"],
  },
  {
    company: "ACCEO Solutions",
    logoLight: "companies/acceo-light.png",
    logoDark: "companies/acceo-dark.png",
    role: "Development Team Lead",
    roleFr: "Chef d'équipe de développement",
    period: "Oct 2013 – Sep 2017",
    bullets: [
      "Team lead and senior engineer on Spring + Jersey REST web application",
      "Designed SPA with Angular 4 and new REST JSON APIs for product owners",
      "Agile delivery, mentoring, Maven/Jenkins CI pipeline",
    ],
    bulletsFr: [
      "Chef d'équipe et ingénieur senior sur application web Spring + Jersey REST",
      "Conception SPA Angular 4 et nouvelles APIs REST JSON pour les product owners",
      "Livraison Agile, mentorat, pipeline CI Maven/Jenkins",
    ],
    tags: ["Java", "Spring", "Angular", "Jersey", "Jenkins"],
  },
];
