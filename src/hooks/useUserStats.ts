'use client';

import { useReadContract } from 'wagmi';
import { FACTORY_ABI } from '@/contracts/abis/factory';
import { FACTORY_ADDRESS } from '@/contracts/addresses';
import type { UserStats } from '@/lib/types';

/**
 * Fetch on-chain stats for a user.
 * Returns the raw tuple mapped to the UserStats interface.
 */
export function useUserStats(userAddress: `0x${string}` | undefined) {
  const result = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getUserStats',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  // Map the tuple to a friendly object when data is available
  const stats: UserStats | undefined = result.data
    ? {
        totalWinnings: result.data[0],
        totalBets: result.data[1],
        debatesParticipated: result.data[2],
        debatesWon: result.data[3],
        totalClaimed: result.data[4],
        netProfit: result.data[5],
        winRate: result.data[6],
      }
    : undefined;

  return {
    data: stats,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Get the list of debate addresses a user has participated in.
 */
export function useUserDebates(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getUserDebates',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });
}

/**
 * Get the number of debates a user has participated in.
 */
export function useUserDebatesCount(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getUserDebatesCount',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });
}
