// 通关弹层
import { Trophy, Sparkles, ShieldAlert } from 'lucide-react';
import { useSimStore } from '@/store/simStore';

interface TrapMistake {
  name: string;
  consequence: string;
}

// 常见错误对照表 — 来自 .harness/docs/student-errors.md
const TRAP_MISTAKES: TrapMistake[] = [
  {
    name: '滴定管未用标准液润洗',
    consequence: 'V 偏大，结果偏高 ~0.5-1%',
  },
  {
    name: '锥形瓶误用待测液润洗',
    consequence: '实际样品量翻倍，结果偏高 ~100%（致命）',
  },
  {
    name: '近终点没改用半滴',
    consequence: '过量 0.05 mL，结果明显偏高',
  },
  {
    name: '仰视 / 俯视读数',
    consequence: '±0.01 mL 系统偏差',
  },
  {
    name: '忘了加缓冲液',
    consequence: 'pH 崩溃，指示剂锁死在粉色（致命）',
  },
  {
    name: 'Fe³⁺ / Al³⁺ 未掩蔽',
    consequence: '铬黑 T 被"封闭"，永远不变蓝（致命）',
  },
  {
    name: '套用理论浓度 0.05 而非标定值',
    consequence: '数据源错误，结果完全错（致命）',
  },
];

export default function ResultModal() {
  const show = useSimStore((s) => s.showResultModal);
  const closeModals = useSimStore((s) => s.closeModals);
  const hiddenActualConc = useSimStore((s) => s.hiddenActualConc);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-1000/85 backdrop-blur-md">
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at center, rgba(0, 230, 118, 0.15), transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-lg border border-led-green/50 bg-ink-900/95 rounded-sm shadow-glow-green overflow-hidden">
        {/* 顶部装饰条 */}
        <div className="h-1 bg-gradient-to-r from-transparent via-led-green to-transparent animate-pulse-fast" />

        <div className="p-8 text-center">
          {/* 图标 */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-4 border-2 border-led-green rounded-full shadow-glow-green animate-led-blink"
            style={{ color: '#00E676' }}
          >
            <Trophy size={36} strokeWidth={1.5} />
          </div>

          {/* 主标题 */}
          <h1 className="font-display text-3xl font-bold tracking-[0.3em] text-led-green mb-1">
            任 务 完 成
          </h1>
          <div className="font-mono text-[10px] tracking-[0.4em] text-textc-secondary uppercase mb-6">
            MISSION COMPLETE · ALL SYSTEMS NOMINAL
          </div>

          {/* 教育性反思 */}
          <div className="text-left p-4 border border-ink-700 bg-ink-950/60 rounded-sm mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-led-amber" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-led-amber uppercase">
                你做对了什么 · WHAT YOU DID RIGHT
              </span>
            </div>
            <ul className="space-y-2 text-xs text-textc-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-led-green mt-0.5">✓</span>
                <span>
                  <span className="text-textc-primary">关卡一 · 标定</span>
                  ：你通过半滴微调把滴定终点控制在 ±0.05 mL 精度内，并正确反推了 EDTA 的真实浓度
                  <span className="font-num text-led-blue ml-1">{hiddenActualConc.toFixed(4)}</span>
                  <span className="font-num text-textc-disabled ml-1">mol/L</span>
                  。这避免了"手抖多加一滴"导致的整组数据报废。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-led-green mt-0.5">✓</span>
                <span>
                  <span className="text-textc-primary">关卡二 · 环境</span>
                  ：你在滴定前先打开了缓冲液开关锁定 pH = 10，避免了 pH 跌破 6.5 后指示剂锁死在粉红色的"越滴越粉"灾难。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-led-green mt-0.5">✓</span>
                <span>
                  <span className="text-textc-primary">关卡二 · 数据继承</span>
                  ：你正确使用了关卡一中辛苦标定的真实浓度，而不是套用理论值 0.05 mol/L——这是科研里最隐蔽也最致命的数据源错误。
                </span>
              </li>
            </ul>
          </div>

          <div className="font-mono text-[10px] text-textc-disabled tracking-wider leading-relaxed mb-6">
            在真实实验中，这三个失误中的任何一个都足以让整组数据报废。
            <br />
            科研不是"差不多就行"——精度、缓冲环境、数据源一致性，是缺一不可的三条腿。
          </div>

          {/* 避坑清单 — Thread B B 方案 */}
          <div className="text-left p-4 border border-led-amber/30 bg-led-amber/5 rounded-sm mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <ShieldAlert size={12} className="text-led-amber" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-led-amber uppercase">
                你避开了哪些错 · WHAT YOU AVOIDED
              </span>
            </div>
            <ul className="space-y-2 text-xs text-textc-secondary leading-relaxed">
              {TRAP_MISTAKES.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-led-red mt-0.5 leading-none">✗</span>
                  <span>
                    <span className="text-textc-primary">{m.name}</span>
                    <span className="text-textc-disabled ml-1">→ {m.consequence}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={closeModals}
            className="px-6 py-2 border border-led-green bg-led-green/10 hover:bg-led-green/20 text-led-green rounded-sm font-mono text-xs tracking-[0.2em] uppercase transition-all shadow-glow-green"
          >
            关闭报告 · CLOSE
          </button>
        </div>

        {/* 底部装饰条 */}
        <div className="h-1 bg-gradient-to-r from-transparent via-led-green to-transparent animate-pulse-fast" />
      </div>
    </div>
  );
}