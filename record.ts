import { chromium } from "@playwright/test";

(async () => {
  // Make sure to run headed.
  const browser = await chromium.launch({ headless: false });

  // Setup context however you like.
  const context = await browser.newContext({
    /* pass any options */
  });
  await context.route("**/*", (route) => {
    console.log("route triggered");
    return route.continue();
  });

  // Pause the page, and start recording manually.
  const page = await context.newPage();
  await page.pause();
})();
