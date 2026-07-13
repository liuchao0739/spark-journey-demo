export type AppLocale = 'zh-CN' | 'en-US';

export function normalizeLocale(locale?: string | null): AppLocale {
  if (!locale) return 'zh-CN';
  if (locale.startsWith('zh')) return 'zh-CN';
  return 'en-US';
}

/** 按 h2 标题拆分为分页内容 */
export function splitContentPages(html: string): string[] {
  const trimmed = html.trim();
  if (!trimmed) return [''];

  const parts = trimmed.split(/(?=<h2>)/i).map((p) => p.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [trimmed];
}
