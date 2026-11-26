import type { AccuracyTier, Question, GuessResult } from "@/types/game";

export function getError(question: Question, guess: number): number {
  if (question.type === "quantity") {
    return Math.abs(Math.log10(guess / question.answer));
  }
  const scale = question.scale ?? 10;
  return Math.log10(1 + Math.abs(guess - question.answer) / scale);
}

export function getTier(foldError: number): AccuracyTier {
  if (foldError <= 1.05) return "🎯";
  if (foldError <= 1.25) return "🟢";
  if (foldError <= 2) return "🟡";
  if (foldError <= 10) return "🟠";
  return "🔴";
}

export function scoreGuess(question: Question, guess: number): GuessResult {
  const error = getError(question, guess);
  const foldError = Math.pow(10, error);
  const score = Math.round(100 * Math.max(0, 1 - error / 1.5));
  return { questionId: question.id, guess, score, error, foldError, tier: getTier(foldError) };
}

export function getDailyScore(results: GuessResult[]): number {
  return results.reduce((sum, result) => sum + result.score, 0);
}

export function getAverageFoldError(results: GuessResult[]): number {
  if (!results.length) return 0;
  const meanError = results.reduce((sum, result) => sum + result.error, 0) / results.length;
  return Math.pow(10, meanError);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

export function formatFold(value: number): string {
  return `${value.toFixed(2)}×`;
}
