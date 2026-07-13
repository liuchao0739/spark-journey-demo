import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
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
import { pathMaxOffset, pathTranslateX } from '@/utils/pathLayout';

const SCROLL_SWITCH_OFFSET = 96;

export default function JourneyScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { ready } = useApp();
  const locale = useAppLocale();
  const scrollRef = useRef<ScrollView>(null);
  const chapterAnchors = useRef<Record<number, number>>({});
  const activeChapterRef = useRef(1);

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
      activeChapterRef.current = data.activeChapterId;
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
    chapterAnchors.current = {};
    void load();
  }, [locale, ready, load]);

  useEffect(() => {
    activeChapterRef.current = activeChapterId;
  }, [activeChapterId]);

  const chapter = useMemo(
    () => chapters.find((c) => c.id === activeChapterId) ?? chapters[0],
    [chapters, activeChapterId],
  );

  const currentLessonId = useMemo(() => {
    for (const ch of chapters) {
      const available = ch.lessons.find((l) => l.status === 'available');
      if (available) return available.id;
    }
    let lastCompleted: number | null = null;
    for (const ch of chapters) {
      for (const l of ch.lessons) {
        if (l.status === 'completed') lastCompleted = l.id;
      }
    }
    return lastCompleted ?? chapters[0]?.lessons[0]?.id ?? null;
  }, [chapters]);

  const syncChapterByScroll = useCallback(
    (scrollY: number) => {
      if (chapters.length === 0) return;

      let nextId = chapters[0].id;
      for (const ch of chapters) {
        const y = chapterAnchors.current[ch.id] ?? 0;
        if (y <= scrollY + SCROLL_SWITCH_OFFSET) nextId = ch.id;
      }

      if (nextId !== activeChapterRef.current) {
        activeChapterRef.current = nextId;
        setActiveChapterId(nextId);
      }
    },
    [chapters],
  );

  const onJourneyScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    syncChapterByScroll(e.nativeEvent.contentOffset.y);
  };

  const registerChapterAnchor = (chapterId: number) => (e: LayoutChangeEvent) => {
    chapterAnchors.current[chapterId] = e.nativeEvent.layout.y;
  };

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

  const scrollToCurrentLesson = () => {
    const y = chapterAnchors.current[activeChapterId] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 40), animated: true });
  };

  const chapterBlocks = useMemo(() => {
    const blocks: { ch: JourneyChapter; chapterIdx: number; startIndex: number }[] = [];
    let startIndex = 0;
    chapters.forEach((ch, chapterIdx) => {
      blocks.push({ ch, chapterIdx, startIndex });
      startIndex += ch.lessons.length;
    });
    return blocks;
  }, [chapters]);

  if (!ready || (!chapter && loading)) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (!chapter || chapters.length === 0) {
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
        onScroll={onJourneyScroll}
        scrollEventThrottle={16}
      >
        {chapterBlocks.map(({ ch, chapterIdx, startIndex }) => (
          <View
            key={ch.id}
            onLayout={registerChapterAnchor(ch.id)}
            style={chapterIdx > 0 ? styles.chapterGap : undefined}
          >
            {ch.lessons.map((lesson, lessonIdx) => {
              const globalIndex = startIndex + lessonIdx;
              const section = ch.sections.find((s) => s.afterLessonOrder === lesson.sortOrder);

              return (
                <View key={lesson.id}>
                  <View style={[styles.nodeRow, { paddingHorizontal: pathMaxOffset(screenWidth) + 8 }]}>
                    <Pressable onPress={() => openLesson(lesson)}>
                      <LessonNode
                        status={lesson.status}
                        type={lesson.type}
                        isCurrent={lesson.id === currentLessonId && lesson.status !== 'locked'}
                        translateX={pathTranslateX(globalIndex, screenWidth)}
                      />
                    </Pressable>
                  </View>
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
          </View>
        ))}
      </ScrollView>

      <Pressable style={styles.fab} onPress={scrollToCurrentLesson}>
        <Image
          source={
            activeChapterId === chapters[0]?.id
              ? require('@/assets/images/ui-locator-arrow-down.png')
              : require('@/assets/images/ui-locator-arrow-up.png')
          }
          style={styles.fabIcon}
        />
      </Pressable>

      <NodePopover
        visible={!!popoverLesson}
        lesson={popoverLesson}
        isCurrent={popoverLesson?.id === currentLessonId}
        onClose={() => setPopoverLesson(null)}
        onAction={goLesson}
      />

      <ChapterSheet visible={sheetOpen} chapter={chapter} onClose={() => setSheetOpen(false)} />
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
  scroll: { paddingBottom: 160, paddingTop: spacing.xs },
  chapterGap: { marginTop: spacing.xl },
  nodeRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 2,
  },
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
