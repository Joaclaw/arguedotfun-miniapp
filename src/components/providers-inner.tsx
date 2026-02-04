'use client';

import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

const wagmiConfig = getDefaultConfig({
  appName: 'argue.fun',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'arguefun',
  chains: [base],
  ssr: true,
});

const queryClient = new QueryClient();

export default function ProvidersInner({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base}
            config={{
              appearance: {
                mode: 'auto',
              },
            }}
            miniKit={{ enabled: true }}
          >
            {children}
          </OnchainKitProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
