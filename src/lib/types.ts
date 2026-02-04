// Shared TypeScript types for argue.fun Mini App

export enum DebateStatus {
  ACTIVE = 0,
  RESOLVING = 1,
  RESOLVED = 2,
  UNDETERMINED = 3,
}

export interface DebateInfo {
  address: `0x${string}`;
  creator: `0x${string}`;
  debateStatement: string;
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
  status: DebateStatus;
}

export interface Argument {
  author: `0x${string}`;
  content: string;
  amount: bigint;
  timestamp: bigint;
}

export interface ArgumentData {
  contents: string[];
  amounts: bigint[];
  authors: `0x${string}`[];
  timestamps: bigint[];
}

export interface UserBets {
  sideA: bigint;
  sideB: bigint;
}

export interface UserStats {
  totalWinnings: bigint;
  totalBets: bigint;
  debatesParticipated: bigint;
  debatesWon: bigint;
  totalClaimed: bigint;
  netProfit: bigint;
  winRate: bigint; // basis points: 5000 = 50%
}

export interface PlatformStats {
  totalUniqueBettors: bigint;
  totalVolume: bigint;
  totalDebates: bigint;
}
