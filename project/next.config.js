/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cssModules: true,
  webpack: (config) => {
    return config;
  }
};

module.exports = nextConfig; 