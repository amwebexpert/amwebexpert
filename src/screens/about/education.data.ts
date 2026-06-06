export interface EducationEntry {
  degree: string;
  degreeEn: string;
  school: string;
  years: string;
}

export const EDUCATION_ENTRIES: EducationEntry[] = [
  {
    degree: "Baccalauréat en informatique",
    degreeEn: "Bachelor's degree in Computer Science",
    school: "Université du Québec à Trois-Rivières",
    years: "1992 – 1995",
  },
  {
    degree: "Baccalauréat en enseignement des mathématiques",
    degreeEn: "Bachelor's degree in Mathematics Teaching",
    school: "Université du Québec à Trois-Rivières",
    years: "1988 – 1990",
  },
];
