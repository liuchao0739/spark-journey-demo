import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
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

const NODE = 96;

/** 参考 demo：节点顶部一小簇大小不一的星星，小范围自转闪烁 */
function SparkleCluster() {
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    spinLoop.start();
    pulseLoop.start();
    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [rotation, pulse]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const mainOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 1],
  });
  const sideOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.55],
  });
  const mainScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.08],
  });

  return (
    <Animated.View
      style={[styles.cluster, { transform: [{ rotate: spin }] }]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          styles.sparkleMain,
          { opacity: mainOpacity, transform: [{ scale: mainScale }] },
        ]}
      >
        <View style={styles.starArmV} />
        <View style={styles.starArmH} />
      </Animated.View>
      <Animated.View style={[styles.sparkleDot, styles.dotTopRight, { opacity: sideOpacity }]} />
      <Animated.View style={[styles.sparkleDot, styles.dotBottom, { opacity: mainOpacity }]} />
    </Animated.View>
  );
}

interface LessonNodeProps {
  status: LessonStatus;
  type: string;
  isCurrent?: boolean;
  translateX?: number;
}

export function LessonNode({ status, type, isCurrent, translateX = 0 }: LessonNodeProps) {
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
    <View style={[styles.wrap, { transform: [{ translateX }] }]}>
      {isCurrent && <SparkleCluster />}
      <Image source={outer} style={styles.outer} resizeMode="contain" />
      <Image source={base} style={styles.base} resizeMode="contain" />
      <Image source={inner} style={styles.inner} resizeMode="contain" />
      <Image source={icon} style={styles.icon} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: NODE + 24,
    height: NODE + 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  cluster: {
    position: 'absolute',
    top: -2,
    right: 14,
    width: 28,
    height: 28,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleMain: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starArmV: {
    position: 'absolute',
    width: 4,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#5ec8f2',
  },
  starArmH: {
    position: 'absolute',
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5ec8f2',
  },
  sparkleDot: {
    position: 'absolute',
    backgroundColor: '#7dd3f5',
    borderRadius: 5,
  },
  dotTopRight: {
    width: 6,
    height: 6,
    top: 1,
    right: 0,
  },
  dotBottom: {
    width: 4,
    height: 4,
    bottom: 2,
    left: 2,
  },
  outer: { position: 'absolute', width: NODE + 18, height: NODE + 18 },
  base: { position: 'absolute', width: NODE, height: NODE },
  inner: { position: 'absolute', width: NODE - 20, height: NODE - 20 },
  icon: { width: 30, height: 30 },
});
