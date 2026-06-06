import { useQuery } from "@tanstack/react-query";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  fork: boolean;
}

const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  const response = await fetch("https://api.github.com/users/amwebexpert/repos?sort=updated&per_page=100");
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  const data = (await response.json()) as GitHubRepo[];
  return data
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);
};

export const useGitHubRepos = () =>
  useQuery({
    queryKey: ["github-repos"],
    queryFn: fetchGitHubRepos,
    staleTime: FIVE_MINUTES_MS,
  });
