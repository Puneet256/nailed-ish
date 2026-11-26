import type { Question, GuessResult } from "@/types/game";
import { formatFold, formatNumber } from "@/lib/scoring";

export function AnswerReveal({ question, result, onNext, isLast }: {
  question: Question; result: GuessResult; onNext: () => void; isLast: boolean;
}) {
  const difference = Math.abs(result.guess - question.answer);
  const direction = result.guess > question.answer ? "too high" : result.guess < question.answer ? "too low" : "exactly right";
  return (
    <section className="game-panel reveal-panel">
      <span className="eyebrow">THE REVEAL</span>
      <div className="reveal-tier">{result.tier}</div>
      <h1>{result.score === 100 ? "Nailed it!" : result.foldError <= 2 ? "Pretty close." : "Well... ish."}</h1>
      <div className="answer-comparison">
        <div><span className="eyebrow">YOUR GUESS</span><strong>{formatNumber(result.guess)} <small>{question.unit}</small></strong></div>
        <div><span className="eyebrow">THE ANSWER</span><strong>{formatNumber(question.answer)} <small>{question.unit}</small></strong></div>
      </div>
      <div className="score-strip">
        <div><span className="eyebrow">QUESTION SCORE</span><strong>{result.score}<small>/100</small></strong></div>
        <div><span className="eyebrow">ACCURACY</span><strong>{question.type === "year" ? `${formatNumber(difference)} years ${direction}` : formatFold(result.foldError) + " off"}</strong></div>
      </div>
      <p className="fun-fact">{question.fact}</p>
      <a className="source-link" href={question.source.url} target="_blank" rel="noreferrer">Source: {question.source.name} ↗</a>
      <button className="primary-button" onClick={onNext}>{isLast ? "See my results" : "Next question"} <span>→</span></button>
    </section>
  );
}
