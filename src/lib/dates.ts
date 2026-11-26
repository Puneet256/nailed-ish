import { LAUNCH_DATE } from "./config";

export function localDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDayNumber(date = new Date()): number {
  const start = new Date(`${LAUNCH_DATE}T00:00:00`);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return Math.max(1, diff + 1);
}

export function getDailySet<T>(sets: T[][], dayNumber: number): T[] {
  return sets[(dayNumber - 1) % sets.length] ?? sets[0] ?? [];
}
