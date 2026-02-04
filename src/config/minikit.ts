/**
 * MiniKit / Mini App manifest configuration.
 *
 * All URLs come from environment variables so we can swap between
 * local dev, preview deploys, and production without code changes.
 */

export const miniKitConfig = {
  name: 'argue.fun',
  category: 'social' as const,
  tags: ['debate', 'prediction-market', 'usdc', 'base', 'argue'],
  url: process.env.NEXT_PUBLIC_URL ?? 'https://argue.fun',
  iconUrl: `${process.env.NEXT_PUBLIC_URL ?? 'https://argue.fun'}/icon.png`,
  splashImageUrl: `${process.env.NEXT_PUBLIC_URL ?? 'https://argue.fun'}/splash.png`,
  ogImageUrl: `${process.env.NEXT_PUBLIC_URL ?? 'https://argue.fun'}/og.png`,
};
