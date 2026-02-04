import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/debate-server';

/**
 * GET /.well-known/farcaster.json
 *
 * Farcaster Mini App manifest.
 * The accountAssociation must be signed by a Farcaster custody address.
 * Replace the placeholder once you have a Farcaster account and run:
 *   npx create-onchain --manifest
 */
export async function GET() {
  const manifest = {
    // TODO: Replace with real accountAssociation after Farcaster signup
    accountAssociation: {
      header: '',
      payload: '',
      signature: '',
    },
    miniapp: {
      version: '1',
      name: 'argue.fun',
      iconUrl: `${BASE_URL}/icon.png`,
      homeUrl: `${BASE_URL}`,
      splashImageUrl: `${BASE_URL}/splash.png`,
      splashBackgroundColor: '#0a0a0a',
      webhookUrl: `${BASE_URL}/api/webhook`,
      subtitle: 'Debate prediction markets',
      description: 'Bet USDC on debate outcomes. Write arguments. AI picks the winner. Built on Base.',
      primaryCategory: 'finance',
      tags: ['debate', 'prediction-market', 'usdc', 'base'],
      requiredChains: ['eip155:8453'],
    },
  };

  return NextResponse.json(manifest, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
