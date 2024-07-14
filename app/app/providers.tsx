"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { useRouter } from "next/navigation";

import { config } from "@/lib/wagmi";
import {
  DynamicContextProvider,
  DynamicWagmiConnector,
  EthereumWalletConnectors,
} from "@/lib/dynamic";
import { EthersExtension } from "@dynamic-labs/ethers-v5";

import { FileProvider } from "./hooks/FileContext";

import theme from "./theme";

const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  const router = useRouter();
  return (
    <ChakraProvider theme={theme}>
      <FileProvider>
        <DynamicContextProvider
          settings={{
            environmentId: "e989bf26-ed65-4ab1-ba55-2404830df7ee",
            walletConnectors: [EthereumWalletConnectors],
            walletConnectorExtensions: [EthersExtension],
            events: {
              onAuthFlowClose: () => {
                console.log("in onAuthFlowClose");
              },
              onAuthFlowOpen: () => {
                console.log("in onAuthFlowOpen");
              },
              onAuthSuccess: () => {
                router.push("/dashboard");
              },
              onLogout: () => {
                console.log("in onLogout");
                router.push("/");
              },
            },
          }}
        >
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <DynamicWagmiConnector>{props.children}</DynamicWagmiConnector>
            </QueryClientProvider>
          </WagmiProvider>
        </DynamicContextProvider>
      </FileProvider>
    </ChakraProvider>
  );
}
