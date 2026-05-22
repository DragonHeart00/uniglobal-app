import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Star, Play, Trash2, ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { useSessionStore } from "@/store/session-store";
import { getQuestionsByNumbers, prepareQuestions } from "@/lib/questions";
import { toast } from "sonner";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
  head: () => ({ meta: [{ title: "GodKänt – Favoriter" }] }),
});

function FavoritesPage() {
  const { t } = useTranslation();
  const lang = useAppStore((s) => s.lang);
  const favorites = useAppStore((s) => s.favorites[s.lang] ?? []);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const clearFavorites = useAppStore((s) => s.clearFavorites);
  const startSession = useSessionStore((s) => s.start);
  const navigate = useNavigate();

  const items = getQuestionsByNumbers(lang, favorites);

  const startPractice = () => {
    if (items.length === 0) {
      toast.error(t("toast.noFavorites"));
      return;
    }
    const qs = prepareQuestions(items, true);
    startSession({ lang, mode: "favorite", folder: "all", questions: qs });
    void navigate({ to: "/test" });
  };

  return (
    <div>
      <PageHeader
        title={t("favorites.title")}
        subtitle={`${items.length} ${t("home.stats.questions").toLowerCase()}`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                clearFavorites(lang);
                toast.success(t("toast.favoritesCleared"));
              }}
              disabled={items.length === 0}
            >
              <Trash2 className="me-2 h-4 w-4" />
              {t("favorites.clear")}
            </Button>
            <Button
              onClick={startPractice}
              disabled={items.length === 0}
              className="bg-gradient-brand text-brand-foreground"
            >
              <Play className="me-2 h-4 w-4" />
              {t("favorites.start")}
            </Button>
          </div>
        }
      />

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <Star className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <p className="mt-4 text-muted-foreground">{t("favorites.empty")}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((q, i) => (
            <motion.li
              key={q.n}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft"
            >
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium leading-snug">{q.question}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("files.item", { n: q.folder })}
                  {q.image1 || q.image2 ? (
                    <span className="ms-2 inline-flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                    </span>
                  ) : null}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  toggleFavorite(lang, q.n);
                  toast.success(t("toast.favoriteRemoved"));
                }}
                aria-label={t("test.favoriteRemove")}
              >
                <Star className="h-4 w-4 fill-current text-warning" />
              </Button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
