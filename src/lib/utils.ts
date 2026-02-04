import { formatUnits, parseUnits } from 'viem';
import { USDC_DECIMALS } from '@/contracts/addresses';

// ── USDC helpers ──

/** Format a raw USDC bigint to a human-readable string (e.g. 1000000n → "1.00") */
export function formatUSDC(raw: bigint, decimals = 2): string {
  const formatted = formatUnits(raw, USDC_DECIMALS);
  const num = Number(formatted);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Parse a human-readable USDC string to a raw bigint (e.g. "1" → 1000000n) */
export function parseUSDC(amount: string): bigint {
  return parseUnits(amount, USDC_DECIMALS);
}

// ── Address helpers ──

/** Shorten an address for display: 0x1234…abcd */
export function formatAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** Alias used by UI components */
export const truncateAddress = formatAddress;

// ── Time helpers ──

/**
 * Format a Unix timestamp (seconds) to a human-readable date/time string.
 * Accepts bigint or number.
 */
export function formatTimestamp(ts: bigint | number): string {
  const ms = Number(ts) * 1000;
  return new Date(ms).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Return a human-friendly relative-time string (e.g. "3h ago", "in 2d").
 * Accepts a Unix timestamp in seconds (bigint or number).
 */
export function getRelativeTime(ts: bigint | number): string {
  const now = Date.now();
  const target = Number(ts) * 1000;
  const diffMs = target - now;
  const absDiff = Math.abs(diffMs);
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let label: string;
  if (days > 0) label = `${days}d`;
  else if (hours > 0) label = `${hours}h`;
  else if (minutes > 0) label = `${minutes}m`;
  else label = `${seconds}s`;

  return diffMs >= 0 ? `in ${label}` : `${label} ago`;
}

// ── Byte helpers ──

/** Return the byte length of a UTF-8 string (for on-chain byte limits). */
export function byteLengthOf(text: string): number {
  return new TextEncoder().encode(text).length;
}

/** Alias used by UI components */
export const getByteLength = byteLengthOf;

// ── Payout / odds ──

/**
 * Calculate the estimated payout for a winning bet.
 *
 *   payout = bet + (bet × losingPool / winningPool) + (bet × totalBounty / winningPool)
 *
 * All values are raw USDC bigints.  Returns 0n if the winning pool is empty.
 */
export function calculatePayout(
  bet: bigint,
  winningPool: bigint,
  losingPool: bigint,
  totalBounty: bigint,
): bigint {
  if (winningPool === 0n) return 0n;
  return bet + (bet * losingPool) / winningPool + (bet * totalBounty) / winningPool;
}

/** Alias used by UI components */
export const calcPayout = calculatePayout;

/**
 * Calculate the percentage odds for each side.
 * Returns `{ sideA: number; sideB: number }` where each value is 0-100.
 * If both pools are zero, returns 50/50.
 */
export function calculateOdds(
  totalSideA: bigint,
  totalSideB: bigint,
): { sideA: number; sideB: number } {
  const total = totalSideA + totalSideB;
  if (total === 0n) return { sideA: 50, sideB: 50 };

  const sideA = Number((totalSideA * 10000n) / total) / 100;
  const sideB = Number((totalSideB * 10000n) / total) / 100;

  return { sideA, sideB };
}

/**
 * Convenience wrapper returning `{ pctA, pctB }` for side-A / side-B
 * percentages as rounded integers (0-100). Used by UI components.
 */
export function calcPercentage(
  totalSideA: bigint,
  totalSideB: bigint,
): { pctA: number; pctB: number } {
  const { sideA, sideB } = calculateOdds(totalSideA, totalSideB);
  return { pctA: Math.round(sideA), pctB: Math.round(sideB) };
}
