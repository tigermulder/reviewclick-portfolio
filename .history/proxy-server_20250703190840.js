const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 8080;

// CORS 허용
app.use(cors({
  origin: '*',
  credentials: true
}));

// B2 API 프록시
app.use('/b2', createProxyMiddleware({
  target: 'https://dev-api.revuclick.io',
  changeOrigin: true,
  secure: false,
  headers: {
    'Origin': 'https://dev-api.revuclick.io'
  }
}));

// 기본 API 프록시
app.use('/api', createProxyMiddleware({
  target: 'https://dev-api.revuclick.io',
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/api': ''
  }
}));

app.listen(PORT, () => {
  console.log(`프록시 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`B2 API: http://localhost:${PORT}/b2/ads/Ska1a8fo`);
}); 