import type { Request } from 'express';

export const SUPPORTED_LOCALES = ['en-US', 'zh-CN'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function resolveLocale(req: Request): Locale {
  const queryLocale = req.query.locale as string | undefined;
  if (queryLocale && SUPPORTED_LOCALES.includes(queryLocale as Locale)) {
    return queryLocale as Locale;
  }

  const header = req.headers['accept-language'];
  if (typeof header === 'string') {
    if (header.includes('zh')) return 'zh-CN';
    if (header.includes('en')) return 'en-US';
  }

  return 'en-US';
}

export function pickTranslation<T extends { locale: string }>(
  translations: T[],
  locale: Locale,
): T {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === 'en-US') ??
    translations[0]
  );
}
