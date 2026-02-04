'use client';

import { DebateStatus } from '@/lib/types';

const STATUS_CONFIG: Record<DebateStatus, { label: string; className: string }> = {
  [DebateStatus.ACTIVE]: {
    label: 'Active',
    className: 'badge-active',
  },
  [DebateStatus.RESOLVING]: {
    label: 'Resolving',
    className: 'badge-resolving',
  },
  [DebateStatus.RESOLVED]: {
    label: 'Resolved',
    className: 'badge-resolved',
  },
  [DebateStatus.UNDETERMINED]: {
    label: 'Undetermined',
    className: 'badge-undetermined',
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
