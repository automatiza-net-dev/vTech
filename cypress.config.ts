import { defineConfig } from "cypress";
require("dotenv").config()

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  env: process.env,
  e2e: {
    viewportHeight: 1080,
    viewportWidth: 1920,
    baseUrl: "http://localhost:3060/",
  },
});
