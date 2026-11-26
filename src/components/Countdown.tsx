import { QUESTION_SECONDS } from "@/lib/config";

export function Countdown({ seconds, total = QUESTION_SECONDS }: { seconds: number; total?: number }) {
  const urgent = seconds <= 5;
  const progress = total > 0 ? Math.max(0, Math.min(1, seconds / total)) : 0;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className={`timer ${urgent ? "timer-urgent" : ""}`} role="timer" aria-label={`${seconds} seconds remaining`}>
      <svg className="timer-ring" viewBox="0 0 56 56" aria-hidden="true">
        <circle className="timer-ring-track" cx="28" cy="28" r={radius} />
        <circle
          className="timer-ring-fill"
          cx="28"
          cy="28"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="timer-center">
        <span className="timer-value">{seconds}</span>
        <span className="timer-unit">SEC</span>
      </span>
    </div>
  );
}
