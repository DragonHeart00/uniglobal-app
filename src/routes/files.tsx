import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FolderClosed, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAppStore } from "@/store/app-store";
import { useSessionStore } from "@/store/session-store";
import {
  getDataset,
  getQuestionsByFolder,
  getAllQuestions,
  prepareQuestions,
} from "@/lib/questions";
import type { Mode } from "@/store/app-store";

interface Search {
  mode: Mode;
}

export const Route = createFileRoute("/files")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const mode = s.mode as Mode;
    return { mode: ["study", "test", "exam", "favorite"].includes(mode) ? mode : "study" };
  },
  component: FilesPage,
  head: () => ({ meta: [{ title: "GodKänt – Välj pärm" }] }),
});

function FilesPage() {
  const { t } = useTranslation();
  const { mode } = Route.useSearch();
  const lang = useAppStore((s) => s.lang);
  const data = getDataset(lang);
  const navigate = useNavigate();
  const startSession = useSessionStore((s) => s.start);

  const start = (folder: number | "all") => {
    const raw = folder === "all" ? getAllQuestions(lang) : getQuestionsByFolder(lang, folder);
    const qs = prepareQuestions(raw, true);
    startSession({ lang, mode, folder, questions: qs });
    void navigate({ to: "/test" });
  };

  return (
    <div>
      <PageHeader
        title={t("files.title")}
        subtitle={t("files.subtitle", { count: data.perFolder })}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <motion.button
          type="button"
          onClick={() => start("all")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border-2 border-primary/40 bg-accent/40 p-4 text-start shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <div className="font-semibold">{t("files.all")}</div>
            <div className="text-xs text-muted-foreground">
              {data.questions.length} {t("home.stats.questions").toLowerCase()}
            </div>
          </div>
        </motion.button>

        {Array.from({ length: data.folders }, (_, i) => i + 1).map((n) => (
          <motion.button
            key={n}
            type="button"
            onClick={() => start(n)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: n * 0.015 }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-start shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <FolderClosed className="h-5 w-5" />
            </span>
            <div>
              <div className="font-semibold">{t("files.item", { n })}</div>
              <div className="text-xs text-muted-foreground">
                {data.perFolder} {t("home.stats.questions").toLowerCase()}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
