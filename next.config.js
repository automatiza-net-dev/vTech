const path = require("path");

import("next").NextConfig;

const nextConfig = {
  reactStrictMode: false,
  env: {
    api: process.env.sancla_api ?? process.env.api,
    appOrigin: process.env.APP_ORIGIN ?? (process.env.VERCEL ? "VERCEL" : "LOCAL"),
    appCommit: (process.env.APP_COMMIT ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 8),
    appBuiltAt: new Date().toISOString()
  },
  compiler: {
    styledComponents: true
  },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals = ["@tanstack/react-query", ...config.externals];
      }
      config.resolve.alias["@tanstack/react-query"] = path.resolve(
        "./node_modules/@tanstack/react-query"
      );

      return config;
    },
};

module.exports = nextConfig;


