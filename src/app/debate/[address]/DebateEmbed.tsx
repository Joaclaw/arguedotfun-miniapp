'use client';

import { useDebateInfo, useDebateStatus } from '@/hooks/useDebate';
import { DebateStatus } from '@/lib/types';
import { formatUSDC, calcPercentage } from '@/lib/utils';
import BetForm from '@/components/BetForm';
import ClaimButton from '@/components/ClaimButton';
import CountdownTimer from '@/components/CountdownTimer';
import StatusBadge from '@/components/StatusBadge';

interface DebateEmbedProps {
  address: `0x${string}`;
}

export default function DebateEmbed({ address }: DebateEmbedProps) {
  const { data: info, isLoading } = useDebateInfo(address);
  const { data: statusRaw } = useDebateStatus(address);

  const status = statusRaw as DebateStatus | undefined;

  if (isLoading || !info) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin"
            style={{ color: 'var(--platinum-light)' }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm" style={{ color: 'var(--platinum-medium)' }}>Loading debate…</span>
        </div>
      </div>
    );
  }

  // Destructure the getInfo tuple
  const tuple = info as readonly unknown[];
  const statement = tuple[1] as string;
  const description = tuple[2] as string;
  const sideAName = tuple[3] as string;
  const sideBName = tuple[4] as string;
  const endDate = tuple[6] as bigint;
  const isResolved = tuple[7] as boolean;
  const isSideAWinner = tuple[8] as boolean;
  const totalSideA = tuple[9] as bigint;
  const totalSideB = tuple[10] as bigint;
  const winnerReasoning = tuple[11] as string;
  const totalBounty = tuple[14] as bigint;

  const totalPool = totalSideA + totalSideB + totalBounty;
  const { pctA, pctB } = calcPercentage(totalSideA, totalSideB);

  const winningSide = isSideAWinner ? sideAName : sideBName;

  return (
    <div className="mx-auto max-w-md px-4 py-5 animate-fade-in">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <a
          href="https://argue.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold"
          style={{ color: 'var(--side-a)' }}
        >
          argue<span style={{ color: 'var(--platinum-medium)' }}>.fun</span>
        </a>
        {status !== undefined && <StatusBadge status={status} />}
      </div>

      {/* Debate question */}
      <h1 className="mb-2 text-xl font-bold leading-tight text-white">
        {statement}
      </h1>
      {description && (
        <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--platinum-medium)' }}>
          {description.length > 150
            ? description.slice(0, 147) + '…'
            : description}
        </p>
      )}

      {/* Odds bar */}
      <div className="mb-3 overflow-hidden rounded-xl glass-card" style={{ padding: 0, borderRadius: '12px' }}>
        <div className="flex h-12 gap-[2px]">
          <div
            className="odds-side-a flex items-center justify-center px-3 transition-all"
            style={{ flex: Math.max(pctA, 8) }}
          >
            <span className="truncate text-xs font-semibold text-white">
              {sideAName} {pctA}%
            </span>
          </div>
          <div
            className="odds-side-b flex items-center justify-center px-3 transition-all"
            style={{ flex: Math.max(pctB, 8) }}
          >
            <span className="truncate text-xs font-semibold text-white">
              {sideBName} {pctB}%
            </span>
          </div>
        </div>
      </div>

      {/* Pool + countdown */}
      <div className="mb-5 flex items-center justify-between text-sm">
        <span className="font-mono-nums" style={{ color: 'var(--platinum-medium)' }}>
          💰 {formatUSDC(totalPool)} USDC pool
        </span>
        {!isResolved && <CountdownTimer endDate={endDate} />}
      </div>

      {/* Resolved: show winner */}
      {status === DebateStatus.RESOLVED && (
        <div className="glass-card mb-4 p-4" style={{ borderColor: 'oklch(0.7 0.15 142 / 0.3)' }}>
          <div className="mb-1 text-center text-sm font-semibold" style={{ color: 'oklch(0.7 0.15 142)' }}>
            🏆 Winner: {winningSide}
          </div>
          {winnerReasoning && (
            <p className="text-center text-xs leading-relaxed" style={{ color: 'var(--platinum-medium)' }}>
              {winnerReasoning.length > 200
                ? winnerReasoning.slice(0, 197) + '…'
                : winnerReasoning}
            </p>
          )}
        </div>
      )}

      {/* Undetermined */}
      {status === DebateStatus.UNDETERMINED && (
        <div className="glass-card mb-4 p-4 text-center text-sm" style={{ color: 'var(--platinum-medium)' }}>
          Debate ended without a winner. Bets are refundable.
        </div>
      )}

      {/* Action area */}
      {status === DebateStatus.ACTIVE && (
        <BetForm
          debateAddress={address}
          sideAName={sideAName}
          sideBName={sideBName}
        />
      )}

      {(status === DebateStatus.RESOLVED ||
        status === DebateStatus.UNDETERMINED) && (
        <ClaimButton debateAddress={address} />
      )}

      {status === DebateStatus.RESOLVING && (
        <div className="glass-card p-4 text-center text-sm" style={{ borderColor: 'oklch(0.7 0.15 285 / 0.3)', color: 'oklch(0.7 0.15 285)' }}>
          ⏳ AI is judging arguments…
        </div>
      )}

      {/* Footer link */}
      <div className="mt-5 text-center">
        <a
          href={`https://argue.fun/debate/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline underline-offset-2 transition-colors hover:text-zinc-300"
          style={{ color: 'var(--platinum-medium)', textDecorationColor: 'var(--platinum-dark)' }}
        >
          View full debate on argue.fun →
        </a>
      </div>
    </div>
  );
}
