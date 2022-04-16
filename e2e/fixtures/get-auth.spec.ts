import { test, expect } from "@playwright/test";

// Test account for generate-account cookie
const TEST_ID = process.env.TEST_ID || "";
const TEST_PASS = process.env.TEST_PASS || "";

test("example test", async ({ page, context }) => {
  page.on("pageerror", (exception) => {
    console.log(`Uncaught exception: "${exception}"`);
  });
  await page.goto("http://localhost:3000/");
  await Promise.all([
    page.waitForNavigation(),
    page.click("text=Sign in with Azure Active Directory B2C"),
  ]);
  // Fill Email
  await Promise.all([
    page.waitForNavigation(),
    page.fill('input[type="email"]', TEST_ID),
  ]);
  page.click("input[id=idSIButton9]");
  // Fill Password
  await Promise.all([
    page.waitForNavigation(),
    page.fill('input[type="password"]', TEST_PASS),
  ]);
  // Click Next
  await page.click('input[id="idSIButton9"]');
  await page.waitForNavigation();
  // Press Enter
  await page.press("input[id=idSIButton9]", "Enter");
  await page.waitForSelector("text=trial count");
  await page.locator("text=trial count");
  await page.locator("text=Customer Stats").first();
  // Store auth state
  await context.storageState({ path: "e2e/userdata/state.json" });
  expect(await page.locator("text=trial count"));
});
