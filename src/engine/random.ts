// 启动时随机生成隐藏的真实浓度

/**
 * 在 [0.0450, 0.0650] 范围内生成一个随机浓度，保留 4 位小数
 */
export function generateHiddenConcentration(): number {
  const v = 0.0450 + Math.random() * 0.0200;
  return Math.round(v * 10000) / 10000;
}