import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { StarRating } from '@/components/lesson/LessonComponents';
import { useAppLocale } from '@/context/AppContext';
import { api } from '@/services/api';
import { colors, spacing } from '@/constants/theme';

export default function LessonCompleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const locale = useAppLocale();
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const onContinue = async () => {
    if (!id || submitting) return;
    setSubmitting(true);
    try {
      await api.completeLesson(Number(id), rating, locale);
      router.replace('/(tabs)/journey');
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.close} onPress={() => router.replace('/(tabs)/journey')}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <View style={styles.body}>
        <Image source={require('@/assets/images/ui-confirm-icon.png')} style={styles.icon} />
        <Text style={styles.title}>{t('lesson.sessionComplete')}</Text>
        <Text style={styles.desc}>{t('lesson.sessionCompleteDesc')}</Text>
        <Text style={styles.rate}>{t('lesson.rateExperience')}</Text>
        <StarRating value={rating} onChange={setRating} />
      </View>

      <Pressable style={styles.button} onPress={onContinue} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.buttonText}>{t('lesson.continue')}</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  close: { padding: spacing.lg },
  closeText: { color: colors.text, fontSize: 22 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  icon: { width: 80, height: 80, marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: spacing.sm },
  desc: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  rate: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.sm },
  button: {
    margin: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: colors.text, fontSize: 17, fontWeight: '800' },
});
