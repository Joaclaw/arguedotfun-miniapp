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
      <div
        className="glass-card p-4 text-center"
        style={{ borderColor: 'oklch(0.8 0.15 85 / 0.3)' }}
      >
        <p className="mb-3 text-sm" style={{ color: 'var(--side-a)' }}>
          Approve USDC spending to place bets
        </p>
        <button
          onClick={() => approve(maxApproval)}
          disabled={isPending}
          className="btn-platinum min-h-[44px] w-full px-6 py-3 text-sm"
        >
          {isPending ? 'Approving…' : 'Approve USDC'}
        </button>
      </div>
    </div>
  );
}
