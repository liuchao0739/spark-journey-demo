import { PrismaClient } from '@prisma/client';
import { pickTranslation, type Locale } from '../middleware/locale.js';

const prisma = new PrismaClient();

export async function getUserProfile() {
  let user = await prisma.userProfile.findUnique({ where: { id: 1 } });
  if (!user) {
    user = await prisma.userProfile.create({ data: { id: 1, stars: 0, locale: 'zh-CN' } });
  }
  return user;
}

export async function getJourneyData(locale: Locale) {
  const user = await getUserProfile();
  const chapters = await prisma.chapter.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      translations: true,
      lessons: {
        orderBy: { sortOrder: 'asc' },
        include: { translations: true, progress: { where: { userId: user.id } } },
      },
    },
  });

  const formatted = chapters.map((chapter) => {
    const ct = pickTranslation(chapter.translations, locale);
    const lessons = chapter.lessons.map((lesson) => {
      const lt = pickTranslation(lesson.translations, locale);
      const progress = lesson.progress[0];
      return {
        id: lesson.id,
        sortOrder: lesson.sortOrder,
        type: lesson.type,
        title: lt.title,
        subtitle: lt.subtitle,
        durationMin: lesson.durationMin,
        starReward: lesson.starReward,
        status: progress?.status ?? 'locked',
        rating: progress?.rating ?? null,
      };
    });

    const sections =
      chapter.slug === 'introduction'
        ? [{ title: locale === 'zh-CN' ? '继续探索' : 'Going Deeper', afterLessonOrder: 4 }]
        : chapter.slug === 'thinking'
          ? [{ title: locale === 'zh-CN' ? '思维训练' : 'Thinking Skills', afterLessonOrder: 4 }]
          : [];

    return {
      id: chapter.id,
      slug: chapter.slug,
      sortOrder: chapter.sortOrder,
      label: ct.label,
      title: ct.title,
      description: ct.description,
      bullets: JSON.parse(ct.bullets) as string[],
      lessons,
      sections,
    };
  });

  const firstIncomplete = formatted.find((c) =>
    c.lessons.some((l) => l.status === 'available' || l.status === 'completed'),
  );

  return {
    chapters: formatted,
    activeChapterId: firstIncomplete?.id ?? formatted[0]?.id ?? 1,
    stars: user.stars,
    locale: user.locale,
  };
}

export async function getLessonDetail(lessonId: number, locale: Locale) {
  const user = await getUserProfile();
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      translations: true,
      progress: { where: { userId: user.id } },
      chapter: { include: { lessons: { orderBy: { sortOrder: 'asc' } } } },
    },
  });

  if (!lesson) return null;

  const lt = pickTranslation(lesson.translations, locale);
  const progress = lesson.progress[0];
  const chapterLessons = lesson.chapter.lessons;
  const stepNumber = chapterLessons.findIndex((l) => l.id === lesson.id) + 1;

  return {
    id: lesson.id,
    chapterId: lesson.chapterId,
    type: lesson.type,
    title: lt.title,
    subtitle: lt.subtitle,
    durationMin: lesson.durationMin,
    content: lt.content,
    contentLength: lt.content.replace(/<[^>]+>/g, '').length,
    status: progress?.status ?? 'locked',
    stepNumber,
    starReward: lesson.starReward,
  };
}

export async function completeLesson(lessonId: number, rating: number) {
  const user = await getUserProfile();

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      chapter: {
        include: {
          lessons: { orderBy: { sortOrder: 'asc' } },
        },
      },
      progress: { where: { userId: user.id } },
    },
  });

  if (!lesson) throw new Error('Lesson not found');

  const currentProgress = lesson.progress[0];
  if (!currentProgress || currentProgress.status === 'locked') {
    throw new Error('Lesson is locked');
  }

  await prisma.userLessonProgress.update({
    where: { id: currentProgress.id },
    data: {
      status: 'completed',
      rating,
      completedAt: new Date(),
    },
  });

  let starsAdded = 0;
  if (currentProgress.status !== 'completed') {
    starsAdded = lesson.starReward;
    await prisma.userProfile.update({
      where: { id: user.id },
      data: { stars: { increment: starsAdded } },
    });
  }

  let unlockedLessonId: number | null = null;
  const chapterLessons = lesson.chapter.lessons;
  const idx = chapterLessons.findIndex((l) => l.id === lessonId);

  if (idx >= 0 && idx < chapterLessons.length - 1) {
    const nextLesson = chapterLessons[idx + 1];
    const nextProgress = await prisma.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId: nextLesson.id } },
    });
    if (nextProgress && nextProgress.status === 'locked') {
      await prisma.userLessonProgress.update({
        where: { id: nextProgress.id },
        data: { status: 'available' },
      });
      unlockedLessonId = nextLesson.id;
    }
  } else if (idx === chapterLessons.length - 1) {
    const nextChapter = await prisma.chapter.findFirst({
      where: { sortOrder: lesson.chapter.sortOrder + 1 },
      include: { lessons: { orderBy: { sortOrder: 'asc' }, take: 1 } },
    });
    if (nextChapter?.lessons[0]) {
      const first = nextChapter.lessons[0];
      const fp = await prisma.userLessonProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId: first.id } },
      });
      if (fp && fp.status === 'locked') {
        await prisma.userLessonProgress.update({
          where: { id: fp.id },
          data: { status: 'available' },
        });
        unlockedLessonId = first.id;
      }
    }
  }

  const updatedUser = await prisma.userProfile.findUnique({ where: { id: user.id } });

  return {
    lessonId,
    status: 'completed' as const,
    stars: updatedUser?.stars ?? user.stars,
    unlockedLessonId,
    starsAdded,
  };
}

export async function updateUserLocale(locale: Locale) {
  return prisma.userProfile.update({
    where: { id: 1 },
    data: { locale },
  });
}
