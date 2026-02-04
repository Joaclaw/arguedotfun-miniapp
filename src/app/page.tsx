'use client';

import PlatformStats from '@/components/PlatformStats';
import DebateList from '@/components/DebateList';
import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-white">
            argue<span className="text-emerald-400">.fun</span>
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">Debate prediction markets on Base</p>
        </div>

        {/* Platform stats */}
        <div className="mb-5">
          <PlatformStats />
        </div>

        {/* Debate list with tabs */}
        <DebateList />
      </div>
      <Navigation />
    </div>
  );
}
