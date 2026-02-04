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

const EMPTY_MESSAGES: Record<TabKey, { icon: string; text: string }> = {
  active: { icon: '⚡', text: 'No active debates right now. Check back soon!' },
  resolving: { icon: '⏳', text: 'No debates are being resolved at the moment.' },
  resolved: { icon: '📜', text: 'No resolved debates yet. History is waiting to be made!' },
  all: { icon: '🌐', text: 'No debates have been created yet. Be the first!' },
};

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
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center">
        <p className="mb-3 text-sm text-red-400">Failed to load debates.</p>
        <button
          onClick={() => query.refetch()}
          className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-900/50 active:bg-red-800/50"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    const { icon, text } = EMPTY_MESSAGES[tab];
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <span className="mb-3 text-4xl">{icon}</span>
        <p className="max-w-[240px] text-sm leading-relaxed text-zinc-500">{text}</p>
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
