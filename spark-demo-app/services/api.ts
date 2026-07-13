import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { AppLocale, normalizeLocale } from '@/utils/locale';

function getDefaultApiUrl() {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api/v1';
  }
  return 'http://localhost:3000/api/v1';
}

export const API_BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? getDefaultApiUrl();

export type LessonStatus = 'locked' | 'available' | 'completed';

export interface JourneyLesson {
  id: number;
  sortOrder: number;
  type: string;
  title: string;
  subtitle?: string | null;
  durationMin: number;
  starReward: number;
  status: LessonStatus;
  rating?: number | null;
}

export interface JourneyChapter {
  id: number;
  slug: string;
  sortOrder: number;
  label: string;
  title: string;
  description?: string | null;
  bullets: string[];
  lessons: JourneyLesson[];
  sections: { title: string; afterLessonOrder: number }[];
}

export interface JourneyData {
  chapters: JourneyChapter[];
  activeChapterId: number;
  stars: number;
  locale: string;
}

export interface LessonDetail {
  id: number;
  chapterId: number;
  type: string;
  title: string;
  subtitle?: string | null;
  durationMin: number;
  content: string;
  contentLength: number;
  status: LessonStatus;
  stepNumber: number;
  starReward: number;
}

async function request<T>(path: string, options: RequestInit & { locale?: string } = {}): Promise<T> {
  const { locale, headers, ...rest } = options;
  const loc = normalizeLocale(locale);
  const sep = path.includes('?') ? '&' : '?';
  const url = `${API_BASE_URL}${path}${sep}locale=${loc}`;

  const res = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': loc,
      ...headers,
    },
  });

  const json = await res.json();
  if (!res.ok || json.code !== 0) {
    throw new Error(json.message || 'Request failed');
  }
  return json.data as T;
}

export const api = {
  getJourney: (locale: string) => request<JourneyData>(`/journey?locale=${locale}`),
  getLesson: (id: number, locale: string) =>
    request<LessonDetail>(`/lessons/${id}?locale=${locale}`),
  completeLesson: (id: number, rating: number, locale: string) =>
    request<{ stars: number; unlockedLessonId: number | null }>(`/lessons/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
      locale,
    }),
  updateLocale: (locale: string) =>
    request<{ locale: string }>('/user/locale', {
      method: 'PATCH',
      body: JSON.stringify({ locale }),
      locale,
    }),
  getProfile: (locale: string) =>
    request<{ stars: number; locale: string }>(`/user/profile?locale=${locale}`),
};
