import("next").NextConfig;

const nextConfig = {
  reactStrictMode: false,
  env: {
    api: process.env.api
  },
  compiler: {
    styledComponents: true
  },
};

module.exports = nextConfig;


