import { expect } from "@playwright/test";
import test from "../fixtures/common";

test("Mansions", async ({ page }) => {
  await page.goto("./mansions/",{ waitUntil: "load" });
  await page.waitForSelector("text=Mansions");
  // todo: Use mock data
  await page.waitForTimeout(5000);
  expect(await page.screenshot()).toMatchSnapshot("mansions.png");
});