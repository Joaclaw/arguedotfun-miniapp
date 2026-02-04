'use client';

import {
  useDebateInfo,
  useDebateStatus,
  useArgumentDataSideA,
  useArgumentDataSideB,
} from '@/hooks/useDebate';
import { formatUSDC, calcPercentage, formatTimestamp, calculatePayout } from '@/lib/utils';
import { DebateStatus } from '@/lib/types';
import StatusBadge from './StatusBadge';
import CountdownTimer from './CountdownTimer';
import ArgumentList from './ArgumentList';

interface DebateDetailProps {
  address: `0x${string}`;
}

export default function DebateDetail({ address }: DebateDetailProps) {
  const { data: info, isLoading: infoLoading, error: infoError, refetch: refetchInfo } = useDebateInfo(address);
  const { data: statusRaw } = useDebateStatus(address);
  const { data: argsA, isLoading: argsALoading } = useArgumentDataSideA(address);
  const { data: argsB, isLoading: argsBLoading } = useArgumentDataSideB(address);

  if (infoLoading) {
    return (
      <div className="animate-pulse space-y-4 p-4">
        <div className="h-6 w-3/4 rounded bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-800" />
        <div className="h-4 w-2/3 rounded bg-zinc-800" />
        <div className="h-40 rounded-xl bg-zinc-800" />
      </div>
    );
  }

  if (infoError) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center">
        <p className="mb-3 text-sm text-red-400">Failed to load debate details.</p>
        <button
          onClick={() => refetchInfo()}
          className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-900/50 active:bg-red-800/50"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="p-4 text-center text-sm text-zinc-500">
        Debate not found
      </div>
    );
  }

  const [
    creator,
    debateStatement,
    description,
    sideAName,
    sideBName,
    creationDate,
    endDate,
    isResolved,
    isSideAWinner,
    totalSideA,
    totalSideB,
    winnerReasoning,
    ,, // totalContentBytes, maxTotalContentBytes
    totalBounty,
  ] = info;

  const status = (statusRaw ?? DebateStatus.ACTIVE) as DebateStatus;
  const totalPool = totalSideA + totalSideB + totalBounty;
  const { pctA, pctB } = calcPercentage(totalSideA, totalSideB);

  // Payout calculator: "If you bet 1 USDC on [side], you'd win X.XX USDC"
  const oneUSDC = 1_000_000n; // 1 USDC in 6 decimals
  const payoutA =
    totalSideA + oneUSDC > 0n
      ? calculatePayout(oneUSDC, totalSideA + oneUSDC, totalSideB, totalBounty)
      : 0n;
  const payoutB =
    totalSideB + oneUSDC > 0n
      ? calculatePayout(oneUSDC, totalSideB + oneUSDC, totalSideA, totalBounty)
      : 0n;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <StatusBadge status={status} />
          {status === DebateStatus.ACTIVE && <CountdownTimer endDate={endDate} />}
        </div>
        <h1 className="text-lg font-bold leading-tight text-white">{debateStatement}</h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
        )}
        <p className="mt-2 text-xs text-zinc-600">
          Created {formatTimestamp(creationDate)}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-center">
          <div className="text-sm font-bold text-white">${formatUSDC(totalPool)}</div>
          <div className="text-[10px] text-zinc-500">Total Pool</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-center">
          <div className="text-sm font-bold text-emerald-400">${formatUSDC(totalSideA)}</div>
          <div className="text-[10px] text-zinc-500">{sideAName}</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-center">
          <div className="text-sm font-bold text-violet-400">${formatUSDC(totalSideB)}</div>
          <div className="text-[10px] text-zinc-500">{sideBName}</div>
        </div>
      </div>

      {/* Bounty */}
      {totalBounty > 0n && (
        <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 px-3 py-2 text-center text-sm">
          <span className="text-amber-400">🏆 Bounty: ${formatUSDC(totalBounty)} USDC</span>
        </div>
      )}

      {/* Odds bar */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-sm font-medium">
          <span className="text-emerald-400">{sideAName} {pctA}%</span>
          <span className="text-violet-400">{pctB}% {sideBName}</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${pctA}%` }}
          />
          <div
            className="bg-violet-500 transition-all duration-300"
            style={{ width: `${pctB}%` }}
          />
        </div>
      </div>

      {/* Payout calculator */}
      {status === DebateStatus.ACTIVE && (totalSideA > 0n || totalSideB > 0n) && (
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="text-center">
            <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              1 USDC on {sideAName}
            </div>
            <div className="mt-0.5 text-sm font-bold text-emerald-400">
              → ${formatUSDC(payoutA)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              1 USDC on {sideBName}
            </div>
            <div className="mt-0.5 text-sm font-bold text-violet-400">
              → ${formatUSDC(payoutB)}
            </div>
          </div>
        </div>
      )}

      {/* Winner reasoning (if resolved) */}
      {isResolved && winnerReasoning && (
        <div className="rounded-xl border border-blue-900/50 bg-blue-950/20 p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
            AI Verdict — {isSideAWinner ? sideAName : sideBName} Wins
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">{winnerReasoning}</p>
        </div>
      )}

      {/* Arguments */}
      <div className="space-y-4">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-emerald-400">
            {sideAName} Arguments
          </h2>
          {argsALoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-16 rounded-lg bg-zinc-800" />
            </div>
          ) : argsA ? (
            <ArgumentList
              contents={argsA[0]}
              amounts={argsA[1]}
              authors={argsA[2] as readonly `0x${string}`[]}
              timestamps={argsA[3]}
              sideName={sideAName}
              accentColor="emerald"
            />
          ) : null}
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-violet-400">
            {sideBName} Arguments
          </h2>
          {argsBLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-16 rounded-lg bg-zinc-800" />
            </div>
          ) : argsB ? (
            <ArgumentList
              contents={argsB[0]}
              amounts={argsB[1]}
              authors={argsB[2] as readonly `0x${string}`[]}
              timestamps={argsB[3]}
              sideName={sideBName}
              accentColor="violet"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
