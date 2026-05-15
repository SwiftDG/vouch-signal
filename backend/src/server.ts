import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import healthRouter from './routes/health.route';
import traderRouter from './routes/trader.route';
import webhookRouter from './routes/webhook.route';
import lenderRouter from './routes/lender.route';
import debugRouter from './routes/debug/debug.route';
import loanRouter from './routes/loan.route';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173']; // Common React/Vite ports
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : defaultOrigins;

const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // This is required for your Authorization Bearer tokens!
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate limiting for webhook endpoint (prevent DDoS)
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { data: null, error: 'Too many webhook requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for public API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: { data: null, error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Webhook route must be mounted before express.json() so the raw body stream is intact for HMAC verification
app.use('/api/v1/webhooks',express.raw({ type: 'application/json' }), webhookLimiter, webhookRouter);

app.use(express.json({ limit: '10mb' }));

// Apply rate limiting to public endpoints
app.use('/api/v1', apiLimiter);
app.use('/api/v1', healthRouter);
app.use('/api/v1/traders', traderRouter);
app.use('/api/v1/lenders', lenderRouter);
app.use('/api/v1/debug', debugRouter);
app.use('/api/v1/loans', loanRouter);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[ERROR]', err.message, err.stack);
  res.status(500).json({ data: null, error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} [${config.nodeEnv}]`);
  console.log(`📊 Health check: http://localhost:${config.port}/api/v1/health`);
});

export default app;
