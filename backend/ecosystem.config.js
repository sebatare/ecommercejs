module.exports = {
  apps: [
    {
      name: "ecommerce-backend",
      script: "server.js", // relativo al cwd
      cwd: "/home/deployuser/ecommercejs/backend",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
