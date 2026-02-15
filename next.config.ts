import type { NextConfig } from "next";

//const nextConfig: NextConfig = {
  /* config options here */

  /** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
//};

//export default nextConfig;
