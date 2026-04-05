const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Service endpoints from environment variables or defaults
const SEA_STATE_SERVICE = process.env.SEA_STATE_SERVICE || 'http://sea-state-service:8080';
const CHARACTER_SERVICE = process.env.CHARACTER_SERVICE || 'http://character-service:8081';
const TERRAIN_SERVICE = process.env.TERRAIN_SERVICE || 'http://terrain-service:8082';
const AUTH_SERVICE = process.env.AUTH_SERVICE || 'http://auth-service:8083';

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Sea State Service routes
app.use('/sea/split', createProxyMiddleware({
  target: SEA_STATE_SERVICE,
  pathRewrite: { '^/sea': '' },
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Error proxying to sea-state-service:', err.message);
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Unable to reach sea-state-service',
      service: 'sea-state-service'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.path} -> ${SEA_STATE_SERVICE}${proxyReq.path}`);
  }
}));

app.use('/sea/status', createProxyMiddleware({
  target: SEA_STATE_SERVICE,
  pathRewrite: { '^/sea': '' },
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Error proxying to sea-state-service:', err.message);
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Unable to reach sea-state-service',
      service: 'sea-state-service'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.path} -> ${SEA_STATE_SERVICE}${proxyReq.path}`);
  }
}));

// Character Service routes
app.use('/character/move', createProxyMiddleware({
  target: CHARACTER_SERVICE,
  pathRewrite: { '^/character': '' },
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Error proxying to character-service:', err.message);
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Unable to reach character-service',
      service: 'character-service'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.path} -> ${CHARACTER_SERVICE}${proxyReq.path}`);
  }
}));

// Terrain Service routes
app.use('/terrain/validate', createProxyMiddleware({
  target: TERRAIN_SERVICE,
  pathRewrite: { '^/terrain': '' },
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Error proxying to terrain-service:', err.message);
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Unable to reach terrain-service',
      service: 'terrain-service'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.path} -> ${TERRAIN_SERVICE}${proxyReq.path}`);
  }
}));

// Auth Service routes
app.use('/auth/login', createProxyMiddleware({
  target: AUTH_SERVICE,
  pathRewrite: { '^/auth': '' },
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Error proxying to auth-service:', err.message);
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Unable to reach auth-service',
      service: 'auth-service'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.path} -> ${AUTH_SERVICE}${proxyReq.path}`);
  }
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'POST /sea/split',
      'GET /sea/status',
      'POST /character/move',
      'GET /terrain/validate',
      'POST /auth/login',
      'GET /health'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Service endpoints:');
  console.log(`  - Sea State Service: ${SEA_STATE_SERVICE}`);
  console.log(`  - Character Service: ${CHARACTER_SERVICE}`);
  console.log(`  - Terrain Service: ${TERRAIN_SERVICE}`);
  console.log(`  - Auth Service: ${AUTH_SERVICE}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
