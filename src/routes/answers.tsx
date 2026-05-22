import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle, MinusCircle, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/session-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/answers")({
  component: AnswersPage,
  head: () => ({ meta: [{ title: "GodKänt – Svar" }] }),
});

function AnswersPage() {
  const { t } = useTranslation();
  const session = useSessionStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.active) void navigate({ to: "/" });
  }, [session.active, navigate]);

  if (!session.active) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={t("done.review")}
        action={
          <Button asChild variant="outline">
            <Link to="/done">
              <ArrowLeft className="me-2 h-4 w-4 rtl:hidden" />
              {t("common.back")}
            </Link>
          </Button>
        }
      />

      <ol className="space-y-4">
        {session.questions.map((q, i) => {
          const rec = session.answers[q.n];
          const skipped = !rec || rec.selected === null;
          const correct = rec?.correct;
          return (
            <li
              key={q.n}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="text-sm font-medium text-muted-foreground">
                  {t("test.question")} {i + 1}
                </div>
                <Badge skipped={skipped} correct={!!correct} t={t} />
              </div>

              <h3 className="font-semibold leading-snug">{q.question}</h3>

              {q.image1 || q.image2 ? (
                <div className="mt-3 flex gap-2">
                  {q.image1 ? <img src={q.image1} alt="" className="max-h-40 rounded-lg border border-border" /> : null}
                  {q.image2 ? <img src={q.image2} alt="" className="max-h-40 rounded-lg border border-border" /> : null}
                </div>
              ) : null}

              <ul className="mt-4 space-y-2">
                {q.presented.map((ans, j) => {
                  const isCorrect = ans === q.correct;
                  const isChosen = rec?.selected === ans;
                  return (
                    <li
                      key={j}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm",
                        isCorrect && "border-success/40 bg-success/10",
                        isChosen && !isCorrect && "border-destructive/40 bg-destructive/10",
                        !isCorrect && !isChosen && "border-border",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                          isCorrect && "bg-success text-success-foreground",
                          isChosen && !isCorrect && "bg-destructive text-destructive-foreground",
                          !isCorrect && !isChosen && "bg-muted text-muted-foreground",
                        )}
                      >
                        {String.fromCharCode(65 + j)}
                      </span>
                      <span className="flex-1">{ans}</span>
                      {isChosen ? (
                        <span className="text-xs font-medium text-muted-foreground">
                          {t("test.yourAnswer")}
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Badge({
  skipped,
  correct,
  t,
}: {
  skipped: boolean;
  correct: boolean;
  t: (k: string) => string;
}) {
  if (skipped) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <MinusCircle className="h-3.5 w-3.5" />
        {t("done.skipped")}
      </span>
    );
  }
  return correct ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
      <CheckCircle2 className="h-3.5 w-3.5" />
      {t("test.correct")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-semibold text-destructive">
      <XCircle className="h-3.5 w-3.5" />
      {t("test.wrong")}
    </span>
  );
}
