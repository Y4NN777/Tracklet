/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Exclude problematic Genkit packages that cause build errors
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@genkit-ai/firebase': false,
      '@opentelemetry/exporter-jaeger': false,
    };

    // Ignore these modules during build
    config.externals = config.externals || [];
    config.externals.push({
      '@genkit-ai/firebase': 'commonjs @genkit-ai/firebase',
      '@opentelemetry/exporter-jaeger': 'commonjs @opentelemetry/exporter-jaeger',
    });

    return config;
  },
};

export default nextConfig;
