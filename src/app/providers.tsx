"use client";

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import {  RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import defaultConfig from '../rainbowKitConfig';


export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <WagmiProvider config={defaultConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}