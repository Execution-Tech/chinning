import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yousr.mangjornal.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "test-back.yosrtech.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
