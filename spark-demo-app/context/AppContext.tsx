import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>('zh-CN');
  const [ready, setReady] = useState(false);
  const [fontScale, setFontScale] = useState<FontScaleKey>('md');

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
        // API 未启动时保持 zh-CN
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
