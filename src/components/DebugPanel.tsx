"use client";

import { useCallback, useEffect, useState } from "react";
import { questionSets } from "@/data/questions";
import { QUESTION_SECONDS } from "@/lib/config";
import { getDailySet, getDayNumber, localDateKey } from "@/lib/dates";
import { defaultGuess, scoreGuess } from "@/lib/scoring";
import { clearAll, clearGame, clearStreak, readGame, readStreak, writeGame } from "@/lib/storage";
import type { GuessResult, SavedGame } from "@/types/game";

function todayQuestions() {
  return getDailySet(questionSets, getDayNumber());
}

function currentGame(): SavedGame | null {
  const game = readGame();
  const dayNumber = getDayNumber();
  return game && game.date === localDateKey() && game.dayNumber === dayNumber ? game : null;
}

export function DebugPanel({ paused, canPause, onTogglePause }: {
  paused: boolean; canPause: boolean; onTogglePause: () => void;
}) {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snapshot, setSnapshot] = useState<{ game: SavedGame | null; streak: number }>({
    game: null,
    streak: 0,
  });

  const refresh = useCallback(() => {
    setSnapshot({ game: currentGame(), streak: readStreak().current });
  }, []);

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("debug") === "1";
    setEnabled(process.env.NODE_ENV === "development" || forced);
  }, []);

  useEffect(() => {
    if (!open) return;
    refresh();
    const timer = window.setInterval(refresh, 500);
    return () => window.clearInterval(timer);
  }, [open, refresh]);

  if (!enabled) return null;

  const reload = () => window.location.reload();
  const game = snapshot.game;
  const canSetTimer = !!game && !game.completed;
  const remaining = game?.paused
    ? game.remaining ?? 0
    : game?.deadline
      ? Math.max(0, Math.ceil((game.deadline - Date.now()) / 1000))
      : null;

  const resetGame = () => { clearGame(); reload(); };
  const resetStreak = () => { clearStreak(); reload(); };
  const resetAll = () => { clearAll(); reload(); };

  const setRemaining = (seconds: number) => {
    const active = currentGame();
    if (!active || active.completed) return;
    const activeIndex = active.activeIndex ?? active.guesses.length;
    writeGame({ ...active, activeIndex, deadline: Date.now() + seconds * 1000, paused: false, remaining: undefined });
    reload();
  };

  const skipQuestion = () => {
    const questions = todayQuestions();
    const active = currentGame();
    const activeIndex = active?.activeIndex ?? active?.guesses.length ?? 0;
    const question = questions[activeIndex];
    if (!question) return;
    const guesses: GuessResult[] = [...(active?.guesses ?? [])].slice(0, activeIndex);
    guesses.push(scoreGuess(question, defaultGuess(question)));
    const completed = guesses.length >= questions.length;
    writeGame({
      dayNumber: getDayNumber(),
      date: localDateKey(),
      guesses,
      completed,
      ...(completed ? {} : { activeIndex: guesses.length, deadline: Date.now() + QUESTION_SECONDS * 1000 }),
    });
    reload();
  };

  const finishGame = () => {
    const questions = todayQuestions();
    const active = currentGame();
    const guesses: GuessResult[] = [...(active?.guesses ?? [])].slice(0, questions.length);
    for (let i = guesses.length; i < questions.length; i += 1) {
      guesses.push(scoreGuess(questions[i], defaultGuess(questions[i])));
    }
    writeGame({ dayNumber: getDayNumber(), date: localDateKey(), guesses, completed: true });
    reload();
  };

  const copyState = async () => {
    const payload = JSON.stringify(
      { game: readGame(), streak: readStreak(), copiedAt: new Date().toISOString() },
      null,
      2,
    );
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard may be unavailable */ }
  };

  if (!open) {
    return (
      <button className="debug-toggle" onClick={() => setOpen(true)} aria-label="Open debug panel" title="Debug">
        🐞
      </button>
    );
  }

  return (
    <aside className="debug-panel">
      <div className="debug-head">
        <strong>Debug</strong>
        <button onClick={() => setOpen(false)} aria-label="Close debug panel">×</button>
      </div>
      <div className="debug-state">
        <span>day <b>{getDayNumber()}</b></span>
        <span>guesses <b>{game?.guesses.length ?? 0}</b></span>
        <span>active <b>{game?.activeIndex ?? "—"}</b></span>
        <span>left <b>{remaining ?? "—"}</b></span>
        <span>streak <b>{snapshot.streak}</b></span>
        <span>status <b>{game?.completed ? "done" : game ? game.paused ? "paused" : "playing" : "new"}</b></span>
      </div>
      <div className="debug-actions">
        <button className="debug-wide" onClick={onTogglePause} disabled={!canPause}>
          {paused ? "▶ Resume timer" : "❚❚ Pause timer"}
        </button>
        <button onClick={resetGame}>Reset game</button>
        <button onClick={resetStreak}>Reset streak</button>
        <button onClick={resetAll}>Reset all</button>
        <button onClick={copyState}>{copied ? "Copied!" : "Copy state"}</button>
        <button onClick={() => setRemaining(10)} disabled={!canSetTimer}>10s left</button>
        <button onClick={() => setRemaining(5)} disabled={!canSetTimer}>5s left</button>
        <button onClick={() => setRemaining(2)} disabled={!canSetTimer}>2s left</button>
        <button onClick={skipQuestion}>Skip question</button>
        <button onClick={finishGame}>Finish game</button>
        <button onClick={reload}>Reload</button>
      </div>
    </aside>
  );
}
