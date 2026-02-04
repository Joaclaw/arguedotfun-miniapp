'use client';

import { useAccount } from 'wagmi';
import { useDebateStatus, useUserBets, useHasClaimed } from '@/hooks/useDebate';
import { useClaim } from '@/hooks/useTransactions';
import { DebateStatus } from '@/lib/types';

interface ClaimButtonProps {
  debateAddress: `0x${string}`;
}

export default function ClaimButton({ debateAddress }: ClaimButtonProps) {
  const { address } = useAccount();
  const { data: statusRaw } = useDebateStatus(debateAddress);
  const { data: bets } = useUserBets(debateAddress, address);
  const { data: claimed } = useHasClaimed(debateAddress, address);
  const { claim, isPending, error } = useClaim();

  if (!address) return null;

  const status = statusRaw as DebateStatus | undefined;

  // Only show for resolved or undetermined debates
  if (status !== DebateStatus.RESOLVED && status !== DebateStatus.UNDETERMINED) return null;

  // Check if user has bets
  const userSideA = bets ? (bets as readonly bigint[])[0] : 0n;
  const userSideB = bets ? (bets as readonly bigint[])[1] : 0n;
  if (userSideA === 0n && userSideB === 0n) return null;

  // Already claimed
  if (claimed) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center text-sm text-zinc-500">
        ✅ Already claimed
      </div>
    );
  }

  const isRefund = status === DebateStatus.UNDETERMINED;

  return (
    <div className="space-y-2">
      <button
        onClick={() => claim(debateAddress)}
        disabled={isPending}
        className={`min-h-[44px] w-full rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
          isRefund
            ? 'bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-700'
            : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700'
        }`}
      >
        {isPending ? 'Claiming…' : isRefund ? 'Claim Refund' : 'Claim Winnings'}
      </button>
      {error && (
        <p className="text-center text-xs text-red-400">
          {error.message?.slice(0, 100) ?? 'Claim failed'}
        </p>
      )}
    </div>
  );
}
