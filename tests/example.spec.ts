import { test, expect } from "@playwright/test";
import { LocatorManager } from "../utils/locator-manager";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  const locatorManager = new LocatorManager(page);

  // Find interactive element (like a button or link)
  const getStartedLink = await locatorManager.getLocator("Get started");
  await getStartedLink.click();

  // Find non-interactive element (like a heading)
  const installationHeading = await locatorManager.getLocator("Installation", {
    interactive: false,
  });
  await expect(installationHeading).toBeVisible();
});
