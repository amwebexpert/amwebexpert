export type TestimonialEntry = {
  author: string;
  roleKey: string;
  quote: string;
  quoteFr: string;
};

export const TESTIMONIAL_ENTRIES: TestimonialEntry[] = [
  {
    author: "Eric Le Donge",
    roleKey: "aboutPage:testimonials.ericRole",
    quote:
      "André was my mentor on the project to create the Beneva mobile application. He has a lot of experience in development and keeps his knowledge very up to date. He helped me progress in many areas, including the mocking aspects of unit testing. He is a very open-minded person to whom we can confidently present new technical approaches.",
    quoteFr:
      "André était mon mentor sur le projet de création de l'application mobile Beneva. Il possède une grande expérience en développement et maintient ses connaissances très à jour. Il m'a aidé à progresser dans de nombreux domaines, notamment le mocking en tests unitaires. C'est une personne très ouverte à qui on peut présenter de nouvelles approches techniques en toute confiance.",
  },
  {
    author: "Daniel Deschenes",
    roleKey: "aboutPage:testimonials.danielRole",
    quote:
      "André is an incredible developer with a lot of skills and competencies. For any challenge, André will find a permanent and scalable solution, whatever it is frontend or backend. He can lead and advise on multiple technical aspects of a project. André is also a wonderful human-being — team spirit and positive attitude are always part of him.",
    quoteFr:
      "André est un développeur incroyable avec de nombreuses compétences. Pour tout défi, André trouvera une solution durable et évolutive, que ce soit en frontend ou backend. Il peut diriger et conseiller sur de multiples aspects techniques d'un projet. André est aussi une personne formidable — l'esprit d'équipe et une attitude positive font toujours partie de lui.",
  },
];
