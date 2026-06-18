// 物理引擎：pH 与颜色计算（纯函数）
import {
  WINE_RED,
  PURPLE,
  CLEAR_BLUE,
  HOT_PINK,
  DEEP_BLUE,
  BUFFER_GREEN,
  type StatusText,
  type Stage,
} from '@/types';

/**
 * 计算 pH 值（权威公式）
 * - 缓冲液开启 → 死死锁定 10.0
 * - 缓冲液关闭 + volume=0 → 7.0
 * - 缓冲液关闭 + volume>0 → 对数衰减至 3.5 下限
 */
export function computePH(volume: number, bufferEnabled: boolean): number {
  if (bufferEnabled) return 10.0;
  if (volume <= 0) return 7.0;
  return Math.max(3.5, 7.0 - Math.log10(volume * 10 + 1) * 2.5);
}

/**
 * 计算锥形瓶液体颜色 HEX
 * 优先级：pH<6.5（粉色锁死）> 缓冲液开启（理想路径）> 体积驱动
 */
export function computeColor(
  volume: number,
  bufferEnabled: boolean,
  pH: number,
): string {
  if (!bufferEnabled && pH < 6.5) {
    return HOT_PINK; // 指示剂失效锁死
  }
  if (bufferEnabled) {
    if (volume < 19.5) return WINE_RED;
    if (volume < 20.0) return PURPLE;
    // Stage 1 过量时给深蓝作为视觉警示
    if (volume >= 20.5) return DEEP_BLUE;
    return CLEAR_BLUE;
  }
  // 缓冲液关闭但 pH 还在线上
  if (volume < 20.0) return WINE_RED;
  return CLEAR_BLUE;
}

/**
 * Stage 1：是否过量（>20.5 mL 视为过量滴定）
 */
export function isStage1Overshot(volume: number): boolean {
  return volume >= 20.5;
}

/**
 * Stage 1：是否进入末端微调区（19.5 <= volume < 20.5）
 */
export function isStage1NearEndpoint(volume: number): boolean {
  return volume >= 19.5 && volume < 20.5;
}

/**
 * Stage 1：是否到达终点（19.95 <= volume < 20.5）
 * 使用 0.05 步长精确落入 [19.95, 20.5)
 */
export function isStage1AtEndpoint(volume: number): boolean {
  return volume >= 19.95 && volume < 20.5;
}

/**
 * Stage 2：是否进入粉色死锁
 */
export function isStage2PinkLock(
  pH: number,
  bufferEnabled: boolean,
): boolean {
  return !bufferEnabled && pH < 6.5;
}

/**
 * Stage 2：判断是否到达终点（缓冲液开 + volume >= 20.0）
 */
export function isStage2AtEndpoint(volume: number, bufferEnabled: boolean): boolean {
  return bufferEnabled && volume >= 20.0;
}

/**
 * 根据全局状态计算状态文本
 */
export function judgeStatus(
  stage: Stage,
  volume: number,
  bufferEnabled: boolean,
  pH: number,
  stage1Cleared: boolean,
  stage2Cleared: boolean,
): StatusText {
  if (stage2Cleared) return 'ALL_CLEAR';

  if (stage === 1) {
    if (isStage1Overshot(volume)) return 'STAGE_1_OVERSHOT';
    if (isStage1AtEndpoint(volume)) return 'STAGE_1_SUCCESS';
    if (isStage1NearEndpoint(volume)) return 'NEAR_ENDPOINT';
    return 'TITRATING';
  }

  // Stage 2
  if (stage2Cleared) return 'STAGE_2_SUCCESS';
  if (isStage2PinkLock(pH, bufferEnabled)) return 'STAGE_2_PINK_LOCK';
  if (isStage2AtEndpoint(volume, bufferEnabled)) return 'STAGE_2_SUCCESS';
  if (!bufferEnabled && volume > 0) return 'STAGE_2_NEED_BUFFER';
  if (volume > 0 && volume < 19.5) return 'TITRATING';
  if (volume >= 19.5 && volume < 20.0) return 'NEAR_ENDPOINT';
  return 'STANDBY';
}

export { WINE_RED, PURPLE, CLEAR_BLUE, HOT_PINK, DEEP_BLUE, BUFFER_GREEN };