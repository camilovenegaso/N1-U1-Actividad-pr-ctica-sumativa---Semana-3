/** @type {import('next').NextConfig} */
const repo = 'N1-U1-Actividad-pr-ctica-sumativa---Semana-3';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? `/${repo}` : '',
  reactStrictMode: true,
};

export default nextConfig;
