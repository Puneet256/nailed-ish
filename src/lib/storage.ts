import type { SavedGame, StreakData } from "@/types/game";

const GAME_KEY = "nailedish-game-v1";
const STREAK_KEY = "nailedish-streak-v1";

export function readGame(): SavedGame | null {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    return raw ? (JSON.parse(raw) as SavedGame) : null;
  } catch { return null; }
}

export function writeGame(game: SavedGame): void {
  try { localStorage.setItem(GAME_KEY, JSON.stringify(game)); } catch { /* storage may be unavailable */ }
}

export function clearGame(): void {
  try { localStorage.removeItem(GAME_KEY); } catch { /* storage may be unavailable */ }
}

export function clearStreak(): void {
  try { localStorage.removeItem(STREAK_KEY); } catch { /* storage may be unavailable */ }
}

export function clearAll(): void {
  clearGame();
  clearStreak();
}

export function readStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? (JSON.parse(raw) as StreakData) : { current: 0, lastPlayedDate: null };
  } catch { return { current: 0, lastPlayedDate: null }; }
}

export function writeStreak(streak: StreakData): void {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(streak)); } catch { /* storage may be unavailable */ }
}
