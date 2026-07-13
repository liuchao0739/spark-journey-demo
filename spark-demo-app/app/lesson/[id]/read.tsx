import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LessonTopBar } from '@/components/lesson/LessonComponents';
import { useApp } from '@/context/AppContext';
import { api, LessonDetail } from '@/services/api';
import { colors, spacing } from '@/constants/theme';
import { splitContentPages } from '@/utils/locale';

export default function LessonReadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { locale, fontSize, cycleFontScale } = useApp();
  const { width } = useWindowDimensions();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    setPageIndex(0);
    void api.getLesson(Number(id), locale).then(setLesson);
  }, [id, locale]);

  const pages = useMemo(
    () => (lesson ? splitContentPages(lesson.content) : []),
    [lesson],
  );

  const isLastPage = pageIndex >= pages.length - 1;
  const progress = pages.length > 1 ? (pageIndex + 1) / pages.length : 1;

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  const baseFont = fontSize(16);

  const onPrimary = () => {
    if (isLastPage) {
      router.push(`/lesson/${id}/complete`);
    } else {
      setPageIndex((p) => p + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LessonTopBar
        progress={progress}
        onClose={() => router.back()}
        onFontPress={cycleFontScale}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RenderHtml
          contentWidth={width - spacing.lg * 2}
          source={{ html: pages[pageIndex] ?? '' }}
          baseStyle={{
            color: colors.text,
            fontSize: baseFont,
            lineHeight: baseFont * 1.6,
          }}
          tagsStyles={{
            h2: {
              color: colors.text,
              fontSize: fontSize(22),
              fontWeight: '700',
              marginTop: 8,
              marginBottom: 12,
            },
            p: { marginBottom: 14, color: colors.text },
            li: { color: colors.text, marginBottom: 8 },
            strong: { color: colors.text, fontWeight: '700' },
            em: { fontStyle: 'italic', color: colors.textMuted },
          }}
        />
      </ScrollView>
      <Pressable style={styles.button} onPress={onPrimary}>
        <Text style={styles.buttonText}>
          {isLastPage ? t('lesson.completeSession') : t('lesson.continue')}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, flexGrow: 1 },
  button: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: colors.text, fontSize: 17, fontWeight: '800' },
});
