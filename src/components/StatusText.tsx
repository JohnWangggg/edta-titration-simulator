// 大字号状态文本
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { StatusText as StatusTextType } from '@/types';
import { useSimStore } from '@/store/simStore';

const STATUS_MAP: Record<
  StatusTextType,
  { label: string; sub: string; tone: 'normal' | 'warning' | 'success' | 'danger' | 'pink' | 'blue' }
> = {
  STANDBY: { label: '系统待命', sub: 'STANDBY · 等待操作', tone: 'normal' },
  TITRATING: { label: '正在滴定', sub: 'TITRATING · 滴定管运行中', tone: 'normal' },
  NEAR_ENDPOINT: { label: '接近终点', sub: 'NEAR ENDPOINT · 请改用半滴', tone: 'warning' },
  STAGE_1_OVERSHOT: { label: '滴定过量', sub: 'OVERSHOOT · 数据作废 · 请重置', tone: 'danger' },
  STAGE_1_SUCCESS: { label: '标定完成', sub: 'CALIBRATION COMPLETE', tone: 'success' },
  STAGE_1_CALC_INPUT: { label: '请输入浓度', sub: 'ENTER EDTA CONC.', tone: 'blue' },
  STAGE_1_WRONG: { label: '浓度错误', sub: 'CALC. MISMATCH', tone: 'warning' },
  STAGE_2_PINK_LOCK: { label: '系统死锁', sub: 'INDICATOR LOCKED · pH 崩溃', tone: 'pink' },
  STAGE_2_NEED_BUFFER: { label: '请启用缓冲液', sub: 'BUFFER REQUIRED · 启用开关', tone: 'warning' },
  STAGE_2_SUCCESS: { label: '滴定成功', sub: 'TITRATION COMPLETE', tone: 'success' },
  STAGE_2_CALC_INPUT: { label: '请计算质量分数', sub: 'CALC. MASS FRACTION', tone: 'blue' },
  STAGE_2_WRONG_CONC: { label: '数据源错误', sub: 'WRONG DATA · 用关卡 1 结果', tone: 'warning' },
  ALL_CLEAR: { label: '全部完成', sub: 'ALL CLEAR · 任务完成', tone: 'success' },
};

const TONE_CLASS: Record<string, string> = {
  normal: 'text-textc-primary',
  warning: 'text-led-amber',
  success: 'text-led-green',
  danger: 'text-led-red',
  pink: 'text-led-pink',
  blue: 'text-led-blue',
};

const TONE_GLOW: Record<string, string> = {
  normal: '',
  warning: 'drop-shadow-[0_0_20px_rgba(255,179,0,0.4)]',
  success: 'drop-shadow-[0_0_20px_rgba(0,230,118,0.5)]',
  danger: 'drop-shadow-[0_0_20px_rgba(255,82,82,0.5)]',
  pink: 'drop-shadow-[0_0_20px_rgba(255,45,117,0.6)]',
  blue: 'drop-shadow-[0_0_20px_rgba(77,208,225,0.5)]',
};

export default function StatusText() {
  const status = useSimStore((s) => s.status);
  const [shown, setShown] = useState<StatusTextType>(status);

  useEffect(() => {
    if (status !== shown) {
      const t = setTimeout(() => setShown(status), 180);
      return () => clearTimeout(t);
    }
  }, [status, shown]);

  const info = STATUS_MAP[shown];
  const tone = info.tone;

  return (
    <div className="text-center select-none">
      <div
        key={shown}
        className={cn(
          'animate-in fade-in slide-in-from-bottom-2 duration-300',
        )}
      >
        <div
          className={cn(
            'font-display text-4xl md:text-5xl font-bold tracking-wider',
            TONE_CLASS[tone],
            TONE_GLOW[tone],
          )}
          style={{ animation: shown !== status ? '' : 'flicker 0.3s' }}
        >
          {info.label}
        </div>
        <div className="mt-2 font-mono text-[10px] tracking-[0.25em] text-textc-secondary">
          {info.sub}
        </div>
      </div>
    </div>
  );
}