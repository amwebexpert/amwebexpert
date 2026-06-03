import { createFileRoute } from "@tanstack/react-router";
import { TechnologiesPage } from "~/screens/technologies/technologies-page";

export const Route = createFileRoute("/technologies")({
  component: TechnologiesPage,
});
