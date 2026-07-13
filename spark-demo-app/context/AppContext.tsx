import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import i18n from '@/i18n';
import { api } from '@/services/api';
import { FontScaleKey, fontScales } from '@/constants/theme';

interface AppContextValue {
  locale: string;
  setLocale: (locale: string) => Promise<void>;
  fontScale: FontScaleKey;
  cycleFontScale: () => void;
  fontSize: (base: number) => number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState(i18n.language);
  const [fontScale, setFontScale] = useState<FontScaleKey>('md');

  const setLocale = useCallback(async (next: string) => {
    await i18n.changeLanguage(next);
    setLocaleState(next);
    try {
      await api.updateLocale(next);
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
    () => ({ locale, setLocale, fontScale, cycleFontScale, fontSize }),
    [locale, setLocale, fontScale, cycleFontScale, fontSize],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
