import { testWithSynpress } from "@synthetixio/synpress";
import { ethereumWalletMockFixtures } from "@synthetixio/synpress/playwright";
import { expect } from "@playwright/test";

const test = testWithSynpress(ethereumWalletMockFixtures);

test.describe("TSender — Page", () => {
    test("header shows app name", async ({ page }) => {
        await expect(page.locator("header")).toContainText("TSender");
    });

    test("Connect button is visible", async ({ page }) => {
        await expect(
            page.getByRole("button", { name: /Connect/i })
        ).toBeVisible();
    });

    test("three form inputs are rendered", async ({ page }) => {
        await expect(page.getByLabel("Token Address")).toBeVisible();
        await expect(page.getByLabel(/Recipients/)).toBeVisible();
        await expect(page.getByLabel(/Amounts/)).toBeVisible();
    });

    test("Safe/Unsafe tabs are visible", async ({ page }) => {
        await expect(
            page.getByRole("button", { name: "Safe", exact: true })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Unsafe", exact: true })
        ).toBeVisible();
    });

    test("Send button is visible", async ({ page }) => {
        await expect(
            page.getByRole("button", { name: /Send Tokens/ })
        ).toBeVisible();
    });
});

test.describe("TSender — Form Interaction", () => {
    test("fill Token Address", async ({ page }) => {
        const input = page.getByLabel("Token Address");
        await input.fill("0x1234567890123456789012345678901234567890");
        await expect(input).toHaveValue(
            "0x1234567890123456789012345678901234567890"
        );
    });

    test("fill Recipients (textarea)", async ({ page }) => {
        const input = page.getByLabel(/Recipients/);
        await input.fill("0xabc0000000000000000000000000000000000001");
        await expect(input).toContainText(
            "0xabc0000000000000000000000000000000000001"
        );
    });

    test("fill Amounts (textarea)", async ({ page }) => {
        const input = page.getByLabel(/Amounts/);
        await input.fill("100, 200, 300");
        await expect(input).toContainText("100, 200, 300");
    });

    test("switch to Unsafe mode shows warning", async ({ page }) => {
        await page.getByRole("button", { name: "Unsafe", exact: true }).click();
        await expect(page.getByText(/gas optimized/)).toBeVisible();
    });

    test("submit without token address shows alert", async ({ page }) => {
        page.on("dialog", async (dialog) => {
            expect(dialog.message()).toBe("Please enter a token address.");
            await dialog.dismiss();
        });

        await page.getByRole("button", { name: /Send Tokens/ }).click();
    });
});

test.describe("TSender — Wallet Connect", () => {
    test("click Connect opens RainbowKit wallet modal", async ({ page }) => {
        await page.getByRole("button", { name: /Connect/i }).click();

        await expect(
            page.getByTestId("rk-wallet-option-metaMask")
                .or(page.getByRole("button", { name: /MetaMask/i }))
        ).toBeVisible({ timeout: 10_000 });
    });
});
