import { formatNumber } from "@/lib/scoring";
import type { Question } from "@/types/game";

function toPosition(value: number, min: number, max: number, logarithmic: boolean) {
  if (logarithmic) return (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min));
  return (value - min) / (max - min);
}
function fromPosition(position: number, min: number, max: number, logarithmic: boolean) {
  if (logarithmic) return Math.exp(Math.log(min) + position * (Math.log(max) - Math.log(min)));
  return min + position * (max - min);
}

export function NumberSlider({ question, value, onChange, disabled }: {
  question: Question; value: number; onChange: (value: number) => void; disabled?: boolean;
}) {
  const logarithmic = question.type === "quantity";
  const position = toPosition(value, question.min, question.max, logarithmic);
  const display = question.type === "year" ? String(Math.round(value)) : formatNumber(value);
  const formatEndpoint = (v: number) => question.type === "year" ? String(Math.round(v)) : formatNumber(v);

  return (
    <div className="slider-wrap">
      <div className="guess-readout">
        <span className="eyebrow">YOUR GUESS</span>
        <div className="guess-value">{display}<span className="guess-unit"> {question.unit}</span></div>
      </div>
      <input
        className="guess-slider"
        type="range"
        min={0}
        max={1000}
        step={1}
        value={Math.round(position * 1000)}
        disabled={disabled}
        style={{ "--range-progress": `${position * 100}%` } as React.CSSProperties}
        onChange={(event) => {
          const next = fromPosition(Number(event.target.value) / 1000, question.min, question.max, logarithmic);
          onChange(question.type === "year" ? Math.round(next) : Number(next.toPrecision(6)));
        }}
        aria-label={`Guess in ${question.unit}`}
      />
      <div className="slider-ends"><span>{formatEndpoint(question.min)}</span><span>{formatEndpoint(question.max)}</span></div>
      <p className="slider-hint">{logarithmic ? "The scale moves by magnitude, not equal steps." : "Move along the timeline."}</p>
    </div>
  );
}
