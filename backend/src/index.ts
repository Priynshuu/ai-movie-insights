import express from 'express';
import { config } from './config';
import { setupSecurity } from './middlewares/security';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import routes from './routes';
import { logger } from './utils/logger';

const app = express();

// Security middleware
setupSecurity(app);

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`Server started on port ${config.port}`, {
    environment: config.nodeEnv,
    cacheEnabled: config.cacheEnabled
  });
});

export default app;
