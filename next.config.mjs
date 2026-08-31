/** @type {import('next').NextConfig} */
const rawRepo = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.NODE_ENV === 'production' ? 'N1-U1-Actividad-pr-ctica-sumativa---Semana-3' : '');
const repoName = rawRepo ? rawRepo.replace(/^\/|\/$/g, '') : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: repoName ? `/${repoName}` : '',
  assetPrefix: repoName ? `/${repoName}/` : undefined,
  reactStrictMode: true,
};

export default nextConfig;
