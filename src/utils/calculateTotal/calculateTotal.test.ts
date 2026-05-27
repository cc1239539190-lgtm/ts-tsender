import { describe, it, expect } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
    it("comma separated amounts", () => {
        expect(calculateTotal("100, 200, 300")).toBe(BigInt(600));
    });

    it("newline separated amounts", () => {
        expect(calculateTotal("100\n200\n300")).toBe(BigInt(600));
    });

    it("mixed comma and newline", () => {
        expect(calculateTotal("100, 200\n300")).toBe(BigInt(600));
    });

    it("single amount", () => {
        expect(calculateTotal("42")).toBe(BigInt(42));
    });

    it("empty string returns 0", () => {
        expect(calculateTotal("")).toBe(BigInt(0));
    });

    it("whitespace only returns 0", () => {
        expect(calculateTotal("   ")).toBe(BigInt(0));
    });

    it("large amount exceeding MAX_SAFE_INTEGER", () => {
        const huge = "9007199254740992";
        expect(calculateTotal(huge)).toBe(BigInt("9007199254740992"));
    });

    it("sum exceeding MAX_SAFE_INTEGER is still precise", () => {
        const a = "9007199254740991";
        const b = "9007199254740991";
        expect(calculateTotal(`${a}, ${b}`)).toBe(BigInt("18014398509481982"));
    });

    it("returns 0 when any value is invalid", () => {
        expect(calculateTotal("100, abc, 300")).toBe(BigInt(0));
    });

    it("trailing comma/whitespace is ignored", () => {
        expect(calculateTotal("100, 200,")).toBe(BigInt(300));
    });
});
