export interface TestimonialEntry {
  key: string;
  author: string;
  roleKey: string;
}

export const TESTIMONIAL_ENTRIES: TestimonialEntry[] = [
  {
    key: "eric",
    author: "Eric Le Donge",
    roleKey: "aboutPage:testimonials.eric.role",
  },
  {
    key: "daniel",
    author: "Daniel Deschenes",
    roleKey: "aboutPage:testimonials.daniel.role",
  },
];
