'use client';

import {
  useTotalVolume,
  useTotalUniqueBettors,
  useDebateCount,
} from '@/hooks/useFactory';
import { formatUSDC } from '@/lib/utils';

export default function PlatformStats() {
  const { data: volume, isLoading: volLoading } = useTotalVolume();
  const { data: bettors, isLoading: betLoading } = useTotalUniqueBettors();
  const { data: debates, isLoading: debLoading } = useDebateCount();

  const isLoading = volLoading || betLoading || debLoading;

  const stats = [
    {
      label: 'Total Volume',
      value: volume !== undefined ? `$${formatUSDC(volume)}` : '—',
    },
    {
      label: 'Bettors',
      value: bettors !== undefined ? bettors.toString() : '—',
    },
    {
      label: 'Debates',
      value: debates !== undefined ? debates.toString() : '—',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center"
        >
          <div className={`text-lg font-bold text-white ${isLoading ? 'animate-pulse' : ''}`}>
            {s.value}
          </div>
          <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
