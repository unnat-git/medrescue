import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdnjs.com; style-src 'self' 'unsafe-inline' https://unpkg.com https://cdnjs.com; img-src 'self' data: https://*.openstreetmap.org https://unpkg.com https://cdnjs.com https://raw.githubusercontent.com; connect-src 'self' https://medrescue.onrender.com wss://medrescue.onrender.com; font-src 'self'; object-src 'none'; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
