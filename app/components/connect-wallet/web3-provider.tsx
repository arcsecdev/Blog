"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";
import { SimpleKitProvider } from "./simplekit";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected({ target: "metaMask" }),
    coinbaseWallet(),
    walletConnect({ projectId: projectId || "" }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Web3Provider(props: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SimpleKitProvider>{props.children}</SimpleKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}