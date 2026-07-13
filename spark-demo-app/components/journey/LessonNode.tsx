import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import type { LessonStatus } from '@/services/api';

const assets = {
  active: require('@/assets/images/node-base-active.png'),
  activePressed: require('@/assets/images/node-base-active-pressed.png'),
  locked: require('@/assets/images/node-base-locked.png'),
  lockedPressed: require('@/assets/images/node-base-locked-pressed.png'),
  innerCompleted: require('@/assets/images/node-inner-completed.png'),
  innerPending: require('@/assets/images/node-inner-pending.png'),
  innerHighlight: require('@/assets/images/node-inner-highlight.png'),
  outerCompleted: require('@/assets/images/node-outer-completed.png'),
  outerPending: require('@/assets/images/node-outer-pending.png'),
  iconLesson: require('@/assets/images/node-icon-lesson.png'),
  iconPractice: require('@/assets/images/node-icon-practice.png'),
  iconLocked: require('@/assets/images/node-icon-locked.png'),
  bookCompleted: require('@/assets/images/node-book-completed.png'),
  bookPending: require('@/assets/images/node-book-pending.png'),
};

interface LessonNodeProps {
  status: LessonStatus;
  type: string;
  isCurrent?: boolean;
  offset: 'left' | 'center' | 'right';
}

export function LessonNode({ status, type, isCurrent, offset }: LessonNodeProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  const base: ImageSourcePropType = isLocked ? assets.locked : assets.active;
  const outer: ImageSourcePropType = isCompleted ? assets.outerCompleted : assets.outerPending;
  const inner: ImageSourcePropType = isCurrent
    ? assets.innerHighlight
    : isCompleted
      ? assets.innerCompleted
      : assets.innerPending;

  let icon: ImageSourcePropType = assets.iconLesson;
  if (isLocked) icon = assets.iconLocked;
  else if (type === 'practice') icon = assets.iconPractice;

  return (
    <View style={[styles.wrap, offset === 'left' && styles.left, offset === 'right' && styles.right]}>
      {isCurrent && <View style={styles.sparkle} />}
      <Image source={outer} style={styles.outer} resizeMode="contain" />
      <Image source={base} style={styles.base} resizeMode="contain" />
      <Image source={inner} style={styles.inner} resizeMode="contain" />
      <Image source={icon} style={styles.icon} resizeMode="contain" />
    </View>
  );
}

const NODE = 88;

const styles = StyleSheet.create({
  wrap: {
    width: NODE + 20,
    height: NODE + 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 8,
  },
  left: { alignSelf: 'flex-start', marginLeft: 48 },
  right: { alignSelf: 'flex-end', marginRight: 48 },
  outer: { position: 'absolute', width: NODE + 16, height: NODE + 16 },
  base: { position: 'absolute', width: NODE, height: NODE },
  inner: { position: 'absolute', width: NODE - 18, height: NODE - 18 },
  icon: { width: 28, height: 28 },
  sparkle: {
    position: 'absolute',
    top: 4,
    right: 18,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4fc3f7',
    zIndex: 2,
  },
});
