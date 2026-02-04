'use client';

import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { FACTORY_ABI } from '@/contracts/abis/factory';
import { DEBATE_ABI } from '@/contracts/abis/debate';
import { ERC20_ABI } from '@/contracts/abis/erc20';
import { FACTORY_ADDRESS, USDC_ADDRESS } from '@/contracts/addresses';

// ── USDC Approval ──

/** Check current USDC allowance for the Factory */
export function useUSDCAllowance() {
  const { address } = useAccount();

  return useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, FACTORY_ADDRESS] : undefined,
    query: { enabled: !!address },
  });
}

/** Check USDC balance of the connected wallet */
export function useUSDCBalance() {
  const { address } = useAccount();

  return useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

/** Approve the Factory to spend USDC */
export function useApproveUSDC() {
  const { writeContract, writeContractAsync, data, isPending, error, reset } =
    useWriteContract();

  const approve = (amount: bigint) => {
    writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [FACTORY_ADDRESS, amount],
    });
  };

  const approveAsync = (amount: bigint) => {
    return writeContractAsync({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [FACTORY_ADDRESS, amount],
    });
  };

  return { approve, approveAsync, data, isPending, error, reset };
}

// ── Place Bet ──

export function usePlaceBet() {
  const { writeContract, writeContractAsync, data, isPending, isSuccess, error, reset } =
    useWriteContract();

  const placeBet = (
    debate: `0x${string}`,
    isSideA: boolean,
    amount: bigint,
    argument: string,
  ) => {
    writeContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'placeBet',
      args: [debate, isSideA, amount, argument],
    });
  };

  const placeBetAsync = (
    debate: `0x${string}`,
    isSideA: boolean,
    amount: bigint,
    argument: string,
  ) => {
    return writeContractAsync({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'placeBet',
      args: [debate, isSideA, amount, argument],
    });
  };

  return { placeBet, placeBetAsync, data, isPending, isSuccess, error, reset };
}

// ── Claim ──

export function useClaim() {
  const { writeContract, writeContractAsync, data, isPending, isSuccess, error, reset } =
    useWriteContract();

  const claim = (debateAddress: `0x${string}`) => {
    writeContract({
      address: debateAddress,
      abi: DEBATE_ABI,
      functionName: 'claim',
    });
  };

  const claimAsync = (debateAddress: `0x${string}`) => {
    return writeContractAsync({
      address: debateAddress,
      abi: DEBATE_ABI,
      functionName: 'claim',
    });
  };

  return { claim, claimAsync, data, isPending, isSuccess, error, reset };
}

// ── Add Bounty ──

export function useAddBounty() {
  const { writeContract, writeContractAsync, data, isPending, error, reset } =
    useWriteContract();

  const addBounty = (debate: `0x${string}`, amount: bigint) => {
    writeContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'addBounty',
      args: [debate, amount],
    });
  };

  const addBountyAsync = (debate: `0x${string}`, amount: bigint) => {
    return writeContractAsync({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'addBounty',
      args: [debate, amount],
    });
  };

  return { addBounty, addBountyAsync, data, isPending, error, reset };
}

// ── Resolve Debate ──

export function useResolveDebate() {
  const { writeContract, writeContractAsync, data, isPending, error, reset } =
    useWriteContract();

  const resolveDebate = (debate: `0x${string}`) => {
    writeContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'resolveDebate',
      args: [debate],
    });
  };

  const resolveDebateAsync = (debate: `0x${string}`) => {
    return writeContractAsync({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'resolveDebate',
      args: [debate],
    });
  };

  return { resolveDebate, resolveDebateAsync, data, isPending, error, reset };
}

// ── Create Debate ──

export function useCreateDebate() {
  const { writeContract, writeContractAsync, data, isPending, error, reset } =
    useWriteContract();

  const createDebate = (
    statement: string,
    description: string,
    sideAName: string,
    sideBName: string,
    endDate: bigint,
  ) => {
    writeContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'createDebate',
      args: [statement, description, sideAName, sideBName, endDate],
    });
  };

  const createDebateAsync = (
    statement: string,
    description: string,
    sideAName: string,
    sideBName: string,
    endDate: bigint,
  ) => {
    return writeContractAsync({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'createDebate',
      args: [statement, description, sideAName, sideBName, endDate],
    });
  };

  return { createDebate, createDebateAsync, data, isPending, error, reset };
}

// ── Cancel Debate ──

export function useCancelDebate() {
  const { writeContract, writeContractAsync, data, isPending, error, reset } =
    useWriteContract();

  const cancelDebate = (debateAddress: `0x${string}`) => {
    writeContract({
      address: debateAddress,
      abi: DEBATE_ABI,
      functionName: 'cancelDebate',
    });
  };

  const cancelDebateAsync = (debateAddress: `0x${string}`) => {
    return writeContractAsync({
      address: debateAddress,
      abi: DEBATE_ABI,
      functionName: 'cancelDebate',
    });
  };

  return { cancelDebate, cancelDebateAsync, data, isPending, error, reset };
}

// ── Claim Bounty Refund ──

export function useClaimBountyRefund() {
  const { writeContract, writeContractAsync, data, isPending, error, reset } =
    useWriteContract();

  const claimBountyRefund = (debateAddress: `0x${string}`) => {
    writeContract({
      address: debateAddress,
      abi: DEBATE_ABI,
      functionName: 'claimBountyRefund',
    });
  };

  const claimBountyRefundAsync = (debateAddress: `0x${string}`) => {
    return writeContractAsync({
      address: debateAddress,
      abi: DEBATE_ABI,
      functionName: 'claimBountyRefund',
    });
  };

  return {
    claimBountyRefund,
    claimBountyRefundAsync,
    data,
    isPending,
    error,
    reset,
  };
}
