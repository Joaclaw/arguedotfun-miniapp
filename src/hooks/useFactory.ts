'use client';

import { useReadContract } from 'wagmi';
import { FACTORY_ABI } from '@/contracts/abis/factory';
import { FACTORY_ADDRESS } from '@/contracts/addresses';
import type { DebateStatus } from '@/lib/types';

// ── List hooks ──

export function useActiveDebates() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getActiveDebates',
  });
}

export function useDebatesByStatus(status: DebateStatus) {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getDebatesByStatus',
    args: [status],
  });
}

export function useAllDebates() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getAllDebates',
  });
}

export function useResolvedDebates() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getResolvedDebates',
  });
}

export function useUndeterminedDebates() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getUndeterminedDebates',
  });
}

// ── Count hooks ──

export function useActiveDebatesCount() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getActiveDebatesCount',
  });
}

export function useResolvingDebatesCount() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getResolvingDebatesCount',
  });
}

export function useResolvedDebatesCount() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getResolvedDebatesCount',
  });
}

export function useUndeterminedDebatesCount() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getUndeterminedDebatesCount',
  });
}

export function useDebateCount() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getDebateCount',
  });
}

// ── Platform stats ──

export function useTotalUniqueBettors() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getTotalUniqueBettors',
  });
}

export function useTotalVolume() {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getTotalVolume',
  });
}

// ── Validation ──

export function useIsLegitDebate(debate: `0x${string}` | undefined) {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'isLegitDebate',
    args: debate ? [debate] : undefined,
    query: { enabled: !!debate },
  });
}
