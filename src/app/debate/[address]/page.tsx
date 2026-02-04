import type { Metadata } from 'next';
import { getDebateInfo, getDebateStatus, getOdds, formatPool, getTimeRemaining, BASE_URL } from '@/lib/debate-server';
import DebateEmbed from './DebateEmbed';

interface PageProps {
  params: Promise<{ address: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { address } = await params;
  const addr = address as `0x${string}`;

  try {
    const [info, status] = await Promise.all([
      getDebateInfo(addr),
      getDebateStatus(addr),
    ]);

    const { pctA, pctB } = getOdds(info.totalSideA, info.totalSideB);
    const pool = formatPool(info.totalSideA, info.totalSideB, info.totalBounty);
    const timeStr = getTimeRemaining(info.endDate);
    const statusLabel = ['Active', 'Resolving', 'Resolved', 'Undetermined'][status] ?? 'Active';

    const title = `${info.statement} | argue.fun`;
    const desc = `${info.sideAName} (${pctA}%) vs ${info.sideBName} (${pctB}%) — $${pool} USDC pool — ${statusLabel}`;
    const imageUrl = `${BASE_URL}/debate/${address}/opengraph-image`;
    const pageUrl = `${BASE_URL}/debate/${address}`;

    // Farcaster Mini App embed JSON
    const embedJson = JSON.stringify({
      version: '1',
      imageUrl,
      button: {
        title: status === 0 ? '💰 Bet Now' : '👀 View',
        action: {
          type: 'launch_frame',
          name: 'argue.fun',
          url: pageUrl,
          splashImageUrl: `${BASE_URL}/icon.png`,
          splashBackgroundColor: '#0a0a0a',
        },
      },
    });

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        images: [{ url: imageUrl, width: 1200, height: 800 }],
      },
      other: {
        'fc:miniapp': embedJson,
        'fc:frame': embedJson,
      },
    };
  } catch {
    return {
      title: 'argue.fun — Debate Markets',
      description: 'Bet USDC on debate outcomes on Base',
    };
  }
}

export default async function DebatePage({ params }: PageProps) {
  const { address } = await params;

  return <DebateEmbed address={address as `0x${string}`} />;
}
