module.exports = {
  apps: [
    {
      name: 'car-payment-api',
      script: 'dist/server.js',
      cwd: '/var/www/car-payment/src/api',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
