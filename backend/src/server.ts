import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import healthRouter from './routes/health.route';
import profileRouter from './routes/profile.route';
import confirmationRouter from './routes/confirmation.route';
import publicProfileRouter from './routes/public-profile.route';

const app = express();

// Security headers
app.use(helmet());

app.set('trust proxy', 1);

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

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { data: null, error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: '10mb' }));

app.use('/api/v1', apiLimiter);
app.use('/api/v1', healthRouter);
app.use('/api/v1/profiles', profileRouter);
app.use('/api/v1/confirmations', confirmationRouter);
app.use('/api/v1/public/profiles', publicProfileRouter);

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
