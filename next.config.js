const path = require("path");

import("next").NextConfig;

const nextConfig = {
  reactStrictMode: false,
  env: {
    api: process.env.sancla_api ?? process.env.api
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


