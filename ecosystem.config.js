exports = {
  apps: [
    {
      name: "chat-backend",

      script: "./server.js", // agar app.js hai to app.js likho

      instances: "max",

      exec_mode: "cluster",

      watch: false,

      autorestart: true,

      max_memory_restart: "500M",

      env: {
        NODE_ENV: "production",
      },
    },
  ],
};