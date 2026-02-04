'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';

export default function Home() {
  const { context } = useMiniKit();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-2 text-3xl font-bold text-white">
        argue<span className="text-emerald-400">.fun</span>
      </h1>
      <p className="mb-6 max-w-xs text-sm text-zinc-400">
        Bet USDC on debate outcomes. Write arguments. AI picks the winner.
      </p>

      {context ? (
        <p className="text-xs text-zinc-500">
          Open a debate link to start betting
        </p>
      ) : (
        <a
          href="https://argue.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 active:bg-emerald-700"
        >
          Go to argue.fun
        </a>
      )}

      <p className="mt-8 text-xs text-zinc-600">
        Built on Base · USDC markets · AI-judged debates
      </p>
    </div>
  );
}
