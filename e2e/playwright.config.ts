// eslint-disable-next-line import/no-extraneous-dependencies
import { PlaywrightTestConfig } from "@playwright/test";
import path from "path";

const config: PlaywrightTestConfig = {
  testDir: path.join(__dirname, "./specs"),
  outputDir: path.join(__dirname, "./artifacts/test-results/"),
  webServer: {
    command: "yarn run start",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  forbidOnly: !!process.env.CI,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
  }
};

export default config;
