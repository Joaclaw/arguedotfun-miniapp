'use client';

import { useAccount } from 'wagmi';
import { useUserStats, useUserDebates } from '@/hooks/useUserStats';
import { formatUSDC } from '@/lib/utils';
import DebateCard from './DebateCard';

export default function UserDashboard() {
  const { address } = useAccount();
  const { data: stats, isLoading: statsLoading } = useUserStats(address);
  const { data: debates, isLoading: debatesLoading } = useUserDebates(address);

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-3 text-4xl">📊</div>
        <h2 className="mb-1 text-lg font-semibold text-white">Your Dashboard</h2>
        <p className="text-sm text-zinc-500">Connect wallet to view your stats</p>
      </div>
    );
  }

  if (statsLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-800" />
          ))}
        </div>
        <div className="h-40 rounded-xl bg-zinc-800" />
      </div>
    );
  }

  const winRate = stats ? Number(stats.winRate) / 100 : 0;
  const netProfit = stats?.netProfit ?? 0n;
  const isPositive = netProfit >= 0n;
  // For display, netProfit is int256 (signed). formatUSDC expects bigint.
  // If negative, we format the absolute value and prepend '-'
  const absProfit = netProfit < 0n ? -netProfit : netProfit;

  const statCards = [
    {
      label: 'Win Rate',
      value: stats ? `${winRate.toFixed(1)}%` : '—',
      color: 'text-white',
    },
    {
      label: 'Net P&L',
      value: stats ? `${isPositive ? '+' : '-'}$${formatUSDC(absProfit)}` : '—',
      color: isPositive ? 'text-emerald-400' : 'text-red-400',
    },
    {
      label: 'Total Bets',
      value: stats ? `$${formatUSDC(stats.totalBets)}` : '—',
      color: 'text-white',
    },
    {
      label: 'Debates Won',
      value: stats ? `${stats.debatesWon.toString()}/${stats.debatesParticipated.toString()}` : '—',
      color: 'text-white',
    },
  ];

  const debateAddresses = debates as `0x${string}`[] | undefined;

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-white">Your Dashboard</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Debate history */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-zinc-400">Your Debates</h3>
        {debatesLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-zinc-800" />
            ))}
          </div>
        ) : debateAddresses && debateAddresses.length > 0 ? (
          <div className="space-y-3">
            {[...debateAddresses].reverse().map((addr) => (
              <DebateCard key={addr} address={addr} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-zinc-500">
            No debates yet. Place your first bet!
          </div>
        )}
      </div>
    </div>
  );
}
