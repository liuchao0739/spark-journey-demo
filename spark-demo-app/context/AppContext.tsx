import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { api } from '@/services/api';
import { FontScaleKey, fontScales } from '@/constants/theme';
import { AppLocale, normalizeLocale } from '@/utils/locale';

interface AppContextValue {
  locale: AppLocale;
  ready: boolean;
  setLocale: (locale: AppLocale) => Promise<void>;
  fontScale: FontScaleKey;
  cycleFontScale: () => void;
  fontSize: (base: number) => number;
}

const AppContext = createContext<AppContextValue | null>(null);

let localeListeners: Array<(locale: AppLocale) => void> = [];

function notifyLocale(locale: AppLocale) {
  localeListeners.forEach((fn) => fn(locale));
}

i18n.on('languageChanged', (lng) => {
  notifyLocale(normalizeLocale(lng));
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(normalizeLocale(i18n.language));
  const [ready, setReady] = useState(false);
  const [fontScale, setFontScale] = useState<FontScaleKey>('md');

  useEffect(() => {
    const sync = (next: AppLocale) => setLocaleState(next);
    localeListeners.push(sync);
    return () => {
      localeListeners = localeListeners.filter((fn) => fn !== sync);
    };
  }, []);

  useEffect(() => {
    void (async () => {
      const boot = normalizeLocale(i18n.language);
      await i18n.changeLanguage(boot);
      setLocaleState(boot);
      try {
        const profile = await api.getProfile(boot);
        const saved = normalizeLocale(profile.locale);
        if (saved !== boot) {
          await i18n.changeLanguage(saved);
          setLocaleState(saved);
        }
      } catch {
        // API 未启动时保持当前语言
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setLocale = useCallback(async (next: AppLocale) => {
    const normalized = normalizeLocale(next);
    await i18n.changeLanguage(normalized);
    setLocaleState(normalized);
    try {
      await api.updateLocale(normalized);
    } catch {
      // offline demo still works with local i18n
    }
  }, []);

  const cycleFontScale = useCallback(() => {
    setFontScale((prev) => (prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'sm'));
  }, []);

  const fontSize = useCallback(
    (base: number) => Math.round(base * fontScales[fontScale]),
    [fontScale],
  );

  const value = useMemo(
    () => ({ locale, ready, setLocale, fontScale, cycleFontScale, fontSize }),
    [locale, ready, setLocale, fontScale, cycleFontScale, fontSize],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

/** API 与 UI 统一使用 i18n 当前语言 */
export function useAppLocale(): AppLocale {
  const { i18n: i18nInstance } = useTranslation();
  return normalizeLocale(i18nInstance.language);
}
