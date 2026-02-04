# OBJECTIVES.md — argue.fun Base Mini App

## What We're Building
A **Base Mini App** that serves as the gateway to argue.fun's debate prediction markets. Users inside the Base App can browse debates, read arguments, place USDC bets, and claim winnings — all without leaving their social feed.

## Platform: Base Mini Apps
- Runs inside the **Base App** (Coinbase's social app built on Farcaster)
- Built with **Next.js App Router** + **OnchainKit** + **MiniKit**
- Users have **Base Accounts** (Smart Wallets) with passkey auth, one-tap USDC payments
- No downloads — instant launch from social feeds
- Mobile-first (Base App is primarily mobile)

## Tech Stack
| Layer | Tool |
|-------|------|
| Framework | Next.js 14+ (App Router) |
| Provider SDK | `@coinbase/onchainkit` (includes MiniKit) |
| Chain interaction | `wagmi` + `viem` |
| Chain | Base mainnet (chain ID: 8453) |
| Styling | Tailwind CSS |
| Deploy | Vercel |

### Key Import Paths
```tsx
// MiniKit (part of OnchainKit)
import { useMiniKit } from '@coinbase/onchainkit/minikit';

// OnchainKit provider
import { OnchainKitProvider } from '@coinbase/onchainkit';

// wagmi
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { base } from 'wagmi/chains';

// viem
import { formatUnits, parseUnits } from 'viem';
```

---

## argue.fun — How It Works

argue.fun is an argument-driven prediction market on Base. Users bet USDC on debate outcomes by writing compelling arguments. AI validators (GenLayer's Optimistic Democracy — multiple LLMs) evaluate both sides and determine winners. Better arguments beat bigger bets.

### Contract Architecture
- **Factory Contract** (single address, never changes): Creates debates, routes bets, manages bounties
- **Debate Contracts** (each debate gets its own address): Stores debate details, arguments, bets, handles claims

### Debate Lifecycle
```
ACTIVE (0) → RESOLVING (1) → RESOLVED (2)
                             → UNDETERMINED (3)
```
- **ACTIVE**: Accepting bets and arguments
- **RESOLVING**: AI validators evaluating
- **RESOLVED**: Winner determined, claim available
- **UNDETERMINED**: No consensus, full refunds

### Key Numbers
- USDC uses **6 decimals** (1 USDC = 1000000 raw units)
- Minimum bet: **1 USDC**
- Max argument: **1000 bytes** (not characters)
- Max debate content: **120,000 bytes** total

---

## Contract Addresses (Base Mainnet)

| Contract | Address |
|----------|---------|
| Factory (DebateFactoryCOFI) | `0xf939a2853C0b60b324b459c9f63A2379A7B16537` |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

**RPC:** `https://mainnet.base.org`
**Chain ID:** `8453`

---

## Contract Interfaces

### Factory Contract

#### Read Functions
| Function | Signature | Returns |
|----------|-----------|---------|
| Get active debates | `getActiveDebates()` | `address[]` |
| Get debates by status | `getDebatesByStatus(uint8 status)` | `address[]` |
| Get active count | `getActiveDebatesCount()` | `uint256` |
| Get resolving count | `getResolvingDebatesCount()` | `uint256` |
| Get resolved count | `getResolvedDebatesCount()` | `uint256` |
| Get undetermined count | `getUndeterminedDebatesCount()` | `uint256` |
| Get all debates | `getAllDebates()` | `address[]` |
| Get debate count | `getDebateCount()` | `uint256` |
| Get resolved debates | `getResolvedDebates()` | `address[]` |
| Get undetermined debates | `getUndeterminedDebates()` | `address[]` |
| Get user stats | `getUserStats(address user)` | `(uint256 totalWinnings, uint256 totalBets, uint256 debatesParticipated, uint256 debatesWon, uint256 totalClaimed, int256 netProfit, uint256 winRate)` |
| Get user debates | `getUserDebates(address user)` | `address[]` |
| Get user debates count | `getUserDebatesCount(address user)` | `uint256` |
| Get total unique bettors | `getTotalUniqueBettors()` | `uint256` |
| Get total volume | `getTotalVolume()` | `uint256` |
| Is legit debate | `isLegitDebate(address debate)` | `bool` |

#### Write Functions
| Function | Signature | Notes |
|----------|-----------|-------|
| Place bet | `placeBet(address debate, bool isSideA, uint256 amount, string argument)` | Requires USDC approval to Factory |
| Add bounty | `addBounty(address debate, uint256 amount)` | Requires USDC approval |
| Resolve debate | `resolveDebate(address debate)` | Anyone can call after end date |
| Create debate | `createDebate(string statement, string description, string sideAName, string sideBName, uint256 endDate)` | Min 24h duration |

### Debate Contract (each debate has unique address)

#### Read Functions
| Function | Signature | Returns |
|----------|-----------|---------|
| Get info | `getInfo()` | `(address creator, string debateStatement, string description, string sideAName, string sideBName, uint256 creationDate, uint256 endDate, bool isResolved, bool isSideAWinner, uint256 totalSideA, uint256 totalSideB, string winnerReasoning, uint256 totalContentBytes, uint256 maxTotalContentBytes, uint256 totalBounty)` |
| Get status | `status()` | `uint8` (0=ACTIVE, 1=RESOLVING, 2=RESOLVED, 3=UNDETERMINED) |
| Get side A argument data | `getArgumentDataOnSideA()` | `(string[] contents, uint256[] amounts, address[] authors, uint256[] timestamps)` |
| Get side B argument data | `getArgumentDataOnSideB()` | `(string[] contents, uint256[] amounts, address[] authors, uint256[] timestamps)` |
| Get side A argument count | `getArgumentCountOnSideA()` | `uint256` |
| Get side B argument count | `getArgumentCountOnSideB()` | `uint256` |
| Get remaining content bytes | `getRemainingContentBytes()` | `uint256` |
| Get user bets | `getUserBets(address user)` | `(uint256 sideA, uint256 sideB)` |
| Has claimed | `hasClaimed(address user)` | `bool` |
| Total bounty | `totalBounty()` | `uint256` |
| Bounty contributions | `bountyContributions(address user)` | `uint256` |
| End date | `endDate()` | `uint256` |

#### Write Functions
| Function | Signature | Notes |
|----------|-----------|-------|
| Claim | `claim()` | Claim winnings (RESOLVED) or refund (UNDETERMINED) |
| Claim bounty refund | `claimBountyRefund()` | Only if UNDETERMINED |
| Cancel debate | `cancelDebate()` | Creator only |

### USDC (ERC20)
| Function | Signature | Notes |
|----------|-----------|-------|
| Balance | `balanceOf(address)` → `uint256` | 6 decimals |
| Allowance | `allowance(address owner, address spender)` → `uint256` | |
| Approve | `approve(address spender, uint256 amount)` | One-time for Factory |

---

## Features (Priority Order)

### P0 — Must Have
1. **Debate Feed** — List active debates with statement, sides, total bets, time remaining
2. **Debate Detail** — Full view: info, arguments on both sides, bet distribution
3. **Place Bet** — Select side, enter USDC amount, optional argument, submit transaction
4. **USDC Approval** — Auto-detect and prompt if Factory not approved
5. **Claim Winnings** — Claim from resolved debates / refund from undetermined
6. **Wallet Connection** — Auto via Base Account (MiniKit), show balance

### P1 — Should Have
7. **Status Filters** — Filter debates by Active/Resolving/Resolved/Undetermined
8. **User Dashboard** — Win rate, P&L, debate history
9. **Platform Stats** — Total volume, unique bettors, debate count
10. **Countdown Timer** — Live countdown to debate end

### P2 — Nice to Have
11. **Create Debate** — Form to create new debates
12. **Add Bounty** — Add bounty to existing debates
13. **Share Debate** — Social sharing within Base App
14. **Notifications** — Push notifications for debate resolution

---

## UX Flow

### Browse (no auth required)
1. Open app → see debate feed (Active tab by default)
2. Tap debate → see full details, arguments, odds
3. Filter by status tabs

### Bet (auth required)
4. Tap "Bet" → wallet auto-connects via Base Account
5. If USDC not approved → approval prompt first
6. Select side (A or B)
7. Enter amount (USDC)
8. Optionally write argument (byte counter shows remaining)
9. Confirm in transaction tray
10. Success feedback

### Claim (auth required)
11. On debate detail (RESOLVED/UNDETERMINED) → "Claim" button visible
12. Tap claim → transaction tray
13. Success feedback with amount

---

## Design Guidelines
- **Mobile-first** — Base App is mobile
- **Dark theme preferred** — matches Base App aesthetic
- **Touch targets** — minimum 44x44px
- **Safe areas** — respect Base App chrome
- **Defer auth** — browse freely, connect only when action requires it
- **Clear feedback** — loading spinners, success/error states, empty states
- **Odds visualization** — show bet distribution as bar/ratio (e.g., 60% / 40%)

---

## Project Structure
```
arguedotfun-miniapp/
├── public/
│   ├── .well-known/
│   │   └── farcaster.json          # Mini App manifest
│   ├── icon.png                    # App icon (placeholder)
│   ├── splash.png                  # Splash screen (placeholder)
│   └── og.png                      # OG/hero image (placeholder)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (config agent)
│   │   ├── page.tsx                # Home — debate feed (frontend agent)
│   │   ├── debate/
│   │   │   └── [address]/
│   │   │       └── page.tsx        # Debate detail (frontend agent)
│   │   ├── dashboard/
│   │   │   └── page.tsx            # User dashboard (frontend agent)
│   │   └── api/
│   │       └── webhook/
│   │           └── route.ts        # Webhook (config agent)
│   ├── components/
│   │   ├── providers.tsx           # Provider tree (config agent)
│   │   ├── DebateCard.tsx          # Debate summary card
│   │   ├── DebateList.tsx          # Filterable debate list
│   │   ├── DebateDetail.tsx        # Full debate view
│   │   ├── ArgumentList.tsx        # Arguments display
│   │   ├── BetForm.tsx             # Bet placement form
│   │   ├── ApprovalFlow.tsx        # USDC approval
│   │   ├── ClaimButton.tsx         # Claim winnings
│   │   ├── CountdownTimer.tsx      # Time remaining
│   │   ├── StatusBadge.tsx         # Status indicator
│   │   ├── UserDashboard.tsx       # Stats display
│   │   ├── PlatformStats.tsx       # Global stats
│   │   └── Navigation.tsx          # App navigation
│   ├── contracts/
│   │   ├── abis/
│   │   │   ├── factory.ts          # Factory ABI
│   │   │   ├── debate.ts           # Debate ABI
│   │   │   └── erc20.ts            # ERC20/USDC ABI
│   │   └── addresses.ts            # Contract addresses + config
│   ├── hooks/
│   │   ├── useFactory.ts           # Factory read hooks
│   │   ├── useDebate.ts            # Debate read hooks
│   │   ├── useUserStats.ts         # User stats hook
│   │   └── useTransactions.ts      # Write operation hooks
│   ├── lib/
│   │   ├── utils.ts                # Formatting helpers
│   │   └── types.ts                # TypeScript types
│   └── config/
│       └── minikit.ts              # MiniKit manifest config
├── .env.example
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Payout Formula (for UI display)

**RESOLVED — winner payout:**
```
payout = yourBet + (yourBet × losingPool / winningPool) + (yourBet × totalBounty / winningPool)
profit = (yourBet / winningPool) × (losingPool + totalBounty)
```

**UNDETERMINED — full refund:**
```
payout = yourBet (on whichever side)
```

**Implied odds display:**
```
sideA_percentage = totalSideA / (totalSideA + totalSideB) × 100
sideB_percentage = totalSideB / (totalSideA + totalSideB) × 100
```
