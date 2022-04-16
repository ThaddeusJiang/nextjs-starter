import { expect } from "@playwright/test";
import test from "../fixtures/common";

test("Hosts", async ({ page }) => {
  await page.goto("./hosts/", { waitUntil: "load" });
  await page.waitForSelector("text=New");
  // todo: Use mock data
  await page.waitForTimeout(5000);
  expect(await page.screenshot()).toMatchSnapshot("hosts.png");
});
