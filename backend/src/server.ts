import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'https://vouchsignal.vercel.app'] }));
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', mode: 'illustrative-demo', timestamp: new Date().toISOString() });
});
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'This API route is not available.' });
});
const port = Number(process.env.PORT || 3000);
if (require.main === module) app.listen(port, () => console.log(`Vouch health server on ${port}`));
export default app;
