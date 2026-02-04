'use client';

import { useState } from 'react';
import {
  useActiveDebates,
  useDebatesByStatus,
  useAllDebates,
} from '@/hooks/useFactory';
import { DebateStatus } from '@/lib/types';
import DebateCard from './DebateCard';

type TabKey = 'active' | 'resolving' | 'resolved' | 'all';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'resolving', label: 'Resolving' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'all', label: 'All' },
];

function DebateListInner({ tab }: { tab: TabKey }) {
  const active = useActiveDebates();
  const resolving = useDebatesByStatus(DebateStatus.RESOLVING);
  const resolved = useDebatesByStatus(DebateStatus.RESOLVED);
  const all = useAllDebates();

  const queryMap: Record<TabKey, typeof active> = {
    active,
    resolving,
    resolved,
    all,
  };

  const query = queryMap[tab];
  const addresses = query.data as `0x${string}`[] | undefined;

  if (query.isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-3 h-4 w-3/4 rounded bg-zinc-800" />
            <div className="mb-2 h-3 w-1/2 rounded bg-zinc-800" />
            <div className="h-2 rounded-full bg-zinc-800" />
          </div>
        ))}
      </div>
    );
  }

  if (query.error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center text-sm text-red-400">
        Failed to load debates. Pull to refresh.
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500">
        No debates found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {[...addresses].reverse().map((addr) => (
        <DebateCard key={addr} address={addr} />
      ))}
    </div>
  );
}

export default function DebateList() {
  const [tab, setTab] = useState<TabKey>('active');

  return (
    <div>
      {/* Tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-zinc-900 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`min-h-[36px] flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t.key
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 active:bg-zinc-800/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <DebateListInner tab={tab} />
    </div>
  );
}
