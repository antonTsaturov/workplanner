//import type { NextConfig } from "next";
//const { i18n } = require('./next-i18next.config');

//const nextConfig: NextConfig = {
  ///* config options here */
  //allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  //i18n,
//};

//export default nextConfig;

import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
