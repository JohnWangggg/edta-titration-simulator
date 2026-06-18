// Stage 2 输入弹窗 - 质量分数计算
import { useState } from 'react';
import { FlaskConical, X, AlertTriangle } from 'lucide-react';
import { useSimStore } from '@/store/simStore';
import { cn } from '@/lib/utils';

export default function Stage2InputModal() {
  const show = useSimStore((s) => s.showStage2Modal);
  const stage1Cleared = useSimStore((s) => s.stage1Cleared);
  const submit = useSimStore((s) => s.submitStage2);
  const closeModals = useSimStore((s) => s.closeModals);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  const handleSubmit = () => {
    const result = submit(input);
    if (result.ok) {
      setError(null);
    } else {
      setError(result.message);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') closeModals();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-1000/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-led-blue/40 bg-ink-900/95 rounded-sm shadow-panel overflow-hidden">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-led-blue/30 bg-led-blue/5">
          <div className="flex items-center gap-2">
            <FlaskConical size={14} className="text-led-blue" />
            <span className="font-mono text-xs tracking-[0.2em] text-led-blue">
              质量分数计算 · MASS FRACTION
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
          <div className="text-xs text-textc-secondary leading-relaxed">
            ZnSO₄ 未知试样（0.5000 g）已完成滴定，消耗 EDTA 25.00 mL。
            <br />
            请计算 ZnSO₄ 质量分数（%），并填写<span className="text-textc-primary">你代入计算时使用的 EDTA 浓度</span>：
          </div>

          {/* ⚠ 关键陷阱提示 - 故意引导 */}
          <div className="p-2.5 border border-led-amber/40 bg-led-amber/5 rounded-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle size={12} className="text-led-amber mt-0.5 flex-shrink-0" />
              <div className="text-[11px] text-textc-secondary leading-relaxed">
                <div className="text-led-amber font-medium mb-1">小提示</div>
                已知 EDTA 理论浓度为 <span className="font-num text-textc-primary">0.0500 mol/L</span>，
                ZnSO₄ 摩尔质量 161.47 g/mol。
              </div>
            </div>
          </div>

          {/* 输入框 */}
          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] text-textc-secondary mb-1.5 block">
              代入的 c(EDTA) / mol·L⁻¹
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
              提交最终结果
            </button>
          </div>
        </div>

        {/* 底部状态条 */}
        <div className="px-4 py-2 border-t border-ink-700 bg-ink-950/60 flex items-center justify-between">
          <span className="font-mono text-[9px] text-textc-disabled tracking-wider">
            数据继承自关卡一
          </span>
          <span className="font-mono text-[9px] tracking-wider" style={{ color: stage1Cleared ? '#00E676' : '#FFB300' }}>
            ● 关卡一 = {stage1Cleared ? '已通过' : '未通过'}
          </span>
        </div>
      </div>
    </div>
  );
}