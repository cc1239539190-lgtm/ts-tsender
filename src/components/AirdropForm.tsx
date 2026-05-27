"use client";

import { useState, useEffect, useMemo } from "react";
import { RiAlertFill, RiInformationLine } from "react-icons/ri";
import {
    useConfig,
    useChainId,
    useAccount,
    useWriteContract,
    useReadContracts,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import InputField from "@/components/ui/InputField";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { calculateTotal, formatTokenAmount } from "@/utils";

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amounts, setAmounts] = useState("");
    const [isUnsafeMode, setIsUnsafeMode] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const config = useConfig();
    const account = useAccount();
    const chainId = useChainId();
    const { writeContractAsync } = useWriteContract();
    const total: bigint = useMemo(() => calculateTotal(amounts), [amounts]);

    const isValidAddress = tokenAddress.length === 42 && tokenAddress.startsWith("0x");

    const { data: tokenData } = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "decimals",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address ?? "0x0000000000000000000000000000000000000000"],
            },
        ],
        query: { enabled: isValidAddress },
    });

    const tokenDecimals = (tokenData?.[0]?.result as number) ?? 18;
    const tokenName = (tokenData?.[1]?.result as string) ?? "";
    const tokenBalance = (tokenData?.[2]?.result as bigint) ?? BigInt(0);
    const hasEnoughTokens = isValidAddress && total > 0 ? tokenBalance >= total : true;

    async function getApprovedAmount(tSenderAddress: string | null): Promise<bigint> {
        if (!tSenderAddress) {
            alert("This chain only has the safer version!");
            return BigInt(0);
        }
        if (!account.address) {
            alert("Please connect your wallet first.");
            return BigInt(0);
        }
        const response = await readContract(config, {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`],
        });
        return response as bigint;
    }

    async function handleSubmit() {
        try {
            if (!tokenAddress) {
                alert("Please enter a token address.");
                return;
            }

            const chainConfig = chainsToTSender[chainId];
            if (!chainConfig) {
                alert(`Chain ${chainId} is not supported.`);
                return;
            }

            const contractType = isUnsafeMode ? "no_check" : "tsender";
            const tSenderAddress = chainConfig[contractType];

            if (!tSenderAddress) {
                alert("This chain does not support unsafe mode.");
                return;
            }

            setIsSending(true);

            const allowance = await getApprovedAmount(tSenderAddress);

            if (allowance < total) {
                const approvalHash = await writeContractAsync({
                    address: tokenAddress as `0x${string}`,
                    abi: erc20Abi,
                    functionName: "approve",
                    args: [tSenderAddress as `0x${string}`, total],
                });
                await waitForTransactionReceipt(config, { hash: approvalHash });
            }

            const airdropHash = await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    recipients
                        .split(/[,\n]+/)
                        .map((addr) => addr.trim())
                        .filter((addr) => addr !== ""),
                    amounts
                        .split(/[,\n]+/)
                        .map((amt) => amt.trim())
                        .filter((amt) => amt !== ""),
                    total,
                ],
            });
            await waitForTransactionReceipt(config, { hash: airdropHash });

            alert("Airdrop successful!");
            setIsSending(false);
        } catch (err) {
            console.error("Transaction failed:", err);
            alert("Transaction failed. Check the console for details.");
            setIsSending(false);
        }
    }

    // localStorage persistence
    useEffect(() => {
        const savedToken = localStorage.getItem("airdrop_tokenAddress");
        const savedRecipients = localStorage.getItem("airdrop_recipients");
        const savedAmounts = localStorage.getItem("airdrop_amounts");
        if (savedToken) setTokenAddress(savedToken);
        if (savedRecipients) setRecipients(savedRecipients);
        if (savedAmounts) setAmounts(savedAmounts);
    }, []);

    useEffect(() => { localStorage.setItem("airdrop_tokenAddress", tokenAddress); }, [tokenAddress]);
    useEffect(() => { localStorage.setItem("airdrop_recipients", recipients); }, [recipients]);
    useEffect(() => { localStorage.setItem("airdrop_amounts", amounts); }, [amounts]);

    const infoRow = (label: string, value: string) => (
        <div className="flex justify-between items-center py-0.5">
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {label}
            </span>
            <span
                className="text-xs font-medium truncate max-w-[60%] text-right"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
            >
                {value}
            </span>
        </div>
    );

    return (
        <div
            className="max-w-2xl min-w-full xl:min-w-lg w-full lg:mx-auto p-6 flex flex-col gap-6 rounded-2xl transition-shadow duration-300"
            style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                boxShadow: isUnsafeMode
                    ? "0 0 0 1px rgba(239, 68, 68, 0.2), 0 4px 24px rgba(239, 68, 68, 0.08)"
                    : "0 0 0 1px rgba(99, 102, 241, 0.15), 0 4px 24px rgba(99, 102, 241, 0.06)",
            }}
        >
            {/* Header row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span
                        className="text-lg font-bold tracking-tight"
                        style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
                    >
                        T-Sender
                    </span>
                </div>
                <Tabs
                    value={isUnsafeMode ? "unsafe" : "safe"}
                    onValueChange={(v) => setIsUnsafeMode(v === "unsafe")}
                >
                    <TabsList>
                        <TabsTrigger value="safe">Safe</TabsTrigger>
                        <TabsTrigger value="unsafe">Unsafe</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="space-y-5">
                <InputField
                    label="Token Address"
                    id="token-address"
                    placeholder="0x..."
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                />
                <InputField
                    label="Recipients"
                    id="recipients"
                    placeholder="0x123..., 0x456..."
                    value={recipients}
                    large
                    onChange={(e) => setRecipients(e.target.value)}
                />
                <InputField
                    label="Amounts (wei)"
                    id="amounts"
                    placeholder="100, 200, 300..."
                    value={amounts}
                    large
                    onChange={(e) => setAmounts(e.target.value)}
                />

                {/* Token info card */}
                {tokenAddress && tokenName && (
                    <div
                        className="rounded-xl p-4 space-y-2 transition-all duration-300"
                        style={{
                            background: "var(--bg-surface-raised)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <h3
                            className="text-xs font-semibold tracking-wider uppercase mb-1"
                            style={{ color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
                        >
                            Token Details
                        </h3>
                        {infoRow("Name", tokenName)}
                        {infoRow("Amount (wei)", total.toString())}
                        {infoRow("Amount (tokens)", formatTokenAmount(total, tokenDecimals))}
                        {infoRow("Your Balance", formatTokenAmount(tokenBalance, tokenDecimals))}
                    </div>
                )}

                {/* Unsafe mode warning */}
                {isUnsafeMode && (
                    <div
                        className="p-4 rounded-xl flex items-center justify-between transition-all duration-300"
                        style={{
                            background: "rgba(239, 68, 68, 0.08)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "var(--danger)",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <RiAlertFill size={18} />
                            <span
                                className="text-sm font-medium"
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                Unsafe &mdash; gas optimized mode
                            </span>
                        </div>
                        <div className="relative group">
                            <RiInformationLine className="cursor-help w-4 h-4 opacity-50 hover:opacity-80 transition-opacity" />
                            <div
                                className="absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg text-xs w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                                style={{
                                    background: "var(--bg-surface-raised)",
                                    color: "var(--text-secondary)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                Skips safety checks for gas optimization. Only use if you can
                                verify calldata manually.
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 relative overflow-hidden"
                    style={{
                        fontFamily: "var(--font-sans)",
                        color: "#fff",
                        border: "none",
                        cursor: isSending ? "not-allowed" : "pointer",
                        opacity: isSending ? 0.6 : 1,
                        background: isUnsafeMode
                            ? "linear-gradient(135deg, #ef4444, #dc2626)"
                            : "linear-gradient(135deg, #6366f1, #4f46e5)",
                        boxShadow: isUnsafeMode
                            ? "0 2px 16px rgba(239, 68, 68, 0.25)"
                            : "0 2px 16px rgba(99, 102, 241, 0.25)",
                    }}
                >
                    {isSending
                        ? "Processing..."
                        : !account.address
                            ? "Connect Wallet"
                            : !hasEnoughTokens && isValidAddress
                                ? "Insufficient Balance"
                                : isUnsafeMode
                                    ? "Send (Unsafe)"
                                    : "Send Tokens"}
                </button>
            </div>
        </div>
    );
}
