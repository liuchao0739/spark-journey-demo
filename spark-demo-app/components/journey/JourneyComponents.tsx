import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '@/constants/theme';
import type { JourneyChapter, JourneyLesson } from '@/services/api';

interface NodePopoverProps {
  visible: boolean;
  lesson: JourneyLesson | null;
  onClose: () => void;
  onAction: () => void;
}

export function NodePopover({ visible, lesson, onClose, onAction }: NodePopoverProps) {
  const { t } = useTranslation();
  if (!lesson) return null;

  const actionLabel =
    lesson.status === 'completed' ? t('journey.continue') : t('journey.start');
  const typeLabel =
    lesson.type === 'practice' ? t('journey.practice') : t('journey.reading');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.subtitle}>{typeLabel}</Text>
          <Pressable style={styles.button} onPress={onAction}>
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface ChapterSheetProps {
  visible: boolean;
  chapter: JourneyChapter | null;
  chapters: JourneyChapter[];
  onSelectChapter: (id: number) => void;
  onClose: () => void;
}

export function ChapterSheet({
  visible,
  chapter,
  chapters,
  onSelectChapter,
  onClose,
}: ChapterSheetProps) {
  const { t } = useTranslation();
  if (!chapter) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chapterTabs}>
            {chapters.map((c) => (
              <Pressable
                key={c.id}
                style={[styles.chapterTab, c.id === chapter.id && styles.chapterTabActive]}
                onPress={() => onSelectChapter(c.id)}
              >
                <Text style={styles.chapterTabText}>{c.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={styles.sheetChapter}>{chapter.label}</Text>
          <Text style={styles.sheetTitle}>{chapter.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.explore}>{t('journey.exploreTitle')}</Text>
          <ScrollView style={styles.bulletScroll}>
            {chapter.bullets.map((b) => (
              <View key={b} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface ChapterHeaderProps {
  chapter: JourneyChapter;
  onPress: () => void;
}

export function ChapterHeader({ chapter, onPress }: ChapterHeaderProps) {
  return (
    <Pressable style={styles.headerCard} onPress={onPress}>
      <View style={styles.headerInner}>
        <View style={styles.labelBadge}>
          <Text style={styles.labelText}>{chapter.label}</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{chapter.title}</Text>
          <Image
            source={require('@/assets/images/ui-chevron-small.png')}
            style={styles.chevron}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 340,
    gap: spacing.sm,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', lineHeight: 26 },
  subtitle: { color: colors.textMuted, fontSize: 14, marginBottom: spacing.sm },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  sheetBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    minHeight: 320,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginBottom: spacing.md,
  },
  sheetChapter: { color: colors.textMuted, fontSize: 13 },
  sheetTitle: { color: colors.text, fontSize: 24, fontWeight: '700', marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  explore: { color: colors.textMuted, fontSize: 15, marginBottom: spacing.sm },
  bulletScroll: { maxHeight: 180 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  bulletText: { color: colors.text, fontSize: 15, flex: 1, lineHeight: 22 },
  chapterTabs: { marginBottom: spacing.md },
  chapterTab: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chapterTabActive: { borderColor: colors.primary, backgroundColor: 'rgba(88,204,2,0.12)' },
  chapterTabText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  headerInner: { padding: spacing.md },
  labelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  labelText: { color: colors.text, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: colors.text, fontSize: 22, fontWeight: '700', flex: 1 },
  chevron: { width: 16, height: 16, tintColor: colors.textMuted },
});
