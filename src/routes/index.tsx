import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Star,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { getDataset } from "@/lib/questions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [{ title: "GodKänt – Körkort B teoriprovet" }],
  }),
});

function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = useAppStore((s) => s.lang);
  const latest = useAppStore((s) => s.latestResult);
  const data = getDataset(lang);
  // Force re-render when lang changes
  void i18n.language;

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -start-16 bottom-0 h-56 w-56 rounded-full bg-brand-glow/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative max-w-2xl"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-gradient-brand">{t("home.title")}</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("home.subtitle")}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-brand text-brand-foreground hover:opacity-95">
              <Link to="/mode">
                {t("home.startCta")}
                <ArrowRight className="ms-2 h-4 w-4 rtl:hidden" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/mode" search={{ start: "exam" }}>
                {t("home.examCta")}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <dl className="mt-10 grid grid-cols-3 gap-4 sm:max-w-md">
            <Stat value={data.questions.length} label={t("home.stats.questions")} />
            <Stat value={data.folders} label={t("home.stats.files")} />
            <Stat value={data.perFolder} label={t("home.stats.perFile")} />
          </dl>
        </motion.div>
      </section>

      {/* Latest result */}
      {latest && latest.lang === lang ? (
        <section>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  {latest.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  {t("done.title")} · {t(`modes.${latest.mode}`)}
                </div>
                <p className="mt-2 text-3xl font-bold">
                  {latest.correct}
                  <span className="text-muted-foreground"> / {latest.total}</span>
                </p>
                <p
                  className={
                    "mt-1 text-sm font-semibold " +
                    (latest.passed ? "text-success" : "text-destructive")
                  }
                >
                  {t(latest.passed ? "done.passed" : "done.failed")}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/mode">{t("done.retry")}</Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* Mode cards */}
      <section>
        <h2 className="mb-5 text-xl font-semibold tracking-tight">{t("modes.title")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ModeCard
            to="/files"
            search={{ mode: "study" }}
            icon={<BookOpen />}
            title={t("modes.study")}
            desc={t("modes.studyDesc")}
          />
          <ModeCard
            to="/files"
            search={{ mode: "test" }}
            icon={<ClipboardCheck />}
            title={t("modes.test")}
            desc={t("modes.testDesc")}
          />
          <ModeCard
            to="/mode"
            search={{ start: "exam" }}
            icon={<GraduationCap />}
            title={t("modes.exam")}
            desc={t("modes.examDesc")}
          />
          <ModeCard
            to="/favorites"
            icon={<Star />}
            title={t("modes.favorite")}
            desc={t("modes.favoriteDesc")}
          />
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-2xl font-bold tabular-nums">{value.toLocaleString()}</dd>
    </div>
  );
}

function ModeCard({
  to,
  search,
  icon,
  title,
  desc,
}: {
  to: string;
  search?: Record<string, string>;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      search={search as never}
      className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-gradient-brand group-hover:text-brand-foreground">
        <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </Link>
  );
}
