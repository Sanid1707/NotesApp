const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '' // removes /api from the URL when forwarding
      }
    })
  );
};