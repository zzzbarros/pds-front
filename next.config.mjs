/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    api: process.env.API_URL,
  }
};

export default nextConfig;
