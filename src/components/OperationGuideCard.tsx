// Stage 1 操作规范卡片 — Thread B A 方案
// 设计: 仅 Stage 1 显示, 默认折叠, 包含 4 条标准滴定操作规范
import { useState } from 'react';
import {
  Beaker,
  Eye,
  Droplet,
  RotateCw,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useSimStore } from '@/store/simStore';
import { cn } from '@/lib/utils';

interface Rule {
  icon: typeof Beaker;
  title: string;
  body: string;
}

const RULES: Rule[] = [
  {
    icon: Beaker,
    title: '滴定管润洗',
    body: '用标准液润洗 3 次。残留水会稀释浓度，最终结果偏高。',
  },
  {
    icon: Eye,
    title: '平视读数',
    body: '视线与弯月面最低点相切。仰视/俯视都会引入 ±0.01 mL 误差。',
  },
  {
    icon: Droplet,
    title: '半滴控制',
    body: '近终点时让液滴悬在尖嘴，用锥瓶内壁沾下，再用纯水冲入瓶中。',
  },
  {
    icon: RotateCw,
    title: '摇瓶',
    body: '圆周摇动，让反应均匀。摇不够 = 反应不完全。',
  },
];

export default function OperationGuideCard() {
  const stage = useSimStore((s) => s.stage);
  const [open, setOpen] = useState(false);

  // 仅 Stage 1 显示
  if (stage !== 1) return null;

  return (
    <div className="border border-led-blue/30 bg-led-blue/5 rounded-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-led-blue/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Beaker size={14} className="text-led-blue" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-led-blue">
            标准滴定操作规范 · 4 件事
          </span>
        </div>
        {open ? (
          <ChevronDown size={12} className="text-textc-secondary" />
        ) : (
          <ChevronRight size={12} className="text-textc-secondary" />
        )}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2.5">
          {RULES.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div key={idx} className="flex items-start gap-2">
                <Icon size={12} className="text-led-blue mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div
                    className={cn(
                      'text-xs font-medium text-textc-primary mb-0.5',
                    )}
                  >
                    {rule.title}
                  </div>
                  <div className="text-[11px] text-textc-secondary leading-relaxed">
                    {rule.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}