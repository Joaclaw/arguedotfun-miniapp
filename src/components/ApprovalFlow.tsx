'use client';

import { useUSDCAllowance, useApproveUSDC } from '@/hooks/useTransactions';
import { useAccount } from 'wagmi';

interface ApprovalFlowProps {
  requiredAmount: bigint;
  children: React.ReactNode;
}

export default function ApprovalFlow({ requiredAmount, children }: ApprovalFlowProps) {
  const { address } = useAccount();
  const { data: allowance, isLoading: allowanceLoading } = useUSDCAllowance();
  const { approve, isPending } = useApproveUSDC();

  // If no wallet or still loading, just show children (they'll handle auth)
  if (!address || allowanceLoading) {
    return <>{children}</>;
  }

  // If allowance is sufficient, render children (the bet form)
  if (allowance !== undefined && allowance >= requiredAmount) {
    return <>{children}</>;
  }

  // Need approval
  const maxApproval = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 text-center">
        <p className="mb-3 text-sm text-amber-300">
          Approve USDC spending to place bets
        </p>
        <button
          onClick={() => approve(maxApproval)}
          disabled={isPending}
          className="min-h-[44px] w-full rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-500 active:bg-amber-700 disabled:opacity-50"
        >
          {isPending ? 'Approving…' : 'Approve USDC'}
        </button>
      </div>
    </div>
  );
}
