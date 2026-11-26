import { QUESTION_SECONDS } from "@/lib/config";
import type { Question } from "@/types/game";
import { Countdown } from "./Countdown";
import { NumberSlider } from "./NumberSlider";

export function QuestionCard({ question, index, total, seconds, guess, onGuess, onLock, locked }: {
  question: Question; index: number; total: number; seconds: number; guess: number;
  onGuess: (value: number) => void; onLock: () => void; locked: boolean;
}) {
  return (
    <section className="game-panel">
      <div className="question-topline">
        <span className="eyebrow">QUESTION {index + 1} OF {total}</span>
        <Countdown seconds={seconds} total={QUESTION_SECONDS} />
      </div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
      <div className="question-copy">
        <span className="category-pill">{question.category}</span>
        <h1>{question.prompt}</h1>
        <p>Trust your gut. You have {QUESTION_SECONDS} seconds.</p>
      </div>
      <NumberSlider question={question} value={guess} onChange={onGuess} disabled={locked} />
      <button className="primary-button lock-button" onClick={onLock} disabled={locked}>Lock it in <span>→</span></button>
    </section>
  );
}
