'use client';

import { formatAddress, formatUSDC, getRelativeTime } from '@/lib/utils';

interface ArgumentListProps {
  contents: readonly string[];
  amounts: readonly bigint[];
  authors: readonly `0x${string}`[];
  timestamps: readonly bigint[];
  sideName: string;
  accentColor: 'emerald' | 'violet';
}

const ACCENT_CLASSES = {
  emerald: 'border-l-emerald-500',
  violet: 'border-l-violet-500',
};

export default function ArgumentList({
  contents,
  amounts,
  authors,
  timestamps,
  sideName,
  accentColor,
}: ArgumentListProps) {
  if (!contents || contents.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-zinc-500">
        No arguments for {sideName} yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contents.map((content, i) => (
        <div
          key={`${authors[i]}-${timestamps[i]}-${i}`}
          className={`rounded-lg border-l-2 bg-zinc-900/50 p-3 ${ACCENT_CLASSES[accentColor]}`}
        >
          <div className="mb-1.5 flex items-center justify-between text-xs text-zinc-500">
            <span className="font-mono">{formatAddress(authors[i])}</span>
            <span>{getRelativeTime(timestamps[i])}</span>
          </div>
          {content && (
            <p className="mb-1.5 text-sm leading-relaxed text-zinc-300">{content}</p>
          )}
          <div className="text-xs font-medium text-zinc-400">
            ${formatUSDC(amounts[i])} USDC
          </div>
        </div>
      ))}
    </div>
  );
}
