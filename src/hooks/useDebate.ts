'use client';

import { useReadContract } from 'wagmi';
import { DEBATE_ABI } from '@/contracts/abis/debate';

// ── Core info ──

export function useDebateInfo(address: `0x${string}` | undefined) {
  return useReadContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'getInfo',
    query: { enabled: !!address },
  });
}

export function useDebateStatus(address: `0x${string}` | undefined) {
  return useReadContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'status',
    query: { enabled: !!address },
  });
}

// ── Arguments ──

export function useArgumentDataSideA(address: `0x${string}` | undefined) {
  return useReadContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'getArgumentDataOnSideA',
    query: { enabled: !!address },
  });
}

export function useArgumentDataSideB(address: `0x${string}` | undefined) {
  return useReadContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'getArgumentDataOnSideB',
    query: { enabled: !!address },
  });
}

export function useArgumentCountSideA(address: `0x${string}` | undefined) {
  return useReadContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'getArgumentCountOnSideA',
    query: { enabled: !!address },
  });
}

export function useArgumentCountSideB(address: `0x${string}` | undefined) {
  return useReadContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'getArgumentCountOnSideB',
    query: { enabled: !!address },
  });
}

export function useRemainingContentBytes(address: `0x${string}` | undefined) {
  return useReadContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'getRemainingContentBytes',
    query: { enabled: !!address },
  });
}

// ── User-specific reads ──

export function useUserBets(
  debateAddress: `0x${string}` | undefined,
  userAddress: `0x${string}` | undefined,
) {
  return useReadContract({
    address: debateAddress,
    abi: DEBATE_ABI,
    functionName: 'getUserBets',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!debateAddress && !!userAddress },
  });
}

export function useHasClaimed(
  debateAddress: `0x${string}` | undefined,
  userAddress: `0x${string}` | undefined,
) {
  return useReadContract({
    address: debateAddress,
    abi: DEBATE_ABI,
    functionName: 'hasClaimed',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!debateAddress && !!userAddress },
  });
}

// ── Bounty ──

export function useTotalBounty(address: `0x${string}` | undefined) {
  return useReadContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'totalBounty',
    query: { enabled: !!address },
  });
}

export function useBountyContributions(
  debateAddress: `0x${string}` | undefined,
  userAddress: `0x${string}` | undefined,
) {
  return useReadContract({
    address: debateAddress,
    abi: DEBATE_ABI,
    functionName: 'bountyContributions',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!debateAddress && !!userAddress },
  });
}

// ── Misc ──

export function useEndDate(address: `0x${string}` | undefined) {
  return useReadContract({
    address,
    abi: DEBATE_ABI,
    functionName: 'endDate',
    query: { enabled: !!address },
  });
}
