export function Countdown({ seconds }: { seconds: number }) {
  const urgent = seconds <= 5;
  return (
    <div className={`timer ${urgent ? "timer-urgent" : ""}`} aria-live="off">
      <span className="timer-dot" /> {`00:${String(seconds).padStart(2, "0")}`}
    </div>
  );
}
