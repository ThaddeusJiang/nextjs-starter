import { test as base, Page } from "@playwright/test";
import * as path from "path";

type TestFixtures = {
  page: Page;
};

// Export a Test with user auth cookie
const test = base.extend<TestFixtures>({
  page: async ({ browser}, use: (page: Page) => void) => {
    const authPath = path.join(__dirname, "../userdata/state.json");
    const context = await browser.newContext({ storageState: authPath });
    const newPage = await context.newPage();
    newPage.on("pageerror", (exception) => {
      console.log(`Uncaught exception: "${exception}"`);
    });
    await use(newPage);
  },
});

export default test;
