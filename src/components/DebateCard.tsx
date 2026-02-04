'use client';

import Link from 'next/link';
import { useDebateInfo, useDebateStatus } from '@/hooks/useDebate';
import { formatUSDC, calcPercentage } from '@/lib/utils';
import { DebateStatus } from '@/lib/types';
import StatusBadge from './StatusBadge';
import CountdownTimer from './CountdownTimer';

export default function DebateCard({ address }: { address: `0x${string}` }) {
  const { data: info, isLoading: infoLoading } = useDebateInfo(address);
  const { data: statusRaw, isLoading: statusLoading } = useDebateStatus(address);

  if (infoLoading || statusLoading) {
    return (
      <div className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="mb-3 h-4 w-3/4 rounded bg-zinc-800" />
        <div className="mb-2 h-3 w-1/2 rounded bg-zinc-800" />
        <div className="h-3 w-1/3 rounded bg-zinc-800" />
      </div>
    );
  }

  if (!info) return null;

  // info is a tuple from getInfo()
  const [
    , // creator
    debateStatement,
    , // description
    sideAName,
    sideBName,
    , // creationDate
    endDate,
    , // isResolved
    , // isSideAWinner
    totalSideA,
    totalSideB,
    , // winnerReasoning
    , // totalContentBytes
    , // maxTotalContentBytes
    totalBounty,
  ] = info;

  const status = (statusRaw ?? DebateStatus.ACTIVE) as DebateStatus;
  const totalPool = totalSideA + totalSideB + totalBounty;
  const { pctA, pctB } = calcPercentage(totalSideA, totalSideB);

  return (
    <Link href={`/debate/${address}`} className="block">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors active:bg-zinc-800/80">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-white">
            {debateStatement}
          </h3>
          <StatusBadge status={status} />
        </div>

        {/* Odds bar */}
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-emerald-400">{sideAName} {pctA}%</span>
            <span className="text-violet-400">{pctB}% {sideBName}</span>
          </div>
          <div className="flex h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="rounded-l-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${pctA}%` }}
            />
            <div
              className="rounded-r-full bg-violet-500 transition-all duration-300"
              style={{ width: `${pctB}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium">${formatUSDC(totalPool)} pool</span>
          {status === DebateStatus.ACTIVE && <CountdownTimer endDate={endDate} />}
        </div>
      </div>
    </Link>
  );
}
