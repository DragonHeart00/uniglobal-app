import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  X,
  Flag,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSessionStore } from "@/store/session-store";
import { useAppStore } from "@/store/app-store";
import { EXAM_PASS } from "@/lib/questions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function TestRunner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const session = useSessionStore();
  const lang = useAppStore((s) => s.lang);
  const isFavorite = useAppStore((s) => s.isFavorite);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const setLatestResult = useAppStore((s) => s.setLatestResult);

  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  // Guard: if session not active, bounce home
  useEffect(() => {
    if (!session.active) navigate({ to: "/" });
  }, [session.active, navigate]);

  const q = session.questions[session.index];
  const total = session.questions.length;
  const mode = session.mode;
  const recorded = q ? session.answers[q.n] : undefined;

  // Restore prior selection when navigating between questions
  useEffect(() => {
    if (!q) return;
    if (recorded) {
      setSelected(recorded.selected);
      setRevealed(mode === "study"); // study reveals immediately
    } else {
      setSelected(null);
      setRevealed(false);
    }
  }, [q?.n, recorded?.selected, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!q || !session.lang) return null;

  const isCorrect = (ans: string) => ans === q.correct;
  const fav = isFavorite(session.lang, q.n);

  const choose = (ans: string) => {
    if (revealed && mode === "study") return; // locked after reveal in study
    setSelected(ans);
    const correct = isCorrect(ans);
    session.record(q.n, ans, correct);
    if (mode === "study") setRevealed(true);
  };

  const goNext = () => {
    if (session.index < total - 1) session.setIndex(session.index + 1);
    else finish();
  };

  const goPrev = () => {
    if (session.index > 0) session.setIndex(session.index - 1);
  };

  const skip = () => {
    session.record(q.n, null, false);
    goNext();
  };

  const finish = () => {
    let correct = 0,
      wrong = 0,
      skipped = 0;
    for (const item of session.questions) {
      const r = session.answers[item.n];
      if (!r || r.selected === null) skipped += 1;
      else if (r.correct) correct += 1;
      else wrong += 1;
    }
    const passed =
      mode === "exam" ? correct >= EXAM_PASS : correct / total >= 0.8;
    setLatestResult({
      mode: mode!,
      total,
      correct,
      wrong,
      skipped,
      passed,
      at: Date.now(),
      lang: session.lang!,
      folder: session.folder!,
    });
    navigate({ to: "/done" });
  };

  const onToggleFav = () => {
    const added = toggleFavorite(session.lang!, q.n);
    toast.success(t(added ? "toast.favoriteAdded" : "toast.favoriteRemoved"));
  };

  const progress = ((session.index + 1) / total) * 100;
  const showImage = q.image1 || q.image2;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-muted-foreground">
          {t("test.question")} {session.index + 1} {t("test.of")} {total}
        </div>
        <div className="flex items-center gap-2">
          {showImage ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImageOpen(true)}
              className="gap-1.5"
            >
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t("test.showImage")}</span>
            </Button>
          ) : null}
          <Button
            variant={fav ? "default" : "outline"}
            size="sm"
            onClick={onToggleFav}
            className="gap-1.5"
          >
            <Star className={cn("h-4 w-4", fav && "fill-current")} />
            <span className="hidden sm:inline">
              {t(fav ? "test.favoriteRemove" : "test.favoriteAdd")}
            </span>
          </Button>
        </div>
      </div>

      <Progress value={progress} className="mb-6 h-1.5" />

      <AnimatePresence mode="wait">
        <motion.article
          key={q.n}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
        >
          {showImage ? (
            <button
              type="button"
              onClick={() => setImageOpen(true)}
              className="mb-5 block w-full overflow-hidden rounded-xl border border-border bg-muted"
            >
              <img
                src={(q.image1 || q.image2)!}
                alt=""
                className="mx-auto max-h-72 w-auto object-contain"
                loading="lazy"
              />
            </button>
          ) : null}

          <h2 className="text-lg font-semibold leading-snug sm:text-xl">
            {q.question}
          </h2>

          <ul className="mt-6 space-y-2.5">
            {q.presented.map((ans, i) => {
              const chosen = selected === ans;
              const correct = isCorrect(ans);
              const showState = revealed || (mode !== "study" && false);
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => choose(ans)}
                    disabled={revealed && mode === "study"}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl border-2 border-border bg-background p-4 text-start text-sm font-medium transition-all",
                      "hover:border-primary/60 hover:bg-accent/40",
                      chosen && !showState && "border-primary bg-accent",
                      showState && correct && "border-success bg-success/10 text-foreground",
                      showState && chosen && !correct && "border-destructive bg-destructive/10",
                      revealed && mode === "study" && "cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-border text-xs font-bold",
                        chosen && !showState && "border-primary bg-primary text-primary-foreground",
                        showState && correct && "border-success bg-success text-success-foreground",
                        showState && chosen && !correct && "border-destructive bg-destructive text-destructive-foreground",
                      )}
                    >
                      {showState && correct ? (
                        <Check className="h-4 w-4" />
                      ) : showState && chosen && !correct ? (
                        <X className="h-4 w-4" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </span>
                    <span className="flex-1 leading-relaxed">{ans}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {revealed && mode === "study" ? (
            <div
              className={cn(
                "mt-5 rounded-xl border p-4 text-sm font-medium",
                selected === q.correct
                  ? "border-success/40 bg-success/10 text-foreground"
                  : "border-destructive/40 bg-destructive/10 text-foreground",
              )}
            >
              {selected === q.correct ? t("test.correct") : t("test.wrong")}
              {selected !== q.correct ? (
                <div className="mt-1 text-muted-foreground">
                  {t("test.correctAnswer")}: <span className="font-semibold text-foreground">{q.correct}</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </motion.article>
      </AnimatePresence>

      {/* Footer controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={goPrev} disabled={session.index === 0}>
          <ChevronLeft className="me-1 h-4 w-4 rtl:hidden" />
          <ChevronRight className="me-1 hidden h-4 w-4 rtl:inline" />
          {t("test.previous")}
        </Button>

        <div className="flex gap-2">
          {mode !== "study" ? (
            <Button variant="ghost" onClick={skip}>
              {t("test.skip")}
            </Button>
          ) : null}
          <Button variant="outline" onClick={finish} className="gap-1.5">
            <Flag className="h-4 w-4" />
            {t("test.submit")}
          </Button>
          <Button onClick={goNext}>
            {session.index === total - 1 ? t("test.submit") : t("test.next")}
            <ChevronRight className="ms-1 h-4 w-4 rtl:hidden" />
            <ChevronLeft className="ms-1 hidden h-4 w-4 rtl:inline" />
          </Button>
        </div>
      </div>

      {/* Image dialog */}
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">{t("test.showImage")}</DialogTitle>
          <DialogDescription className="sr-only">{q.question}</DialogDescription>
          <div className="grid gap-3 sm:grid-cols-2">
            {q.image1 ? (
              <img src={q.image1} alt="" className="w-full rounded-lg" />
            ) : null}
            {q.image2 ? (
              <img src={q.image2} alt="" className="w-full rounded-lg" />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
