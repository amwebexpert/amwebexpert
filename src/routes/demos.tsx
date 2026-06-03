import { createFileRoute } from "@tanstack/react-router";
import { DemosPage } from "~/screens/demos/demos-page";

export const Route = createFileRoute("/demos")({
  component: DemosPage,
});
