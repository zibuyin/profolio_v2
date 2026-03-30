const { execSync } = require("child_process");

const gitHash = execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

module.exports = {
  output: "export",
  images: {
    unoptimized: true,
  },

  // GitHub Pages static deployment
  basePath: "/profolio_v2",
  assetPrefix: "/profolio_v2/",
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_GIT_HASH: gitHash,
  },
};
