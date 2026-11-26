import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // basePath: "/projects/nailed-ish",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
