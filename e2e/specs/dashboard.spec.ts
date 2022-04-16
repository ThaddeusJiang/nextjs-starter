import { expect } from "@playwright/test";
import test from "../fixtures/common";

test("Dashborad", async ({ page }) => {
  await page.goto('.', { waitUntil: "load" });
  await page.waitForSelector("text=trial count");
  // wait for 3 second
  // todo: Use mock data
  await page.waitForTimeout(3000);
  expect(await page.screenshot()).toMatchSnapshot("dashborad.png",);
});
