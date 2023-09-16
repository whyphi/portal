/** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'static.foxnews.com',
//           port: '',
//           pathname: '/*',
//         },
//       ],
//     },
//   }

// module.exports = nextConfig

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node/,
      use: 'raw-loader',
    });

    return config;
  },

  
  images: {
    domains: ['whyphi-zap.s3.amazonaws.com']
  },
}
