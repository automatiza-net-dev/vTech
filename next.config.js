import("next").NextConfig;

const nextConfig = {
  env: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    SYSTEM_URL: process.env.SYSTEM_URL,
    plataform: process.env.plataform,
    client: process.env.client,
    api: process.env.api,
    clientName: process.env.clientName
  },
  reactStrictMode: false,
  compiler: {
    styledComponents: {
      ssr: false,
      fileName: false,
      minify: false,
      pure: true,
      cssProp: false,
    },
  },
};

module.exports = nextConfig;


