import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </motion.div>
  );
}
