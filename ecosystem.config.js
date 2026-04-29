module.exports = {
  apps: [{
    name: 'vips-iamac',
    script: 'server.js',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 5000,
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    }
  }]
}
