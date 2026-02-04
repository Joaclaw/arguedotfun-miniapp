'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDebateInfo, useDebateStatus } from '@/hooks/useDebate';
import { DebateStatus } from '@/lib/types';
import DebateDetail from '@/components/DebateDetail';
import BetForm from '@/components/BetForm';
import ClaimButton from '@/components/ClaimButton';
import Navigation from '@/components/Navigation';

export default function DebatePage() {
  const params = useParams();
  const router = useRouter();
  const address = params.address as `0x${string}`;

  const { data: info } = useDebateInfo(address);
  const { data: statusRaw } = useDebateStatus(address);

  const status = statusRaw as DebateStatus | undefined;

  // Extract side names from info tuple for BetForm
  const sideAName = info ? (info as readonly unknown[])[3] as string : 'Side A';
  const sideBName = info ? (info as readonly unknown[])[4] as string : 'Side B';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-lg px-4 pb-24 pt-4">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex min-h-[44px] items-center gap-1 text-sm text-zinc-400 active:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        <DebateDetail address={address} />

        {/* Bet form (only for active debates) */}
        {status === DebateStatus.ACTIVE && (
          <div className="mt-5">
            <BetForm
              debateAddress={address}
              sideAName={sideAName}
              sideBName={sideBName}
            />
          </div>
        )}

        {/* Claim button (for resolved/undetermined) */}
        {(status === DebateStatus.RESOLVED || status === DebateStatus.UNDETERMINED) && (
          <div className="mt-5">
            <ClaimButton debateAddress={address} />
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );
}
