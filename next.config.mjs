/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./src/styles', './src/styles/partials'],
    prependData: `@use "src/styles/partials/_variables.scss" as *;`,
  },
};

export default nextConfig;