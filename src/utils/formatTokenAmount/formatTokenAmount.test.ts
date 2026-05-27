import { describe, it, expect } from "vitest";
import { formatTokenAmount } from "./formatTokenAmount";

describe("formatTokenAmount", () => {
    it("formats 1 ETH (18 decimals)", () => {
        expect(formatTokenAmount(BigInt("1000000000000000000"), 18)).toBe("1");
    });

    it("formats 1.5 ETH", () => {
        expect(formatTokenAmount(BigInt("1500000000000000000"), 18)).toBe("1.5");
    });

    it("formats small decimal (6 decimals)", () => {
        expect(formatTokenAmount(BigInt("2500000"), 6)).toBe("2.5");
    });

    it("formats zero", () => {
        expect(formatTokenAmount(BigInt(0), 18)).toBe("0");
    });

    it("formats with zero decimals", () => {
        expect(formatTokenAmount(BigInt(100), 0)).toBe("100");
    });

    it("formats value smaller than one token", () => {
        expect(formatTokenAmount(BigInt("500000000000000000"), 18)).toBe("0.5");
    });

    it("trims trailing zeros", () => {
        expect(formatTokenAmount(BigInt("100000000000000000000"), 18)).toBe("100");
    });
});
