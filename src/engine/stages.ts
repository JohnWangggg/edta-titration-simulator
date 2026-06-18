// 关卡逻辑：校验与判定
import type { ValidationResult } from '@/types';

/**
 * 解析用户输入为浮点数（支持 4 位小数）
 */
function parseNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const v = Number(trimmed);
  if (!Number.isFinite(v)) return null;
  return v;
}

/**
 * Stage 1 校验：用户输入的 EDTA 真实浓度
 * 允许误差 ≤ 0.0002 mol/L
 */
export function validateStage1Input(
  input: string,
  actual: number,
): ValidationResult {
  const v = parseNumber(input);
  if (v === null) {
    return {
      ok: false,
      reason: 'parse',
      message: '无法识别输入，请输入有效数字（如 0.0593）',
    };
  }
  const diff = Math.abs(v - actual);
  if (diff <= 0.0002) {
    return {
      ok: true,
      diff,
      message: `标定成功！真实浓度 ${actual.toFixed(4)} mol/L`,
    };
  }
  if (diff <= 0.001) {
    return {
      ok: false,
      reason: 'close',
      diff,
      message: `偏差 ${diff.toFixed(4)} 太大，请重新计算。允许误差 ±0.0002`,
    };
  }
  return {
    ok: false,
    reason: 'wrong',
    diff,
    message: `偏差 ${diff.toFixed(4)} 过大。请根据消耗的 EDTA 体积反推浓度。`,
  };
}

/**
 * Stage 2 校验：ZnSO₄ 试样中 Zn²⁺ 含量（质量分数）
 *
 * 化学背景（2026-06-18 修订）：
 *   - 试样：0.5000 g 含 ZnSO₄ 的未知固体（含有不参与反应的情性杂质）
 *   - 反应：Zn²⁺ + EDTA → Zn-EDTA（1:1 络合，pH 10，铬黑 T 指示剂）
 *   - 计算：m(ZnSO₄) = c(EDTA) × V(EDTA) × M(ZnSO₄) = c × 0.025 × 161.47 g
 *           mass% = m(ZnSO₄) / 0.5000 × 100%
 *   - 关键陷阱：用户必须使用 Stage 1 标定出的真实浓度，不能套用理论值 0.05
 *     - 用 c=0.05 算：mass% = 40.37%
 *     - 用 c=0.0593 算：mass% = 47.87%
 *     - 不同的 c 给出不同的 mass%，陷阱**可见**
 *
 * 校验策略（简化版）：
 *   - 用户实际输入框是"代入的 c(EDTA) / mol·L⁻¹"，而不是质量分数
 *   - 只要 c 匹配真实浓度（±0.0005），即认为通过
 *   - 这样避免了在 UI 里再展示一次 c→mass% 的换算，把"代入哪个 c"作为核心考点
 *
 * 检测三种错误：
 *   - reason='used_theoretical'：用户输入接近 0.05 → 提示陷阱
 *   - reason='wrong_value'：用户输入偏离过大
 *   - reason='close'：在 ±0.0005 ~ 0.002 区间 → 提示更精准
 */
export function validateStage2Input(
  input: string,
  actual: number,
): ValidationResult {
  const v = parseNumber(input);
  if (v === null) {
    return {
      ok: false,
      reason: 'parse',
      message: '无法识别输入，请输入有效数字',
    };
  }

  // 校验策略：检查用户输入的 c(EDTA) 是否等于真实标定浓度
  const diff = Math.abs(v - actual);

  // 陷阱检测：用户用了理论浓度 0.05（误差正好在 0.0050 ~ 0.0200 之间）
  const usedTheoretical = Math.abs(v - 0.05) < 0.001 && diff > 0.005;

  if (usedTheoretical) {
    return {
      ok: false,
      reason: 'used_theoretical',
      diff: Math.abs(v - 0.05),
      message:
        '计算错误：你忘记了关卡 1 中辛苦标定出的真实浓度吗？提示：理论浓度 0.05 mol/L 与你标定的实际值不同。',
    };
  }

  if (diff <= 0.0005) {
    return {
      ok: true,
      diff,
      message: `数据继承正确！标定浓度 ${actual.toFixed(4)} mol/L`,
    };
  }

  if (diff <= 0.002) {
    return {
      ok: false,
      reason: 'close',
      diff,
      message: `偏差 ${diff.toFixed(4)}，请重新核对关卡 1 的标定结果`,
    };
  }

  return {
    ok: false,
    reason: 'wrong',
    diff,
    message: `数值偏离过大。请使用关卡 1 标定出的 EDTA 真实浓度代入计算。`,
  };
}