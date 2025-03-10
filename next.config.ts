/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdn-media.sforum.vn",
      "images.pexels.com",
      "mazdahadong.com",
      "img1.oto.com.vn",
      "i.ytimg.com",
      "cdn.gianhangvn.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-media.sforum.vn",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "mazdahadong.com",
      },
      {
        protocol: "https",
        hostname: "img1.oto.com.vn",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
