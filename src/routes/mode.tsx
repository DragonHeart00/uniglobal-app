import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, ClipboardCheck, GraduationCap, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAppStore } from "@/store/app-store";
import { useSessionStore } from "@/store/session-store";
import { buildExam, prepareQuestions } from "@/lib/questions";
import { toast } from "sonner";

interface Search {
  start?: "exam";
}

export const Route = createFileRoute("/mode")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    start: s.start === "exam" ? "exam" : undefined,
  }),
  component: ModePage,
  head: () => ({ meta: [{ title: "GodKänt – Välj läge" }] }),
});

function ModePage() {
  const { t } = useTranslation();
  const { start } = Route.useSearch();
  const navigate = useNavigate();
  const lang = useAppStore((s) => s.lang);
  const favCount = useAppStore((s) => s.favorites[s.lang]?.length ?? 0);
  const startSession = useSessionStore((s) => s.start);

  // Auto-start exam if ?start=exam
  useEffect(() => {
    if (start !== "exam") return;
    const qs = prepareQuestions(buildExam(lang), true);
    startSession({ lang, mode: "exam", folder: "all", questions: qs });
    void navigate({ to: "/test" });
  }, [start, lang, navigate, startSession]);

  if (start === "exam") return null;

  return (
    <div>
      <PageHeader title={t("modes.title")} subtitle={t("modes.subtitle")} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          to="/files"
          search={{ mode: "study" }}
          icon={<BookOpen />}
          title={t("modes.study")}
          desc={t("modes.studyDesc")}
        />
        <Card
          to="/files"
          search={{ mode: "test" }}
          icon={<ClipboardCheck />}
          title={t("modes.test")}
          desc={t("modes.testDesc")}
        />
        <Card
          icon={<GraduationCap />}
          title={t("modes.exam")}
          desc={t("modes.examDesc")}
          onClick={() => {
            const qs = prepareQuestions(buildExam(lang), true);
            startSession({ lang, mode: "exam", folder: "all", questions: qs });
            void navigate({ to: "/test" });
          }}
        />
        <Card
          icon={<Star />}
          title={t("modes.favorite")}
          desc={`${t("modes.favoriteDesc")} (${favCount})`}
          onClick={() => {
            if (favCount === 0) {
              toast.error(t("toast.noFavorites"));
              return;
            }
            void navigate({ to: "/favorites" });
          }}
        />
      </div>
    </div>
  );
}

function Card({
  to,
  search,
  icon,
  title,
  desc,
  onClick,
}: {
  to?: string;
  search?: Record<string, string>;
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  const cls =
    "group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 text-start shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated";
  const inner = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-gradient-brand group-hover:text-brand-foreground">
        <span className="[&>svg]:h-6 [&>svg]:w-6">{icon}</span>
      </span>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
    </>
  );
  if (to) {
    return (
      <Link to={to} search={search as never} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
