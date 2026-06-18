// 顶部教学引导
import { Lightbulb, X } from 'lucide-react';
import { useState } from 'react';
import { useSimStore } from '@/store/simStore';
import { cn } from '@/lib/utils';

const BANNER_CONTENT: Record<1 | 2, { title: string; body: string; tone: 'blue' | 'amber' | 'green' }> = {
  1: {
    title: '为 EDTA 标定真实浓度',
    body: '锥形瓶里装的是 25.00 mL 的锌标准液（0.0500 mol/L）。\n拖动滑块向瓶中滴加 EDTA，逐滴逼近理论终点 20 mL；当体积进入 19.5–20.5 mL 时，主滑块步长会被自动锁定，请改用「+半滴（0.05 mL）」按钮做最后微调。\n一旦瓶内溶液变成纯净的蓝色，请按下式计算并输入 EDTA 的真实浓度：c(EDTA) = (0.0500 × 25.00) ÷ V消耗。',
    tone: 'blue',
  },
  2: {
    title: '测定 ZnSO₄ 试样中 Zn²⁺ 含量（警惕三个陷阱）',
    body: '锥形瓶里装的是 0.5000 g 含 ZnSO₄ 的未知固体试样溶液。\n默认未启用氨-氯化铵缓冲液。若直接滴定，pH 会迅速跌破 6.5 红线，铬黑 T 指示剂将锁死在粉红色，整个实验宣告失败。\n正确做法：先打开左侧「缓冲液系统」开关锁定 pH = 10，再进行滴定；纯蓝色出现后，请使用关卡一中辛苦标定出的真实浓度代入计算质量分数——而不是套用理论值 0.05 mol/L。',
    tone: 'amber',
  },
};

const TONE_STYLES = {
  blue: { border: 'border-led-blue/30', bg: 'bg-led-blue/5', icon: 'text-led-blue' },
  amber: { border: 'border-led-amber/30', bg: 'bg-led-amber/5', icon: 'text-led-amber' },
  green: { border: 'border-led-green/30', bg: 'bg-led-green/5', icon: 'text-led-green' },
};

export default function OnboardingBanner() {
  const stage = useSimStore((s) => s.stage);
  const stage1Cleared = useSimStore((s) => s.stage1Cleared);
  const stage2Cleared = useSimStore((s) => s.stage2Cleared);
  const [dismissed, setDismissed] = useState(false);

  const content = BANNER_CONTENT[stage];
  const style = TONE_STYLES[content.tone];

  if (dismissed) return null;
  if (stage2Cleared) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 border rounded-sm backdrop-blur-sm',
        style.border,
        style.bg
      )}
    >
      <Lightbulb size={14} className={cn('mt-0.5 flex-shrink-0', style.icon)} />
      <div className="flex-1 min-w-0">
        <div className={cn('font-mono text-[10px] tracking-[0.2em] mb-1', style.icon)}>
          任务目标 · 0{stage}
        </div>
        <div className="font-medium text-sm text-textc-primary mb-1">{content.title}</div>
        <div className="text-xs text-textc-secondary leading-relaxed whitespace-pre-line">
          {content.body}
        </div>
        {stage === 2 && !stage1Cleared && (
          <div className="mt-2 text-[10px] font-mono text-led-pink tracking-wider">
            ⚠ 请先完成关卡一标定，解锁浓度数据
          </div>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-textc-disabled hover:text-textc-primary transition-colors p-1"
        aria-label="关闭提示"
      >
        <X size={12} />
      </button>
    </div>
  );
}