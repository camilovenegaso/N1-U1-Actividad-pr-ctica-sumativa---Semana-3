/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: repoName ? `/${repoName.replace(/^\/|\/$/g, '')}` : '',
  assetPrefix: repoName ? `/${repoName.replace(/^\/|\/$/g, '')}/` : undefined,
  reactStrictMode: true,
};

export default nextConfig;
