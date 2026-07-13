import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

const faces = ['😠', '😕', '😐', '🙂', '😍'];

interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <View style={styles.row}>
      {faces.map((face, i) => {
        const score = i + 1;
        const active = value === score;
        return (
          <Pressable key={score} onPress={() => onChange(score)} style={styles.star}>
            <Text style={[styles.face, active && styles.faceActive]}>{face}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface LessonTopBarProps {
  progress: number;
  onClose: () => void;
  onFontPress: () => void;
}

export function LessonTopBar({ progress, onClose, onFontPress }: LessonTopBarProps) {
  return (
    <View style={styles.bar}>
      <Pressable onPress={onClose} hitSlop={12}>
        <Text style={styles.close}>✕</Text>
      </Pressable>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(100, progress * 100)}%` }]} />
      </View>
      <Pressable onPress={onFontPress} hitSlop={12}>
        <Text style={styles.fontBtn}>Aa</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 16 },
  star: { padding: 4 },
  face: { fontSize: 32, opacity: 0.45 },
  faceActive: { opacity: 1, transform: [{ scale: 1.15 }] },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  close: { color: colors.text, fontSize: 22, width: 28 },
  fontBtn: { color: colors.text, fontSize: 18, fontWeight: '700', width: 28, textAlign: 'right' },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
});
