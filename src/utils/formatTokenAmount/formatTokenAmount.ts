export function formatTokenAmount(amountWei: bigint, decimals: number): string {
    if (decimals === 0) return amountWei.toString();

    const divisor = BigInt(10) ** BigInt(decimals);
    const integerPart = amountWei / divisor;
    const fractionalPart = amountWei % divisor;

    const padded = fractionalPart.toString().padStart(decimals, "0");
    const trimmed = padded.replace(/0+$/, "");

    if (trimmed === "") return integerPart.toString();
    return `${integerPart}.${trimmed}`;
}
