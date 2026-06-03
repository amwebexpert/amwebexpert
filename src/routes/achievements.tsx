import { createFileRoute } from "@tanstack/react-router";
import { AchievementsPage } from "~/screens/achievements/achievements-page";

export const Route = createFileRoute("/achievements")({
  component: AchievementsPage,
});
