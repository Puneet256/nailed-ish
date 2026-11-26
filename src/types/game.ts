export type QuestionType = "quantity" | "year";

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  unit: string;
  min: number;
  max: number;
  answer: number;
  fact: string;
  source: { name: string; url: string };
  category: string;
  scale?: number;
  step?: number;
}

export interface GuessResult {
  questionId: string;
  guess: number;
  score: number;
  error: number;
  foldError: number;
  tier: AccuracyTier;
}

export type AccuracyTier = "🎯" | "🟢" | "🟡" | "🟠" | "🔴";

export interface SavedGame {
  dayNumber: number;
  date: string;
  guesses: GuessResult[];
  completed: boolean;
  /** Index of the question currently being played, if any. */
  activeIndex?: number;
  /** Absolute timestamp (ms) when the active question's timer expires. */
  deadline?: number;
}

export interface StreakData {
  current: number;
  lastPlayedDate: string | null;
}
