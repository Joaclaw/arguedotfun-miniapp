'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePlaceBet } from '@/hooks/useTransactions';
import { parseUSDC, byteLengthOf } from '@/lib/utils';
import ApprovalFlow from './ApprovalFlow';

interface BetFormProps {
  debateAddress: `0x${string}`;
  sideAName: string;
  sideBName: string;
}

const MAX_ARGUMENT_BYTES = 1000;

export default function BetForm({ debateAddress, sideAName, sideBName }: BetFormProps) {
  const { address } = useAccount();
  const { placeBet, isPending, error } = usePlaceBet();

  const [side, setSide] = useState<'A' | 'B' | null>(null);
  const [amount, setAmount] = useState('');
  const [argument, setArgument] = useState('');

  const byteCount = byteLengthOf(argument);
  const parsedAmount = amount && !isNaN(Number(amount)) && Number(amount) >= 1
    ? parseUSDC(amount)
    : 0n;

  const canSubmit = !!address && side !== null && parsedAmount > 0n && byteCount <= MAX_ARGUMENT_BYTES && !isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    placeBet(debateAddress, side === 'A', parsedAmount, argument);
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

        {/* Argument textarea */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs text-zinc-500">Argument (optional)</label>
            <span className={`text-xs ${byteCount > MAX_ARGUMENT_BYTES ? 'text-red-400' : 'text-zinc-500'}`}>
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
          {isPending ? 'Placing Bet…' : side ? `Bet on ${side === 'A' ? sideAName : sideBName}` : 'Select a Side'}
        </button>

        {error && (
          <p className="text-center text-xs text-red-400">
            {error.message?.slice(0, 100) ?? 'Transaction failed'}
          </p>
        )}
      </div>
    </ApprovalFlow>
  );
}
