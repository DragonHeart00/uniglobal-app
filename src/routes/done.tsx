import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Home, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { useSessionStore } from "@/store/session-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/done")({
  component: DonePage,
  head: () => ({ meta: [{ title: "GodKänt – Resultat" }] }),
});

function DonePage() {
  const { t } = useTranslation();
  const latest = useAppStore((s) => s.latestResult);
  const session = useSessionStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!latest) void navigate({ to: "/" });
  }, [latest, navigate]);

  if (!latest) return null;

  const pct = Math.round((latest.correct / latest.total) * 100);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t("done.title")} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft sm:p-12"
      >
        <div
          className={cn(
            "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
            latest.passed ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
          )}
        >
          {latest.passed ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
        </div>
        <h2
          className={cn(
            "mt-5 text-2xl font-bold",
            latest.passed ? "text-success" : "text-destructive",
          )}
        >
          {t(latest.passed ? "done.passed" : "done.failed")}
        </h2>
        <p className="mt-2 text-5xl font-bold tabular-nums">
          {latest.correct}
          <span className="text-2xl font-semibold text-muted-foreground"> / {latest.total}</span>
        </p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{pct}%</p>

        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
          <Tile label={t("done.correct")} value={latest.correct} tone="success" />
          <Tile label={t("done.wrong")} value={latest.wrong} tone="destructive" />
          <Tile label={t("done.skipped")} value={latest.skipped} tone="muted" />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {session.active ? (
            <Button asChild variant="outline">
              <Link to="/answers">
                <ListChecks className="me-2 h-4 w-4" />
                {t("done.review")}
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link to="/mode">
              <RotateCcw className="me-2 h-4 w-4" />
              {t("done.retry")}
            </Link>
          </Button>
          <Button asChild className="bg-gradient-brand text-brand-foreground">
            <Link to="/">
              <Home className="me-2 h-4 w-4" />
              {t("done.home")}
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function Tile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "destructive" | "muted";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        tone === "success" && "border-success/30 bg-success/10",
        tone === "destructive" && "border-destructive/30 bg-destructive/10",
        tone === "muted" && "border-border bg-muted",
      )}
    >
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
    </div>
  );
}
