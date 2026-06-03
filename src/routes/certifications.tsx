import { createFileRoute } from "@tanstack/react-router";
import { CertificationsPage } from "~/screens/certifications/certifications-page";

export const Route = createFileRoute("/certifications")({
  component: CertificationsPage,
});
