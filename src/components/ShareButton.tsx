import { useState } from "react";
import { formatFold } from "@/lib/scoring";

export function ShareButton({ dayNumber, score, tiers, average }: {
  dayNumber: number; score: number; tiers: string; average: number;
}) {
  const [copied, setCopied] = useState(false);
  const shareText = `nailed...ish #${dayNumber}\n${tiers}\n${score}/500 · Avg ${formatFold(average)} off\nHow close can you get?`;
  async function share() {
    try {
      if (navigator.share) await navigator.share({ text: shareText });
      else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      try { await navigator.clipboard.writeText(shareText); setCopied(true); } catch { /* clipboard unavailable */ }
    }
  }
  return <button className="primary-button share-button" onClick={share}>{copied ? "Copied!" : "Share your result"} <span>↗</span></button>;
}
