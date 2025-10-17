module.exports = {
  apps: [
    {
      name: "ecommerce-backend",
      script: "src/main.js", // relativo al cwd
      cwd: "/home/deployuser/ecommercejs/backend",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
