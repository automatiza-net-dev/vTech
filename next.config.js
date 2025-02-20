import("next").NextConfig;

const nextConfig = {
  env: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    plataform: process.env.plataform,
    client: process.env.client,
    api: process.env.api,
    clientName: process.env.clientName
  },
  experimental: {
    turbo: {
    
    },
  },
  reactStrictMode: false,
  compiler: {
    styledComponents: true
  },
};

module.exports = nextConfig;


