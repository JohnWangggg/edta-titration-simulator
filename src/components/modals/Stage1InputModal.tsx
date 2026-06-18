// Stage 1 输入弹窗 - 标定浓度计算
import { useState } from 'react';
import { Calculator, X } from 'lucide-react';
import { useSimStore } from '@/store/simStore';
import { cn } from '@/lib/utils';

export default function Stage1InputModal() {
  const show = useSimStore((s) => s.showStage1Modal);
  const volume = useSimStore((s) => s.volume);
  const submit = useSimStore((s) => s.submitStage1);
  const goToStage2 = useSimStore((s) => s.goToStage2);
  const closeModals = useSimStore((s) => s.closeModals);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  const handleSubmit = () => {
    const result = submit(input);
    if (result.ok) {
      setError(null);
      setTimeout(() => goToStage2(), 1200);
    } else {
      setError(result.message);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') closeModals();
  };

  // 计算公式提示
  const calcHint = `c(EDTA) = (c(Zn) × V(Zn)) / V(EDTA) = (0.0500 × 25.00) / ${volume.toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-1000/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-led-blue/40 bg-ink-900/95 rounded-sm shadow-panel overflow-hidden">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-led-blue/30 bg-led-blue/5">
          <div className="flex items-center gap-2">
            <Calculator size={14} className="text-led-blue" />
            <span className="font-mono text-xs tracking-[0.2em] text-led-blue">
              标定数据输入 · CALIBRATION
            </span>
          </div>
          <button
            onClick={closeModals}
            className="text-textc-disabled hover:text-textc-primary transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs text-textc-secondary mb-2">
              已到达标定终点。本轮消耗 EDTA：
              <span className="font-num text-led-blue ml-1">{volume.toFixed(2)} mL</span>
            </div>
            <div className="text-xs text-textc-secondary mb-1">
              请根据下式计算并输入 EDTA 的真实浓度（保留 4 位小数）：
            </div>
            <div className="font-mono text-[10px] text-textc-disabled tracking-wider bg-ink-950/60 px-2 py-1.5 border border-ink-700">
              {calcHint}
            </div>
          </div>

          {/* 输入框 */}
          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] text-textc-secondary mb-1.5 block">
              c(EDTA) / mol·L⁻¹
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKey}
              placeholder="0.0000"
              autoFocus
              className={cn(
                'w-full px-3 py-2 font-num text-lg tabular-nums',
                'bg-ink-950 border border-ink-700 rounded-sm',
                'text-textc-primary placeholder:text-textc-disabled',
                'focus:border-led-blue focus:outline-none transition-colors'
              )}
            />
            {error && (
              <div className="mt-2 font-mono text-[11px] text-led-red leading-relaxed">
                ⚠ {error}
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={closeModals}
              className="px-3 py-1.5 border border-ink-600 hover:border-ink-500 rounded-sm font-mono text-[10px] tracking-wider text-textc-secondary hover:text-textc-primary transition-all"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className={cn(
                'px-4 py-1.5 border rounded-sm font-mono text-[10px] tracking-[0.2em] transition-all',
                'border-led-blue bg-led-blue/10 hover:bg-led-blue/20 text-led-blue',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                'shadow-glow-blue'
              )}
            >
              提交计算
            </button>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="px-4 py-2 border-t border-ink-700 bg-ink-950/60 flex items-center justify-between">
          <span className="font-mono text-[9px] text-textc-disabled tracking-wider">
            允许误差 ± 0.0002 mol/L
          </span>
          <span className="font-mono text-[9px] text-led-blue tracking-wider animate-led-blink" style={{ color: '#4DD0E1' }}>
            ● 通过后自动解锁关卡二
          </span>
        </div>
      </div>
    </div>
  );
}