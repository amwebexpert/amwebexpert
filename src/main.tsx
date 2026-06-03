import { createHashHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./app-providers";
import "./i18n/i18n";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import { getBasepath } from "./utils/environment.utils";

const root = document.getElementById("root");
if (!root) throw new Error("[main] root element not found");

// Hash history so direct URLs work on GitHub Pages (no server-side routing needed)
const router = createRouter({
  routeTree,
  basepath: getBasepath(),
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(root).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);
