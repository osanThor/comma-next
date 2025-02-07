import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avqfmrsjdoggaaelpugz.supabase.co",
        port: "",
        pathname: "/storage/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "img1.kakaocdn.net",
        pathname: "/thumb/**",
      },
      {
        protocol: "http",
        hostname: "img1.kakaocdn.net",
        pathname: "/thumb/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    domains: [],
  },
};

export default nextConfig;
