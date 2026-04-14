import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Get git hash
const { execSync } = require("child_process");
const gitHash = execSync("git rev-parse --short HEAD").toString().trim();
const lastUpdated = execSync("git log -1 --format=%cd").toString()
  .toString()
  .trim();


// Pharse the time diff between now and last push
function timeAgo(dateString: string) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const diff = (new Date(dateString).getTime() - Date.now()) / 1000

  if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), "second")
  if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), "minute")
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), "hour")
  if (Math.abs(diff) < 2592000) return rtf.format(Math.round(diff / 86400), "day")

  return new Date(dateString).toLocaleDateString()
}


const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GIT_HASH: gitHash,
    NEXT_PUBLIC_GIT_LAST_UPDATED: timeAgo(lastUpdated),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
