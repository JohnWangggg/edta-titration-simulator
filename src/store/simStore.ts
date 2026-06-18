// Zustand 全局 store
import { create } from 'zustand';
import {
  computePH,
  computeColor,
  judgeStatus,
} from '@/engine/physics';
import {
  validateStage1Input,
  validateStage2Input,
} from '@/engine/stages';
import { generateHiddenConcentration } from '@/engine/random';
import {
  WINE_RED,
  type Stage,
  type StatusText,
  type DataPoint,
  type ValidationResult,
} from '@/types';

interface SimStore {
  // === 状态 ===
  stage: Stage;
  volume: number;
  bufferEnabled: boolean;
  pH: number;
  color: string;
  status: StatusText;
  history: DataPoint[];
  hiddenActualConc: number;
  stage1Cleared: boolean;
  stage2Cleared: boolean;
  showStage1Modal: boolean;
  showStage2Modal: boolean;
  showResultModal: boolean;
  isAnimatingDrop: boolean;
  resetTick: number; // 用于触发"系统重启"闪烁

  // === 行为 ===
  init: () => void;
  setVolume: (v: number) => void;
  addDrop: () => void;
  toggleBuffer: () => void;
  reset: () => void;
  goToStage2: () => void;
  submitStage1: (input: string) => ValidationResult;
  submitStage2: (input: string) => ValidationResult;
  closeModals: () => void;
  triggerDrop: () => void;
}

/**
 * 内部辅助：根据当前快照重新计算所有派生量
 */
function recalc(
  stage: Stage,
  volume: number,
  bufferEnabled: boolean,
  history: DataPoint[],
  stage1Cleared: boolean,
  stage2Cleared: boolean,
) {
  const pH = computePH(volume, bufferEnabled);
  const color = computeColor(volume, bufferEnabled, pH);
  const status = judgeStatus(
    stage,
    volume,
    bufferEnabled,
    pH,
    stage1Cleared,
    stage2Cleared,
  );
  // 同步末尾点（避免重复）
  const last = history[history.length - 1];
  let nextHistory = history;
  if (!last || last.volume !== volume) {
    nextHistory = [...history, { volume, pH, color }];
  }
  return { pH, color, status, history: nextHistory };
}

export const useSimStore = create<SimStore>((set, get) => ({
  stage: 1,
  volume: 0,
  bufferEnabled: true, // Stage 1 默认开启（UI 隐藏开关）
  pH: 7.0,
  color: WINE_RED,
  status: 'STANDBY',
  history: [{ volume: 0, pH: 7.0, color: WINE_RED }],
  hiddenActualConc: 0.0500,
  stage1Cleared: false,
  stage2Cleared: false,
  showStage1Modal: false,
  showStage2Modal: false,
  showResultModal: false,
  isAnimatingDrop: false,
  resetTick: 0,

  init: () => {
    const hiddenActualConc = generateHiddenConcentration();
    const initialHistory: DataPoint[] = [
      { volume: 0, pH: 7.0, color: WINE_RED },
    ];
    set({
      stage: 1,
      volume: 0,
      bufferEnabled: true,
      pH: 7.0,
      color: WINE_RED,
      status: 'STANDBY',
      history: initialHistory,
      hiddenActualConc,
      stage1Cleared: false,
      stage2Cleared: false,
      showStage1Modal: false,
      showStage2Modal: false,
      showResultModal: false,
      isAnimatingDrop: false,
    });
  },

  setVolume: (v: number) => {
    const state = get();
    const rounded = Math.round(v * 100) / 100;
    const { pH, color, status, history } = recalc(
      state.stage,
      rounded,
      state.bufferEnabled,
      state.history,
      state.stage1Cleared,
      state.stage2Cleared,
    );

    set({
      volume: rounded,
      pH,
      color,
      status,
      history,
    });

    // 检查 Stage 1 / Stage 2 是否触发输入弹窗
    const newState = get();
    if (newState.stage === 1 && status === 'STAGE_1_SUCCESS' && !newState.showStage1Modal) {
      set({ showStage1Modal: true });
    }
    if (newState.stage === 2 && status === 'STAGE_2_SUCCESS' && !newState.showStage2Modal) {
      set({ showStage2Modal: true });
    }
  },

  addDrop: () => {
    const state = get();
    const next = Math.min(30, state.volume + 0.05);
    get().setVolume(next);
    get().triggerDrop();
  },

  toggleBuffer: () => {
    const state = get();
    if (state.stage !== 2) return;
    const next = !state.bufferEnabled;
    const { pH, color, status, history } = recalc(
      state.stage,
      state.volume,
      next,
      state.history,
      state.stage1Cleared,
      state.stage2Cleared,
    );
    set({
      bufferEnabled: next,
      pH,
      color,
      status,
      history,
    });
  },

  reset: () => {
    const state = get();
    if (state.stage === 1) {
      set({
        volume: 0,
        bufferEnabled: true,
        pH: 7.0,
        color: WINE_RED,
        status: 'STANDBY',
        history: [{ volume: 0, pH: 7.0, color: WINE_RED }],
        showStage1Modal: false,
        resetTick: state.resetTick + 1,
      });
    } else {
      // Stage 2 重置：保留 stage1Cleared
      set({
        volume: 0,
        bufferEnabled: false,
        pH: 7.0,
        color: WINE_RED,
        status: 'STANDBY',
        history: [{ volume: 0, pH: 7.0, color: WINE_RED }],
        showStage2Modal: false,
        resetTick: state.resetTick + 1,
      });
    }
  },

  goToStage2: () => {
    set({
      stage: 2,
      volume: 0,
      bufferEnabled: false, // Stage 2 默认关闭（让用户感受到陷阱）
      pH: 7.0,
      color: WINE_RED,
      status: 'STANDBY',
      history: [{ volume: 0, pH: 7.0, color: WINE_RED }],
      showStage1Modal: false,
    });
  },

  submitStage1: (input: string) => {
    const state = get();
    const result = validateStage1Input(input, state.hiddenActualConc);
    if (result.ok) {
      set({ stage1Cleared: true });
    }
    return result;
  },

  submitStage2: (input: string) => {
    const state = get();
    const result = validateStage2Input(input, state.hiddenActualConc);
    if (result.ok) {
      set({ stage2Cleared: true, showStage2Modal: false, showResultModal: true });
    }
    return result;
  },

  closeModals: () => {
    set({
      showStage1Modal: false,
      showStage2Modal: false,
      showResultModal: false,
    });
  },

  triggerDrop: () => {
    set({ isAnimatingDrop: true });
    setTimeout(() => set({ isAnimatingDrop: false }), 320);
  },
}));