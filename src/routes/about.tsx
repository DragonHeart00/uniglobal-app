import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "GodKänt – Om oss" },
      { name: "description", content: "Om GodKänt – Körkort B på svenska och arabiska." },
    ],
  }),
});

function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t("about.title")} />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <p className="leading-relaxed text-foreground/90">{t("about.body")}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          {t("about.version")}: <span className="font-mono font-semibold">2.0.0</span>
        </p>
      </div>
    </div>
  );
}
