'use client';

import { DebateStatus } from '@/lib/types';

const STATUS_CONFIG: Record<DebateStatus, { label: string; className: string }> = {
  [DebateStatus.ACTIVE]: {
    label: 'Active',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  [DebateStatus.RESOLVING]: {
    label: 'Resolving',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  [DebateStatus.RESOLVED]: {
    label: 'Resolved',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  [DebateStatus.UNDETERMINED]: {
    label: 'Undetermined',
    className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  },
};

export default function StatusBadge({ status }: { status: DebateStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[DebateStatus.ACTIVE];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
