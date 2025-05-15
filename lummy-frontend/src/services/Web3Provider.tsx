import React from "react";
import { Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig, lightTheme } from "@xellar/kit";
import { liskSepolia, polygonAmoy, sepolia } from "viem/chains";

const config = defaultConfig({
  appName: "Xellar",
  // Required for WalletConnect
  walletConnectProjectId: "d2fcae952e3bd7b4e51fb295883cacdf",

  // Required for Xellar Passport
  xellarAppId: "b41d718f-a1e9-4d61-8f76-25f3742c93b1",
  xellarEnv: "sandbox",
  chains: [polygonAmoy, sepolia, liskSepolia],
}) as Config;

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider theme={lightTheme}>{children}</XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
