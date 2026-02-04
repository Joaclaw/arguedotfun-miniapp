'use client';

import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'argue.fun',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
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
      </WagmiProvider>
    </QueryClientProvider>
  );
}
