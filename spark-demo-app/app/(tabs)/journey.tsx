import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChapterHeader, ChapterSheet, NodePopover } from '@/components/journey/JourneyComponents';
import { LessonNode } from '@/components/journey/LessonNode';
import { useApp, useAppLocale } from '@/context/AppContext';
import { api, JourneyChapter, JourneyLesson } from '@/services/api';
import { colors, spacing } from '@/constants/theme';

const offsets: Array<'left' | 'center' | 'right'> = [
  'center',
  'right',
  'left',
  'center',
  'right',
  'left',
  'center',
];

export default function JourneyScreen() {
  const router = useRouter();
  const { ready } = useApp();
  const locale = useAppLocale();
  const scrollRef = useRef<ScrollView>(null);

  const [chapters, setChapters] = useState<JourneyChapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState(1);
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [popoverLesson, setPopoverLesson] = useState<JourneyLesson | null>(null);

  const load = useCallback(async () => {
    if (!ready) return;
    try {
      const data = await api.getJourney(locale);
      setChapters(data.chapters);
      setActiveChapterId(data.activeChapterId);
      setStars(data.stars);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [locale, ready]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  useEffect(() => {
    if (!ready) return;
    setChapters([]);
    setSheetOpen(false);
    setPopoverLesson(null);
    setLoading(true);
    void load();
  }, [locale, ready, load]);

  const chapter = useMemo(
    () => chapters.find((c) => c.id === activeChapterId) ?? chapters[0],
    [chapters, activeChapterId],
  );

  const currentLessonId = useMemo(() => {
    if (!chapter) return null;
    const available = chapter.lessons.find((l) => l.status === 'available');
    if (available) return available.id;
    const completed = [...chapter.lessons].reverse().find((l) => l.status === 'completed');
    return completed?.id ?? chapter.lessons[0]?.id ?? null;
  }, [chapter]);

  const openLesson = (lesson: JourneyLesson) => {
    if (lesson.status === 'locked') return;
    setPopoverLesson(lesson);
  };

  const goLesson = () => {
    if (!popoverLesson) return;
    const id = popoverLesson.id;
    setPopoverLesson(null);
    router.push(`/lesson/${id}/intro`);
  };

  if (!ready || (!chapter && loading)) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (!chapter) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>无法加载数据，请确认后端已启动</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView key={locale} style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <View />
        <View style={styles.starBadge}>
          <Text style={styles.starCount}>{stars}</Text>
          <Image source={require('@/assets/images/ui-star.png')} style={styles.starIcon} />
        </View>
      </View>

      <ChapterHeader chapter={chapter} onPress={() => setSheetOpen(true)} />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {chapter.lessons.map((lesson, index) => {
          const section = chapter.sections.find((s) => s.afterLessonOrder === lesson.sortOrder);
          return (
            <View key={lesson.id} style={styles.nodeRow}>
              <Pressable onPress={() => openLesson(lesson)}>
                <LessonNode
                  status={lesson.status}
                  type={lesson.type}
                  isCurrent={lesson.id === currentLessonId && lesson.status !== 'locked'}
                  offset={offsets[index % offsets.length]}
                />
              </Pressable>
              {section && (
                <View style={styles.sectionRow}>
                  <View style={styles.sectionLine} />
                  <Text style={styles.sectionText}>{section.title}</Text>
                  <View style={styles.sectionLine} />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <Image source={require('@/assets/images/ui-locator-arrow-down.png')} style={styles.fabIcon} />
      </Pressable>

      <NodePopover
        visible={!!popoverLesson}
        lesson={popoverLesson}
        isCurrent={popoverLesson?.id === currentLessonId}
        onClose={() => setPopoverLesson(null)}
        onAction={goLesson}
      />

      <ChapterSheet
        visible={sheetOpen}
        chapters={chapters}
        activeChapterId={activeChapterId}
        onActiveChapterChange={setActiveChapterId}
        onClose={() => setSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { color: colors.textMuted, textAlign: 'center', marginTop: 80 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  starCount: { color: colors.text, fontWeight: '700', fontSize: 15 },
  starIcon: { width: 18, height: 18 },
  scroll: { paddingBottom: 140, paddingTop: spacing.xs },
  nodeRow: { marginBottom: spacing.xs },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: colors.border },
  sectionText: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: 12,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fabIcon: { width: 20, height: 20, tintColor: colors.text },
});
