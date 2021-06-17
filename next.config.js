/* eslint-disable */

module.exports = {
  reactStrictMode: true,
  webpack5: true,
  experimental: {
    turboMode: true,
    workerThreads: true,
    serialWebpackBuild: true,
    gzipSize: true,
  },
  async redirects() {
    return [
      {
        source: "/logout",
        destination: "/auth/logout",
        permanent: true,
      },
      {
        source: "/court",
        destination: "/courthouse",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["community.cloudflare.steamstatic.com"],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      };
    }

    return config;
  },
};
