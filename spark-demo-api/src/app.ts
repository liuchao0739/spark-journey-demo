import cors from 'cors';
import express from 'express';
import apiRouter from './routes/index.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1', apiRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ code: 500, message: err.message || 'Internal error' });
  },
);

app.listen(PORT, () => {
  console.log(`Spark API running at http://localhost:${PORT}`);
});
