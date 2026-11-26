export function GameHeader({ dayNumber, streak }: { dayNumber: number; streak: number }) {
  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="nailed...ish home">nailed<span>...</span>ish</a>
      <div className="header-meta">
        <span className="day-label">DAY {String(dayNumber).padStart(2, "0")}</span>
        {streak > 0 && <span className="streak">🔥 {streak}</span>}
      </div>
    </header>
  );
}
