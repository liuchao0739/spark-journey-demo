import cors from 'cors';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import apiRouter from './routes/index.js';

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3000;
const EXPECTED_LESSONS_PER_CHAPTER = 7;

async function logLessonCounts() {
  const chapters = await prisma.chapter.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { lessons: true } } },
  });
  for (const chapter of chapters) {
    const count = chapter._count.lessons;
    const ok = count === EXPECTED_LESSONS_PER_CHAPTER;
    console.log(
      `Chapter ${chapter.sortOrder} (${chapter.slug}): ${count} lessons${ok ? '' : ' — run npm run db:reset'}`,
    );
  }
}

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
  void logLessonCounts();
});
