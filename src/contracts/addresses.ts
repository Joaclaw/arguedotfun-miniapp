import { base } from 'wagmi/chains';

/** Factory (DebateFactoryCOFI) on Base mainnet */
export const FACTORY_ADDRESS = '0xf939a2853C0b60b324b459c9f63A2379A7B16537' as const;

/** USDC on Base mainnet */
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

/** USDC uses 6 decimals */
export const USDC_DECIMALS = 6 as const;

/** Base mainnet chain ID */
export const CHAIN_ID = base.id; // 8453

/** The chain object for wagmi config */
export const CHAIN = base;
