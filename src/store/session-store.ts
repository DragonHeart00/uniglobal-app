import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Lang } from "@/i18n";
import type { Mode } from "./app-store";
import type { PreparedQuestion } from "@/lib/questions";

export interface AnswerRecord {
  n: number;
  selected: string | null;
  correct: boolean;
}

interface SessionState {
  active: boolean;
  lang: Lang | null;
  mode: Mode | null;
  folder: number | "all" | null;
  questions: PreparedQuestion[];
  index: number;
  answers: Record<number, AnswerRecord>;
  start: (args: { lang: Lang; mode: Mode; folder: number | "all"; questions: PreparedQuestion[] }) => void;
  setIndex: (i: number) => void;
  record: (n: number, selected: string | null, correct: boolean) => void;
  reset: () => void;
}

// Safe sessionStorage wrapper for SSR
const safeSessionStorage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return window.sessionStorage;
});

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      active: false,
      lang: null,
      mode: null,
      folder: null,
      questions: [],
      index: 0,
      answers: {},
      start: ({ lang, mode, folder, questions }) =>
        set({ active: true, lang, mode, folder, questions, index: 0, answers: {} }),
      setIndex: (i) => set({ index: i }),
      record: (n, selected, correct) =>
        set((s) => ({ answers: { ...s.answers, [n]: { n, selected, correct } } })),
      reset: () =>
        set({ active: false, questions: [], index: 0, answers: {}, mode: null, folder: null }),
    }),
    {
      name: "godkant.session",
      storage: safeSessionStorage,
    },
  ),
);
