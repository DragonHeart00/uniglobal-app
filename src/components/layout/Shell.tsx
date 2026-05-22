import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Moon, Sun, Monitor, Languages, BookOpenCheck } from "lucide-react";
import { useAppStore, applyTheme, type Theme } from "@/store/app-store";
import { applyDirection, LANG_META, type Lang } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Shell({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const lang = useAppStore((s) => s.lang);
  const theme = useAppStore((s) => s.theme);
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);

  // Sync language + direction
  useEffect(() => {
    if (i18n.language !== lang) void i18n.changeLanguage(lang);
    applyDirection(lang);
  }, [lang, i18n]);

  // Sync theme
  useEffect(() => {
    applyTheme(theme);
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-soft transition-transform group-hover:scale-105">
              <BookOpenCheck className="h-5 w-5 text-brand-foreground" />
            </span>
            <span className="text-lg font-bold tracking-tight">{t("app.name")}</span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            <NavLink to="/">{t("nav.home")}</NavLink>
            <NavLink to="/favorites">{t("nav.favorites")}</NavLink>
            <NavLink to="/about">{t("nav.about")}</NavLink>
          </nav>

          <div className="flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t("common.language")}>
                  <Languages className="h-[1.1rem] w-[1.1rem]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(LANG_META) as Lang[]).map((code) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setLang(code)}
                    className={lang === code ? "font-semibold" : ""}
                  >
                    <span className="me-2">{LANG_META[code].flag}</span>
                    {LANG_META[code].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t("common.theme")}>
                  {theme === "dark" ? (
                    <Moon className="h-[1.1rem] w-[1.1rem]" />
                  ) : theme === "light" ? (
                    <Sun className="h-[1.1rem] w-[1.1rem]" />
                  ) : (
                    <Monitor className="h-[1.1rem] w-[1.1rem]" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(["light", "dark", "system"] as Theme[]).map((mode) => (
                  <DropdownMenuItem
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className={theme === mode ? "font-semibold" : ""}
                  >
                    {mode === "light" && <Sun className="me-2 h-4 w-4" />}
                    {mode === "dark" && <Moon className="me-2 h-4 w-4" />}
                    {mode === "system" && <Monitor className="me-2 h-4 w-4" />}
                    {t(`common.theme${mode[0].toUpperCase() + mode.slice(1)}` as never)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <nav className="flex border-t border-border/60 bg-background/80 md:hidden">
          <MobileNavLink to="/">{t("nav.home")}</MobileNavLink>
          <MobileNavLink to="/favorites">{t("nav.favorites")}</MobileNavLink>
          <MobileNavLink to="/about">{t("nav.about")}</MobileNavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("app.name")} · {t("app.tagline")}
      </footer>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      activeProps={{ className: "bg-accent text-accent-foreground" }}
      activeOptions={{ exact: true }}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex-1 py-2.5 text-center text-sm font-medium text-muted-foreground transition-colors"
      activeProps={{ className: "text-foreground" }}
      activeOptions={{ exact: true }}
    >
      {children}
    </Link>
  );
}
