import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "~/screens/about/about-page";

export const Route = createFileRoute("/profile")({
  component: AboutPage,
});
