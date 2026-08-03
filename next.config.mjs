/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'localhost:3000',
    'localhost:3001',
    '192.168.31.121:3000',
    '192.168.31.121:3001',
    '192.168.31.121',
  ],
};

export default nextConfig;
