import arData from "@/data/questions.ar.json";
import svData from "@/data/questions.sv.json";
import type { Lang } from "@/i18n";

export interface RawQuestion {
  n: number;
  id: string;
  folder: number;
  question: string;
  answers: string[];
  correct: string;
  sortable: boolean;
  image1?: string;
  image2?: string;
}

interface DataSet {
  folders: number;
  perFolder: number;
  questions: RawQuestion[];
}

const DATA: Record<Lang, DataSet> = {
  ar: arData as DataSet,
  sv: svData as DataSet,
};

export function getDataset(lang: Lang): DataSet {
  return DATA[lang];
}

export function getQuestionsByFolder(lang: Lang, folder: number): RawQuestion[] {
  return DATA[lang].questions.filter((q) => q.folder === folder);
}

export function getAllQuestions(lang: Lang): RawQuestion[] {
  return DATA[lang].questions;
}

export function getQuestionsByNumbers(lang: Lang, nums: number[]): RawQuestion[] {
  const set = new Set(nums);
  return DATA[lang].questions.filter((q) => set.has(q.n));
}

// Fisher–Yates
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const EXAM_SIZE = 70;
export const EXAM_PASS = 52; // Swedish Trafikverket threshold

export function buildExam(lang: Lang): RawQuestion[] {
  return shuffle(getAllQuestions(lang)).slice(0, EXAM_SIZE);
}

export interface PreparedQuestion extends RawQuestion {
  presented: string[]; // displayed answer order
}

/** Apply sortable shuffling to answers; for study/test we keep order if !sortable. */
export function prepareQuestions(qs: RawQuestion[], shuffleAnswers = true): PreparedQuestion[] {
  return qs.map((q) => {
    const presented = shuffleAnswers && q.sortable ? shuffle(q.answers) : q.answers;
    return { ...q, presented };
  });
}
