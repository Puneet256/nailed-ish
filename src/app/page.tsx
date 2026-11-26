"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameHeader } from "@/components/GameHeader";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerReveal } from "@/components/AnswerReveal";
import { DebugPanel } from "@/components/DebugPanel";
import { ResultsScreen } from "@/components/ResultsScreen";
import { questionSets } from "@/data/questions";
import { getDailySet, getDayNumber, localDateKey } from "@/lib/dates";
import { QUESTION_SECONDS } from "@/lib/config";
import { defaultGuess, scoreGuess } from "@/lib/scoring";
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
  const deadlineRef = useRef(0);

  const persist = useCallback((nextResults: GuessResult[], completed = false, active?: { index: number; deadline: number } | null) => {
    const game: SavedGame = {
      dayNumber,
      date: today,
      guesses: nextResults,
      completed,
      ...(active ? { activeIndex: active.index, deadline: active.deadline } : {}),
    };
    writeGame(game);
  }, [dayNumber, today]);

  const startTimer = useCallback((questionIndex: number, nextResults: GuessResult[]) => {
    const deadline = Date.now() + QUESTION_SECONDS * 1000;
    deadlineRef.current = deadline;
    setSeconds(QUESTION_SECONDS);
    persist(nextResults, false, { index: questionIndex, deadline });
  }, [persist]);

  useEffect(() => {
    const saved = readGame();
    const savedStreak = readStreak();
    setStreak(savedStreak.current);
    if (saved?.date !== today || saved.dayNumber !== dayNumber) {
      setHydrated(true);
      return;
    }
    setResults(saved.guesses);
    if (saved.completed) {
      setScreen("results");
    } else if (
      typeof saved.deadline === "number" &&
      saved.activeIndex === saved.guesses.length &&
      questions[saved.activeIndex]
    ) {
      // Resume the question that was in progress, keeping the elapsed time.
      const questionIndex = saved.activeIndex;
      setIndex(questionIndex);
      setGuess(defaultGuess(questions[questionIndex]));
      const remaining = Math.ceil((saved.deadline - Date.now()) / 1000);
      if (remaining > 0) {
        deadlineRef.current = saved.deadline;
        setSeconds(remaining);
        setScreen("question");
      } else {
        // Time ran out while away; start fresh instead of auto-locking a
        // guess the player never actually set.
        startTimer(questionIndex, saved.guesses);
        setScreen("question");
      }
    } else if (saved.guesses.length > 0) {
      const questionIndex = saved.guesses.length;
      if (questions[questionIndex]) {
        setIndex(questionIndex);
        setGuess(defaultGuess(questions[questionIndex]));
        startTimer(questionIndex, saved.guesses);
        setScreen("question");
      } else {
        setScreen("results");
      }
    }
    setHydrated(true);
  }, [today, dayNumber, questions, startTimer]);

  const start = () => {
    if (results.length >= questions.length) { setScreen("results"); return; }
    const nextIndex = results.length;
    setIndex(nextIndex);
    setGuess(defaultGuess(questions[nextIndex]));
    startTimer(nextIndex, results);
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

  const lockAnswerRef = useRef(lockAnswer);
  useEffect(() => { lockAnswerRef.current = lockAnswer; }, [lockAnswer]);

  useEffect(() => {
    if (screen !== "question") return;
    let fired = false;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining <= 0 && !fired) {
        fired = true;
        lockAnswerRef.current();
      }
    };
    tick();
    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [screen, index]);

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
      setIndex(nextIndex);
      setGuess(defaultGuess(questions[nextIndex]));
      startTimer(nextIndex, results);
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
            <div className="intro-mark"><span className="intro-mark-symbol">≈</span></div>
            <h1>nailed<span>...</span>ish</h1>
            <p className="tagline">How close can you get?</p>
            <div className="intro-details"><span>5 QUESTIONS</span><i>·</i><span>DAILY</span><i>·</i><span>20 SECONDS EACH</span></div>
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
      <DebugPanel />
    </main>
  );
}
