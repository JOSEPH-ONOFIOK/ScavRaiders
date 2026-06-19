/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fonts are loaded via a <link> in app/layout.js and render in the browser.
  // Disabling build-time font inlining keeps `next build` from doing a network
  // fetch to Google Fonts, so the build is deterministic in any environment.
  optimizeFonts: false,
};
export default nextConfig;
