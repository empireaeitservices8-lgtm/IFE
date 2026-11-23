
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mariadb", "@prisma/adapter-mariadb"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
