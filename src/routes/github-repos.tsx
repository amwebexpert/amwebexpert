import { createFileRoute } from "@tanstack/react-router";
import { GitHubReposPage } from "~/screens/github-repos/github-repos-page";

export const Route = createFileRoute("/github-repos")({
  component: GitHubReposPage,
});
