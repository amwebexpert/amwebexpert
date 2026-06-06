export const EXPERTISE_ITEMS_EN = [
  "Mobile app architecture & development (Flutter, React Native)",
  "Full-stack web development (React, NestJS, Node.js)",
  "Technical leadership & mentoring",
  "Spring Boot / microservices (enterprise backends)",
  "OAuth2, Auth0, Firebase authentication",
  "Cloud (AWS, GCP, Docker) & CI/CD pipelines",
  "AI / RAG / On-device ML (PyTorch, Transformers.js)",
];

export const EXPERTISE_ITEMS_FR = [
  "Architecture & développement mobile (Flutter, React Native)",
  "Développement full-stack (React, NestJS, Node.js)",
  "Leadership technique & mentorat",
  "Spring Boot / microservices (backends d'entreprise)",
  "Authentification OAuth2, Auth0, Firebase",
  "Cloud (AWS, GCP, Docker) & pipelines CI/CD",
  "IA / RAG / ML on-device (PyTorch, Transformers.js)",
];

interface GetExpertiseItemsArgs {
  isFrench: boolean;
}

export const getExpertiseItems = ({ isFrench }: GetExpertiseItemsArgs): string[] =>
  isFrench ? EXPERTISE_ITEMS_FR : EXPERTISE_ITEMS_EN;
