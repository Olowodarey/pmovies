/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "image.tmdb.org" ,
            port: "",
            pathname: "/t/p/**",
          },
          {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
            port: "",
            pathname: "/**",
          },
        ],
      },

    // Proxy backend calls through the frontend origin so the session cookie
    // stays first-party. Modern browsers (Chrome/Safari) block or partition
    // third-party cookies from another second-level domain, breaking the auth
    // flow when frontend (vercel.app) and backend (railway.app) are separate.
    // With this rewrite, browser → /api/backend/* stays on our origin; the
    // Vercel edge proxies to Railway. Cookies set on Railway responses land
    // on our origin and are sent back automatically.
    async rewrites() {
      const backend = process.env.INTERNAL_BACKEND_URL ?? "http://localhost:4000";
      return [
        {
          source: "/api/backend/:path*",
          destination: `${backend}/:path*`,
        },
      ];
    },
};

export default nextConfig;
