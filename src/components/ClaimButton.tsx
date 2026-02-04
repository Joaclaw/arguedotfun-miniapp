'use client';

import { useState, useEffect } from 'react';
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
  const { claim, isPending, isSuccess, error } = useClaim();

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
    }
  }, [isSuccess]);

  if (!address) return null;

  const status = statusRaw as DebateStatus | undefined;

  // Only show for resolved or undetermined debates
  if (status !== DebateStatus.RESOLVED && status !== DebateStatus.UNDETERMINED) return null;

  // Check if user has bets
  const userSideA = bets ? (bets as readonly bigint[])[0] : 0n;
  const userSideB = bets ? (bets as readonly bigint[])[1] : 0n;
  if (userSideA === 0n && userSideB === 0n) return null;

  // Already claimed (from chain or just succeeded)
  if (claimed || showSuccess) {
    return (
      <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/20 p-4 text-center text-sm font-medium text-emerald-400">
        {showSuccess && !claimed ? '🎉 Claimed!' : '✅ Already claimed'}
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
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Claiming…
          </span>
        ) : isRefund ? (
          'Claim Refund'
        ) : (
          'Claim Winnings'
        )}
      </button>
      {error && (
        <p className="text-center text-xs text-red-400">
          {error.message?.slice(0, 120) ?? 'Claim failed'}
        </p>
      )}
    </div>
  );
}
