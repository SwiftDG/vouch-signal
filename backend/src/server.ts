import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { config } from './config/env';
import healthRouter from './routes/health.route';
import traderRouter from './routes/trader.route';

const app = express();

app.use(express.json());

app.use('/api/v1', healthRouter);
app.use('/api/v1/traders', traderRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.message);
  res.status(500).json({ data: null, error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
});

export default app;
