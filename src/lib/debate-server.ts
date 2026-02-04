import { createPublicClient, http, formatUnits } from 'viem';
import { base } from 'viem/chains';
import { DEBATE_ABI } from '@/contracts/abis/debate';
import { USDC_DECIMALS } from '@/contracts/addresses';

const client = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

export interface ServerDebateInfo {
  creator: `0x${string}`;
  statement: string;
  description: string;
  sideAName: string;
  sideBName: string;
  creationDate: bigint;
  endDate: bigint;
  isResolved: boolean;
  isSideAWinner: boolean;
  totalSideA: bigint;
  totalSideB: bigint;
  winnerReasoning: string;
  totalContentBytes: bigint;
  maxTotalContentBytes: bigint;
  totalBounty: bigint;
}

export async function getDebateInfo(
  address: `0x${string}`,
): Promise<ServerDebateInfo> {
  const info = await client.readContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'getInfo',
  });

  const [
    creator,
    statement,
    description,
    sideAName,
    sideBName,
    creationDate,
    endDate,
    isResolved,
    isSideAWinner,
    totalSideA,
    totalSideB,
    winnerReasoning,
    totalContentBytes,
    maxTotalContentBytes,
    totalBounty,
  ] = info;

  return {
    creator: creator as `0x${string}`,
    statement: statement as string,
    description: description as string,
    sideAName: sideAName as string,
    sideBName: sideBName as string,
    creationDate: creationDate as bigint,
    endDate: endDate as bigint,
    isResolved: isResolved as boolean,
    isSideAWinner: isSideAWinner as boolean,
    totalSideA: totalSideA as bigint,
    totalSideB: totalSideB as bigint,
    winnerReasoning: winnerReasoning as string,
    totalContentBytes: totalContentBytes as bigint,
    maxTotalContentBytes: maxTotalContentBytes as bigint,
    totalBounty: totalBounty as bigint,
  };
}

export async function getDebateStatus(address: `0x${string}`): Promise<number> {
  const status = await client.readContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'status',
  });
  return Number(status);
}

export function formatPool(totalSideA: bigint, totalSideB: bigint, totalBounty: bigint): string {
  const total = totalSideA + totalSideB + totalBounty;
  return formatUnits(total, USDC_DECIMALS);
}

export function getOdds(totalSideA: bigint, totalSideB: bigint): { pctA: number; pctB: number } {
  const total = totalSideA + totalSideB;
  if (total === 0n) return { pctA: 50, pctB: 50 };
  const pctA = Number((totalSideA * 100n) / total);
  return { pctA, pctB: 100 - pctA };
}

export function getTimeRemaining(endDate: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const end = Number(endDate);
  const diff = end - now;
  if (diff <= 0) return 'Ended';
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  if (d > 0) return `${d}d ${h}h left`;
  const m = Math.floor((diff % 3600) / 60);
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

export const BASE_URL =
  process.env.NEXT_PUBLIC_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');
