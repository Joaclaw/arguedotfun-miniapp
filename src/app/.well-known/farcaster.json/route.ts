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
    accountAssociation: {
      header: 'eyJmaWQiOjI2NTk2MzcsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgzNkU2RWNBMEQ1NDQzMEJlYzBiMDljMWEyRDExOTlENjMzM2JFZTc1In0',
      payload: 'eyJkb21haW4iOiJhcmd1ZWRvdGZ1bi1taW5pYXBwLnZlcmNlbC5hcHAifQ',
      signature: 'brYzevG5ZVqWi4yEQXvZM6sPG58y2EZInkMnGwN6QJUp4xaAdPTfehIcj2KSrhsT77xID8wqK_qFcbK9sH8HhBs',
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
