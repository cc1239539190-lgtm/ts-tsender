export function calculateTotal(amounts: string): bigint {
    const amountArray = amounts
        .split(/[,\n]+/)
        .map(amt => amt.trim())
        .filter(amt => amt !== "");

    if (amountArray.length === 0) {
        return BigInt(0);
    }

    return amountArray.reduce((acc, curr) => acc + BigInt(curr), BigInt(0));
}
