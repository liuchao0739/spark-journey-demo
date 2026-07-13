import { Router } from 'express';
import { resolveLocale } from '../middleware/locale.js';
import {
  completeLesson,
  getJourneyData,
  getLessonDetail,
  getUserProfile,
  updateUserLocale,
} from '../services/journeyService.js';

const router = Router();

router.get('/user/profile', async (req, res, next) => {
  try {
    const user = await getUserProfile();
    res.json({ code: 0, data: { stars: user.stars, locale: user.locale }, message: 'ok' });
  } catch (e) {
    next(e);
  }
});

router.patch('/user/locale', async (req, res, next) => {
  try {
    const { locale } = req.body as { locale?: string };
    if (!locale || !['en-US', 'zh-CN'].includes(locale)) {
      res.status(400).json({ code: 400, message: 'Invalid locale' });
      return;
    }
    const user = await updateUserLocale(locale as 'en-US' | 'zh-CN');
    res.json({ code: 0, data: { locale: user.locale }, message: 'ok' });
  } catch (e) {
    next(e);
  }
});

router.get('/journey', async (req, res, next) => {
  try {
    const locale = resolveLocale(req);
    const data = await getJourneyData(locale);
    res.json({ code: 0, data, message: 'ok' });
  } catch (e) {
    next(e);
  }
});

router.get('/lessons/:id', async (req, res, next) => {
  try {
    const locale = resolveLocale(req);
    const id = Number(req.params.id);
    const data = await getLessonDetail(id, locale);
    if (!data) {
      res.status(404).json({ code: 404, message: 'Lesson not found' });
      return;
    }
    res.json({ code: 0, data, message: 'ok' });
  } catch (e) {
    next(e);
  }
});

router.post('/lessons/:id/complete', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { rating = 5 } = req.body as { rating?: number };
    const data = await completeLesson(id, rating);
    res.json({ code: 0, data, message: 'ok' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'Lesson not found') {
      res.status(404).json({ code: 404, message: msg });
      return;
    }
    if (msg === 'Lesson is locked') {
      res.status(403).json({ code: 403, message: msg });
      return;
    }
    next(e);
  }
});

export default router;
