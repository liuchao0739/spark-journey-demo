import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, useAppLocale } from '@/context/AppContext';
import { AppLocale } from '@/utils/locale';
import { api } from '@/services/api';
import { colors, spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { setLocale } = useApp();
  const locale = useAppLocale();
  const [stars, setStars] = useState(0);

  const load = useCallback(async () => {
    try {
      const profile = await api.getProfile(locale);
      setStars(profile.stars);
    } catch {
      setStars(0);
    }
  }, [locale]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('tabs.profile')}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>{t('profile.stars')}</Text>
        <Text style={styles.value}>⭐ {stars}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>{t('profile.language')}</Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.langBtn, locale === 'en-US' && styles.langActive]}
            onPress={() => setLocale('en-US')}
          >
            <Text style={styles.langText}>{t('profile.english')}</Text>
          </Pressable>
          <Pressable
            style={[styles.langBtn, locale === 'zh-CN' && styles.langActive]}
            onPress={() => setLocale('zh-CN')}
          >
            <Text style={styles.langText}>{t('profile.chinese')}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: '700', marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  label: { color: colors.textMuted, fontSize: 14, marginBottom: spacing.sm },
  value: { color: colors.text, fontSize: 24, fontWeight: '700' },
  row: { flexDirection: 'row', gap: spacing.sm },
  langBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  langActive: { borderColor: colors.primary, backgroundColor: 'rgba(88,204,2,0.12)' },
  langText: { color: colors.text, fontSize: 15, fontWeight: '600' },
});
