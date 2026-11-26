import type { Question, GuessResult } from "@/types/game";
import { getAverageFoldError, getDailyScore, formatFold } from "@/lib/scoring";
import { ShareButton } from "./ShareButton";

export function ResultsScreen({ dayNumber, questions, results, streak }: {
  dayNumber: number; questions: Question[]; results: GuessResult[]; streak: number;
}) {
  const score = getDailyScore(results);
  const average = getAverageFoldError(results);
  const tiers = results.map((r) => r.tier).join("");
  return (
    <section className="game-panel results-panel">
      <span className="eyebrow">DAY {String(dayNumber).padStart(2, "0")} COMPLETE</span>
      <div className="results-emoji">✳</div>
      <h1>That's today's five.</h1>
      <p className="results-subtitle">You got {score} out of 500 points.</p>
      <div className="big-score">{score}<span>/500</span></div>
      <div className="result-tiers" aria-label={`Accuracy tiers: ${tiers}`}>{tiers.split("").map((tier, i) => <span key={i}>{tier}</span>)}</div>
      <div className="results-stats">
        <div><strong>{formatFold(average)}</strong><span>average fold-error</span></div>
        <div><strong>🔥 {streak}</strong><span>day streak</span></div>
      </div>
      <div className="result-list">
        {questions.map((question, i) => (
          <div className="result-row" key={question.id}>
            <span className="result-index">0{i + 1}</span>
            <span className="result-question">{question.prompt}</span>
            <strong>{results[i]?.tier} {results[i]?.score}</strong>
          </div>
        ))}
      </div>
      <ShareButton dayNumber={dayNumber} score={score} tiers={tiers} average={average} />
      <p className="come-back">Same time tomorrow?</p>
    </section>
  );
}
