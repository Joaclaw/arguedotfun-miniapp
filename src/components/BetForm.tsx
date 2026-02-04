'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePlaceBet, useUSDCBalance } from '@/hooks/useTransactions';
import { useDebateInfo } from '@/hooks/useDebate';
import { parseUSDC, formatUSDC, calculatePayout } from '@/lib/utils';
import ApprovalFlow from './ApprovalFlow';

interface BetFormProps {
  debateAddress: `0x${string}`;
  sideAName: string;
  sideBName: string;
}

export default function BetForm({
  debateAddress,
  sideAName,
  sideBName,
}: BetFormProps) {
  const { address } = useAccount();
  const { placeBet, isPending, isSuccess, error, reset } = usePlaceBet();
  const { data: balanceRaw } = useUSDCBalance();
  const { data: info } = useDebateInfo(debateAddress);

  const [side, setSide] = useState<'A' | 'B' | null>(null);
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showArgument, setShowArgument] = useState(false);
  const [argument, setArgument] = useState('');

  const parsedAmount =
    amount && !isNaN(Number(amount)) && Number(amount) >= 1
      ? parseUSDC(amount)
      : 0n;

  const canSubmit =
    !!address && side !== null && parsedAmount > 0n && !isPending;

  // Pool data for estimated payout
  const totalSideA = info ? ((info as readonly unknown[])[9] as bigint) : 0n;
  const totalSideB = info ? ((info as readonly unknown[])[10] as bigint) : 0n;
  const totalBounty = info ? ((info as readonly unknown[])[14] as bigint) : 0n;

  const estimatedPayout =
    side && parsedAmount > 0n
      ? calculatePayout(
          parsedAmount,
          side === 'A' ? totalSideA + parsedAmount : totalSideB + parsedAmount,
          side === 'A' ? totalSideB : totalSideA,
          totalBounty,
        )
      : null;

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setAmount('');
      setArgument('');
      setSide(null);
      setShowArgument(false);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        reset();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    placeBet(debateAddress, side === 'A', parsedAmount, argument);
  };

  const formattedBalance =
    balanceRaw !== undefined ? formatUSDC(balanceRaw as bigint) : null;

  const handleMax = () => {
    if (balanceRaw !== undefined) {
      const raw = balanceRaw as bigint;
      setAmount((Number(raw) / 1e6).toFixed(2));
    }
  };

  if (!address) {
    return (
      <div className="glass-card p-4 text-center text-sm" style={{ color: 'var(--platinum-medium)' }}>
        Connect wallet to place a bet
      </div>
    );
  }

  return (
    <ApprovalFlow requiredAmount={parsedAmount}>
      <div className="glass-card space-y-3 p-4 animate-fade-in">
        {/* Success message */}
        {showSuccess && (
          <div className="glass-surface px-3 py-2 text-center text-sm font-medium" style={{ borderColor: 'oklch(0.7 0.15 142 / 0.4)', color: 'oklch(0.7 0.15 142)' }}>
            ✅ Bet placed!
          </div>
        )}

        {/* Side selector */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSide('A')}
            className={`min-h-[44px] rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              side === 'A'
                ? 'btn-side-a-active'
                : 'glass-surface text-zinc-400 active:brightness-110'
            }`}
          >
            {sideAName}
          </button>
          <button
            onClick={() => setSide('B')}
            className={`min-h-[44px] rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              side === 'B'
                ? 'btn-side-b-active'
                : 'glass-surface text-zinc-400 active:brightness-110'
            }`}
          >
            {sideBName}
          </button>
        </div>

        {/* Amount + balance */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs" style={{ color: 'var(--platinum-medium)' }}>Amount (USDC)</label>
            {formattedBalance !== null && (
              <button
                onClick={handleMax}
                className="text-[10px] font-semibold uppercase font-mono-nums"
                style={{ color: 'var(--side-a)' }}
              >
                {formattedBalance} USDC · MAX
              </button>
            )}
          </div>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Min 1 USDC"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-glass w-full px-3 py-2.5 text-sm font-mono-nums"
          />
        </div>

        {/* Estimated payout (inline) */}
        {estimatedPayout !== null && estimatedPayout > 0n && (
          <div className="text-center text-sm">
            <span style={{ color: 'var(--platinum-medium)' }}>Est. payout: </span>
            <span className="font-semibold font-mono-nums" style={{ color: 'var(--side-a)' }}>
              ${formatUSDC(estimatedPayout)}
            </span>
          </div>
        )}

        {/* Optional argument toggle */}
        {!showArgument ? (
          <button
            onClick={() => setShowArgument(true)}
            className="w-full text-center text-xs underline underline-offset-2"
            style={{ color: 'var(--platinum-medium)', textDecorationColor: 'var(--platinum-dark)' }}
          >
            + Add argument (optional)
          </button>
        ) : (
          <div>
            <textarea
              placeholder="Why does this side win?"
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              rows={2}
              className="input-glass w-full resize-none px-3 py-2 text-sm"
            />
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn-platinum min-h-[44px] w-full px-6 py-3 text-sm"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Confirming…
            </span>
          ) : side ? (
            `Bet on ${side === 'A' ? sideAName : sideBName}`
          ) : (
            'Select a Side'
          )}
        </button>

        {error && (
          <p className="text-center text-xs text-red-400">
            {error.message?.slice(0, 120) ?? 'Transaction failed'}
          </p>
        )}
      </div>
    </ApprovalFlow>
  );
}
