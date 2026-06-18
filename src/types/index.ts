// 全局类型定义

export type Stage = 1 | 2;

export type StatusText =
  | 'STANDBY'
  | 'TITRATING'
  | 'NEAR_ENDPOINT'
  | 'STAGE_1_OVERSHOT'
  | 'STAGE_1_SUCCESS'
  | 'STAGE_1_CALC_INPUT'
  | 'STAGE_1_WRONG'
  | 'STAGE_2_PINK_LOCK'
  | 'STAGE_2_NEED_BUFFER'
  | 'STAGE_2_SUCCESS'
  | 'STAGE_2_CALC_INPUT'
  | 'STAGE_2_WRONG_CONC'
  | 'ALL_CLEAR';

export interface DataPoint {
  volume: number;
  pH: number;
  color: string;
}

export interface ValidationResult {
  ok: boolean;
  reason?: string;
  message: string;
  diff?: number;
}

export const WINE_RED = '#B0152A';
export const PURPLE = '#7B2D8E';
export const CLEAR_BLUE = '#1976D2';
export const HOT_PINK = '#FF2D75';
export const DEEP_BLUE = '#0D47A1';
export const BUFFER_GREEN = '#00E676';
export const WARNING_AMBER = '#FFB300';
export const NEUTRAL_RED = '#7B1432';