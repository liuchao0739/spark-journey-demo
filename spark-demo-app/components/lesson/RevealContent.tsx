import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { colors, spacing } from '@/constants/theme';

interface HtmlBlockProps {
  html: string;
  baseFont: number;
  headingFont: number;
}

function HtmlBlock({ html, baseFont, headingFont }: HtmlBlockProps) {
  const { width } = useWindowDimensions();
  return (
    <RenderHtml
      contentWidth={width - spacing.lg * 2}
      source={{ html }}
      baseStyle={{
        color: colors.text,
        fontSize: baseFont,
        lineHeight: baseFont * 1.6,
      }}
      tagsStyles={{
        h2: {
          color: colors.text,
          fontSize: headingFont,
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
  );
}

interface RevealSectionProps extends HtmlBlockProps {
  animate: boolean;
  onAnimated?: () => void;
}

/** 新段落自上而下展开 */
function RevealSection({ animate, onAnimated, ...htmlProps }: RevealSectionProps) {
  const [measured, setMeasured] = useState(0);
  const height = useRef(new Animated.Value(animate ? 0 : 9999)).current;
  const opacity = useRef(new Animated.Value(animate ? 0.3 : 1)).current;

  useEffect(() => {
    if (!animate || measured <= 0) return;
    height.setValue(0);
    opacity.setValue(0.35);
    Animated.parallel([
      Animated.timing(height, {
        toValue: measured,
        duration: 560,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onAnimated?.();
    });
  }, [animate, measured, height, opacity, onAnimated]);

  if (!animate) {
    return (
      <View style={styles.section}>
        <HtmlBlock {...htmlProps} />
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View
        style={styles.measure}
        onLayout={(e) => setMeasured(e.nativeEvent.layout.height)}
        pointerEvents="none"
      >
        <HtmlBlock {...htmlProps} />
      </View>
      {measured > 0 && (
        <Animated.View style={{ overflow: 'hidden', height, opacity }}>
          <HtmlBlock {...htmlProps} />
        </Animated.View>
      )}
    </View>
  );
}

interface LessonRevealContentProps {
  sections: string[];
  revealedCount: number;
  revealingIndex: number | null;
  baseFont: number;
  headingFont: number;
  onSectionExpanded?: () => void;
}

export function LessonRevealContent({
  sections,
  revealedCount,
  revealingIndex,
  baseFont,
  headingFont,
  onSectionExpanded,
}: LessonRevealContentProps) {
  return (
    <View style={styles.content}>
      {sections.slice(0, revealedCount).map((html, index) => (
        <RevealSection
          key={`${index}-${html.slice(0, 24)}`}
          html={html}
          baseFont={baseFont}
          headingFont={headingFont}
          animate={revealingIndex === index}
          onAnimated={revealingIndex === index ? onSectionExpanded : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  section: { marginBottom: spacing.sm },
  measure: { position: 'absolute', opacity: 0, left: 0, right: 0, zIndex: -1 },
});
