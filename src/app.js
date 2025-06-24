import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { responseMiddleware, errorHandler } from './middleware/index.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      process.env.API_GATEWAY_URL,
      process.env.FRONTEND_URL,
      'http://localhost:3000',
    ],
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(responseMiddleware());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      service: 'express',
      version: process.env.SERVICE_VERSION || '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      dependencies: {
        database: 'connected',
        eventBus: 'connected',
      },
    },
  });
});

app.get('/example', (req, res) => res.success({ message: 'Hello World' }));



app.get('/badrequest', (req, res) => res.error('Invalid input', 400));

app.get('/notfound', () => {
  const err = new Error('Resource not found');
  err.status = 404;
  throw err;
});

app.all(/.*/, (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    service: 'user-service',
  });
});


app.use((err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});
app.use(errorHandler);

export default app;
