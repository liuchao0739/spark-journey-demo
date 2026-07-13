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
  isCurrent?: boolean;
  onClose: () => void;
  onAction: () => void;
}

export function NodePopover({ visible, lesson, isCurrent, onClose, onAction }: NodePopoverProps) {
  const { t } = useTranslation();
  if (!lesson) return null;

  const actionLabel =
    lesson.status === 'completed' || isCurrent
      ? t('journey.continue')
      : t('journey.start');

  const subtitle =
    lesson.subtitle ??
    (lesson.type === 'practice' ? t('journey.practice') : t('journey.reading'));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.popoverAnchor} pointerEvents="box-none">
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>{lesson.title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <Pressable style={styles.button} onPress={onAction}>
              <Text style={styles.buttonText}>{actionLabel}</Text>
            </Pressable>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

interface ChapterSheetProps {
  visible: boolean;
  chapter: JourneyChapter | null;
  onClose: () => void;
}

export function ChapterSheet({ visible, chapter, onClose }: ChapterSheetProps) {
  const { t } = useTranslation();
  if (!chapter) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.sheetChapter}>{chapter.label}</Text>
          <Text style={styles.sheetTitle}>{chapter.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.explore}>{t('journey.exploreTitle')}</Text>
          <ScrollView style={styles.bulletScroll} showsVerticalScrollIndicator={false}>
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
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  popoverAnchor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: 72,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', lineHeight: 28 },
  subtitle: { color: colors.textMuted, fontSize: 14, marginBottom: spacing.sm },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 28,
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
    maxHeight: '56%',
    minHeight: 280,
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
  bulletScroll: { maxHeight: 200 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  bulletText: { color: colors.text, fontSize: 15, flex: 1, lineHeight: 22 },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerInner: { padding: spacing.md },
  labelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  labelText: { color: colors.text, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: colors.text, fontSize: 24, fontWeight: '700', flex: 1 },
  chevron: { width: 16, height: 16, tintColor: colors.textMuted },
});
