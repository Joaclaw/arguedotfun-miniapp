'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';

export default function Home() {
  const { context } = useMiniKit();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center animate-fade-in">
      <h1 className="mb-2 text-3xl font-bold text-white">
        argue<span style={{ color: 'var(--side-a)' }}>.fun</span>
      </h1>
      <p className="mb-6 max-w-xs text-sm" style={{ color: 'var(--platinum-medium)' }}>
        Bet USDC on debate outcomes. Write arguments. AI picks the winner.
      </p>

      {context ? (
        <p className="text-xs" style={{ color: 'var(--platinum-dark)' }}>
          Open a debate link to start betting
        </p>
      ) : (
        <a
          href="https://argue.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-platinum px-6 py-3 text-sm inline-block"
        >
          Go to argue.fun
        </a>
      )}

      <p className="mt-8 text-xs" style={{ color: 'var(--platinum-dark)' }}>
        Built on Base · USDC markets · AI-judged debates
      </p>
    </div>
  );
}
