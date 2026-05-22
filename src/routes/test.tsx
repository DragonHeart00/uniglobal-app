import { createFileRoute } from "@tanstack/react-router";
import { TestRunner } from "@/features/test/TestRunner";

export const Route = createFileRoute("/test")({
  component: TestRunner,
  head: () => ({ meta: [{ title: "GodKänt – Test" }] }),
});
