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
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'whyphi-zap.s3.amazonaws.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  }