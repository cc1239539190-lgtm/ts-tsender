"use client";

import { sepolia,anvil} from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export default getDefaultConfig({
    appName: "TSender",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [sepolia,anvil],
    ssr: true,
});
