"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GameHeader } from "@/components/GameHeader";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerReveal } from "@/components/AnswerReveal";
import { ResultsScreen } from "@/components/ResultsScreen";
import { questionSets } from "@/data/questions";
import { getDailySet, getDayNumber, localDateKey } from "@/lib/dates";
import { QUESTION_SECONDS } from "@/lib/config";
import { scoreGuess } from "@/lib/scoring";
import { readGame, readStreak, writeGame, writeStreak } from "@/lib/storage";
import type { GuessResult, SavedGame } from "@/types/game";

type Screen = "intro" | "question" | "reveal" | "results";

export default function Home() {
  const today = useMemo(() => localDateKey(), []);
  const dayNumber = useMemo(() => getDayNumber(), []);
  const questions = useMemo(() => getDailySet(questionSets, dayNumber), [dayNumber]);
  const [screen, setScreen] = useState<Screen>("intro");
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState(questions[0]?.type === "year" ? 2000 : Math.sqrt((questions[0]?.min ?? 1) * (questions[0]?.max ?? 100)));
  const [seconds, setSeconds] = useState(QUESTION_SECONDS);
  const [results, setResults] = useState<GuessResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const currentQuestion = questions[index];

  useEffect(() => {
    const saved = readGame();
    const savedStreak = readStreak();
    setStreak(savedStreak.current);
    if (saved?.date === today && saved.dayNumber === dayNumber) {
      setResults(saved.guesses);
      if (saved.completed) setScreen("results");
      else if (saved.guesses.length > 0) {
        setIndex(saved.guesses.length);
        setScreen("question");
      }
    }
    setHydrated(true);
  }, [today, dayNumber]);

  const persist = useCallback((nextResults: GuessResult[], completed = false) => {
    const game: SavedGame = { dayNumber, date: today, guesses: nextResults, completed };
    writeGame(game);
  }, [dayNumber, today]);

  const start = () => {
    if (results.length >= questions.length) { setScreen("results"); return; }
    setIndex(results.length);
    const q = questions[results.length];
    setGuess(q.type === "year" ? Math.round((q.min + q.max) / 2) : Math.sqrt(q.min * q.max));
    setSeconds(QUESTION_SECONDS);
    setScreen("question");
  };

  const lockAnswer = useCallback(() => {
    if (screen !== "question" || !currentQuestion) return;
    const result = scoreGuess(currentQuestion, guess);
    const next = [...results.slice(0, index), result];
    setResults(next);
    persist(next);
    setScreen("reveal");
  }, [screen, currentQuestion, guess, results, index, persist]);

  useEffect(() => {
    if (screen !== "question") return;
    if (seconds <= 0) { lockAnswer(); return; }
    const timer = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [screen, seconds, lockAnswer]);

  const nextQuestion = () => {
    if (index === questions.length - 1) {
      const savedStreak = readStreak();
      const previous = savedStreak.lastPlayedDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = localDateKey(yesterday);
      const nextStreak = previous === today ? savedStreak.current : previous === yesterdayKey ? savedStreak.current + 1 : 1;
      writeStreak({ current: nextStreak, lastPlayedDate: today });
      setStreak(nextStreak);
      persist(results, true);
      setScreen("results");
    } else {
      const nextIndex = index + 1;
      const q = questions[nextIndex];
      setIndex(nextIndex);
      setGuess(q.type === "year" ? Math.round((q.min + q.max) / 2) : Math.sqrt(q.min * q.max));
      setSeconds(QUESTION_SECONDS);
      setScreen("question");
    }
  };

  if (!hydrated || !currentQuestion) {
    return <main className="page-shell"><div className="loading-card">Getting today's guesses ready...</div></main>;
  }

  return (
    <main className="page-shell">
      <GameHeader dayNumber={dayNumber} streak={streak} />
      <div className="main-content">
        {screen === "intro" && (
          <section className="game-panel intro-panel">
            <span className="eyebrow">THE DAILY ESTIMATION GAME</span>
            <div className="intro-mark">≈</div>
            <h1>nailed<span>...</span>ish</h1>
            <p className="tagline">How close can you get?</p>
            <div className="intro-details"><span>5 QUESTIONS</span><i>·</i><span>DAILY</span><i>·</i><span>25 SECONDS EACH</span></div>
            <button className="primary-button" onClick={start}>Play today's game <span>→</span></button>
            <p className="intro-footnote">No sign-up. No pressure. Just a good guess.</p>
          </section>
        )}
        {screen === "question" && currentQuestion && (
          <QuestionCard question={currentQuestion} index={index} total={questions.length} seconds={seconds} guess={guess} onGuess={setGuess} onLock={lockAnswer} locked={false} />
        )}
        {screen === "reveal" && currentQuestion && results[index] && (
          <AnswerReveal question={currentQuestion} result={results[index]} onNext={nextQuestion} isLast={index === questions.length - 1} />
        )}
        {screen === "results" && <ResultsScreen dayNumber={dayNumber} questions={questions} results={results} streak={streak} />}
      </div>
      <footer className="site-footer"><span>nailed...ish</span><span>Five questions. Daily. How close can you get?</span></footer>
    </main>
  );
}
