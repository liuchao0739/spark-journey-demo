import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LessonTopBar } from '@/components/lesson/LessonComponents';
import { LessonRevealContent } from '@/components/lesson/RevealContent';
import { useApp, useAppLocale } from '@/context/AppContext';
import { api, LessonDetail } from '@/services/api';
import { colors, spacing } from '@/constants/theme';
import { splitContentPages } from '@/utils/locale';

const LOADING_MS = 400;

type RevealPhase = 'idle' | 'loading' | 'expanding';

export default function LessonReadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { fontSize, cycleFontScale } = useApp();
  const locale = useAppLocale();
  const scrollRef = useRef<ScrollView>(null);

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [revealedCount, setRevealedCount] = useState(1);
  const [revealingIndex, setRevealingIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<RevealPhase>('idle');

  useEffect(() => {
    if (!id) return;
    setRevealedCount(1);
    setRevealingIndex(null);
    setPhase('idle');
    void api.getLesson(Number(id), locale).then(setLesson);
  }, [id, locale]);

  const sections = useMemo(
    () => (lesson ? splitContentPages(lesson.content) : []),
    [lesson],
  );

  const isLastSection = revealedCount >= sections.length;
  const progress = sections.length > 0 ? revealedCount / sections.length : 0;
  const busy = phase !== 'idle';

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;
    const timer = setTimeout(() => {
      const nextIndex = revealedCount;
      setRevealedCount((c) => c + 1);
      setRevealingIndex(nextIndex);
      setPhase('expanding');
    }, LOADING_MS);
    return () => clearTimeout(timer);
  }, [phase, revealedCount]);

  const onSectionExpanded = useCallback(() => {
    setRevealingIndex(null);
    setPhase('idle');
    scrollToEnd();
  }, [scrollToEnd]);

  const onPrimary = () => {
    if (busy) return;
    if (isLastSection) {
      router.push(`/lesson/${id}/complete`);
      return;
    }
    setPhase('loading');
    scrollToEnd();
  };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  const baseFont = fontSize(16);

  return (
    <SafeAreaView style={styles.container}>
      <LessonTopBar
        progress={progress}
        onClose={() => router.back()}
        onFontPress={cycleFontScale}
      />
      <View style={styles.body}>
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LessonRevealContent
            sections={sections}
            revealedCount={revealedCount}
            revealingIndex={revealingIndex}
            baseFont={baseFont}
            headingFont={fontSize(22)}
            onSectionExpanded={onSectionExpanded}
          />
          {phase === 'loading' && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </ScrollView>
      </View>
      <Pressable
        style={[styles.button, busy && styles.buttonDisabled]}
        onPress={onPrimary}
        disabled={busy}
      >
        <Text style={styles.buttonText}>
          {isLastSection ? t('lesson.completeSession') : t('lesson.continue')}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: spacing.md },
  loadingRow: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  button: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { color: colors.text, fontSize: 17, fontWeight: '800' },
});
