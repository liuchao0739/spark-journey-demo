import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LessonTopBar } from '@/components/lesson/LessonComponents';
import { useApp } from '@/context/AppContext';
import { api, LessonDetail } from '@/services/api';
import { colors, spacing } from '@/constants/theme';

export default function LessonIntroScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { locale, fontSize } = useApp();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    void api.getLesson(Number(id), locale).then(setLesson);
  }, [id, locale]);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LessonTopBar progress={0} onClose={() => router.back()} onFontPress={() => {}} />
      <View style={styles.body}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{String(lesson.stepNumber).padStart(2, '0')}</Text>
        </View>
        <View style={styles.durationPill}>
          <Text style={styles.durationText}>🕒 {t('lesson.mins', { count: lesson.durationMin })}</Text>
        </View>
        <Text style={[styles.title, { fontSize: fontSize(26), lineHeight: fontSize(34) }]}>
          {lesson.title}
        </Text>
        {lesson.subtitle && <Text style={styles.subtitle}>{lesson.subtitle.toUpperCase()}</Text>}
      </View>
      <Pressable style={styles.button} onPress={() => router.push(`/lesson/${id}/read`)}>
        <Text style={styles.buttonText}>{t('lesson.startSession')}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'center', gap: spacing.md },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.text, fontSize: 20, fontWeight: '800' },
  durationPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  durationText: { color: colors.textMuted, fontSize: 13 },
  title: { color: colors.text, fontWeight: '800' },
  subtitle: { color: colors.textDim, fontSize: 13, letterSpacing: 1 },
  button: {
    margin: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: colors.text, fontSize: 17, fontWeight: '800' },
});
