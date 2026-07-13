/**
 * 参考 demo 的 S 形蜿蜒路径：连续水平偏移（像素），非离散左/中/右三档。
 * 模式：中 → 缓右 → 最右 → 回中偏左 → 最左 → 回中偏右 → 中 ...
 */
const PATH_OFFSETS_PX = [
  0,
  44,
  88,
  52,
  12,
  -64,
  -96,
  -56,
  -16,
  36,
  80,
  48,
  8,
  -72,
  -104,
  -48,
  0,
];

const MAX_OFFSET = 104;

export function pathTranslateX(index: number, screenWidth: number): number {
  const base = PATH_OFFSETS_PX[index % PATH_OFFSETS_PX.length];
  const scale = Math.min(screenWidth / 390, 1.15);
  return Math.round(base * scale);
}

export function pathMaxOffset(screenWidth: number): number {
  const scale = Math.min(screenWidth / 390, 1.15);
  return Math.round(MAX_OFFSET * scale);
}
