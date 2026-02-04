'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useUSDCBalance } from '@/hooks/useTransactions';
import { formatUSDC } from '@/lib/utils';

export default function WalletButton() {
  const { isConnected } = useAccount();
  const { data: balance } = useUSDCBalance();

  if (isConnected && balance !== undefined) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-emerald-400">
          ${formatUSDC(balance as bigint)} USDC
        </span>
        <ConnectButton
          accountStatus="avatar"
          chainStatus="none"
          showBalance={false}
        />
      </div>
    );
  }

  return (
    <ConnectButton
      accountStatus="avatar"
      chainStatus="none"
      showBalance={false}
      label="Connect"
    />
  );
}
