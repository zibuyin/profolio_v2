module.exports = {
  apps: [
    {
      name: "profolio_v2",               // PM2 process name
      script: "node_modules/next/dist/bin/next",  // Next.js start script
      args: "start -p 3000",             // port your app will run on
      cwd: "/home/nathan/projects/profolio_v2",  // project folder
      watch: false,                       // set true only for dev
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};