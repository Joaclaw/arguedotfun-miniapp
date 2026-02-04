'use client';

import { useEffect, useState } from 'react';

function formatCountdown(endDateSeconds: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const end = Number(endDateSeconds);
  const diff = end - now;

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(' ');
}

export default function CountdownTimer({ endDate }: { endDate: bigint }) {
  const [display, setDisplay] = useState(() => formatCountdown(endDate));

  useEffect(() => {
    setDisplay(formatCountdown(endDate));
    const interval = setInterval(() => {
      setDisplay(formatCountdown(endDate));
    }, 60_000);
    return () => clearInterval(interval);
  }, [endDate]);

  const isEnded = display === 'Ended';

  return (
    <span
      className={`text-sm font-medium font-mono-nums ${
        isEnded ? 'text-zinc-500' : 'text-zinc-300'
      }`}
    >
      {isEnded ? 'Ended' : `⏱ ${display}`}
    </span>
  );
}
