'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePlaceBet, useUSDCBalance } from '@/hooks/useTransactions';
import { useDebateInfo } from '@/hooks/useDebate';
import { parseUSDC, formatUSDC, calculatePayout } from '@/lib/utils';
import { byteLengthOf } from '@/lib/utils';
import ApprovalFlow from './ApprovalFlow';

interface BetFormProps {
  debateAddress: `0x${string}`;
  sideAName: string;
  sideBName: string;
}

const MAX_ARGUMENT_BYTES = 1000;

export default function BetForm({ debateAddress, sideAName, sideBName }: BetFormProps) {
  const { address } = useAccount();
  const { placeBet, isPending, isSuccess, error, reset } = usePlaceBet();
  const { data: balanceRaw } = useUSDCBalance();
  const { data: info } = useDebateInfo(debateAddress);

  const [side, setSide] = useState<'A' | 'B' | null>(null);
  const [amount, setAmount] = useState('');
  const [argument, setArgument] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const byteCount = byteLengthOf(argument);
  const parsedAmount =
    amount && !isNaN(Number(amount)) && Number(amount) >= 1
      ? parseUSDC(amount)
      : 0n;

  const canSubmit =
    !!address &&
    side !== null &&
    parsedAmount > 0n &&
    byteCount <= MAX_ARGUMENT_BYTES &&
    !isPending;

  // Extract pool data for estimated payout
  const totalSideA = info ? ((info as readonly unknown[])[9] as bigint) : 0n;
  const totalSideB = info ? ((info as readonly unknown[])[10] as bigint) : 0n;
  const totalBounty = info ? ((info as readonly unknown[])[14] as bigint) : 0n;

  // Calculate estimated payout
  const estimatedPayout =
    side && parsedAmount > 0n
      ? calculatePayout(
          parsedAmount,
          side === 'A' ? totalSideA + parsedAmount : totalSideB + parsedAmount,
          side === 'A' ? totalSideB : totalSideA,
          totalBounty,
        )
      : null;

  // Show success message briefly after tx
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setAmount('');
      setArgument('');
      setSide(null);
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

  // USDC balance formatted
  const formattedBalance =
    balanceRaw !== undefined ? formatUSDC(balanceRaw as bigint) : null;

  const handleMax = () => {
    if (balanceRaw !== undefined) {
      const raw = balanceRaw as bigint;
      // Format without commas for the input
      const formatted = (Number(raw) / 1e6).toFixed(2);
      setAmount(formatted);
    }
  };

  if (!address) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center text-sm text-zinc-500">
        Connect wallet to place a bet
      </div>
    );
  }

  return (
    <ApprovalFlow requiredAmount={parsedAmount}>
      <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="text-sm font-semibold text-white">Place Your Bet</h3>

        {/* Success message */}
        {showSuccess && (
          <div className="rounded-lg border border-emerald-700/50 bg-emerald-950/30 px-3 py-2 text-center text-sm font-medium text-emerald-400">
            ✅ Bet placed!
          </div>
        )}

        {/* Side selector */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSide('A')}
            className={`min-h-[44px] rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
              side === 'A'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                : 'border-zinc-700 text-zinc-400 active:bg-zinc-800'
            }`}
          >
            {sideAName}
          </button>
          <button
            onClick={() => setSide('B')}
            className={`min-h-[44px] rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
              side === 'B'
                ? 'border-violet-500 bg-violet-500/20 text-violet-400'
                : 'border-zinc-700 text-zinc-400 active:bg-zinc-800'
            }`}
          >
            {sideBName}
          </button>
        </div>

        {/* USDC Balance */}
        {formattedBalance !== null && (
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Balance: {formattedBalance} USDC</span>
            <button
              onClick={handleMax}
              className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-400 transition-colors hover:bg-zinc-700 active:bg-zinc-600"
            >
              MAX
            </button>
          </div>
        )}

        {/* Amount input */}
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Amount (USDC)</label>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Min 1 USDC"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Estimated payout */}
        {estimatedPayout !== null && estimatedPayout > 0n && (
          <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-center text-sm">
            <span className="text-zinc-400">Est. payout: </span>
            <span className="font-semibold text-emerald-400">
              ${formatUSDC(estimatedPayout)} USDC
            </span>
          </div>
        )}

        {/* Argument textarea */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs text-zinc-500">Argument (optional)</label>
            <span
              className={`text-xs ${
                byteCount > MAX_ARGUMENT_BYTES ? 'text-red-400' : 'text-zinc-500'
              }`}
            >
              {byteCount}/{MAX_ARGUMENT_BYTES} bytes
            </span>
          </div>
          <textarea
            placeholder="Why do you think this side wins?"
            value={argument}
            onChange={(e) => setArgument(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="min-h-[44px] w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
