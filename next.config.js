import("next").NextConfig;

const nextConfig = {
  env: {
    api: process.env.api,
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    SYSTEM_URL: process.env.SYSTEM_URL,
    plataform: process.env.plataform,
    client: process.env.client,
    api: process.env.api,
    clientName: process.env.clientName
  },
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;


