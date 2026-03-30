import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Get git hash
const { execSync } = require("child_process");
const gitHash = execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GIT_HASH: gitHash,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
