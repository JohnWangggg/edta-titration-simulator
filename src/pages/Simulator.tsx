// 主模拟器页面
import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import ControlPanel from '@/components/ControlPanel';
import FlaskVisual from '@/components/FlaskVisual';
import StatusText from '@/components/StatusText';
import TelemetryCards from '@/components/TelemetryCards';
import PHChart from '@/components/PHChart';
import StageProgress from '@/components/StageProgress';
import OnboardingBanner from '@/components/OnboardingBanner';
import OperationGuideCard from '@/components/OperationGuideCard';
import Stage1InputModal from '@/components/modals/Stage1InputModal';
import Stage2InputModal from '@/components/modals/Stage2InputModal';
import ResultModal from '@/components/modals/ResultModal';
import { useSimStore } from '@/store/simStore';

export default function Simulator() {
  const color = useSimStore((s) => s.color);
  const volume = useSimStore((s) => s.volume);
  const bufferEnabled = useSimStore((s) => s.bufferEnabled);
  const historyLength = useSimStore((s) => s.history.length);
  const init = useSimStore((s) => s.init);
  const stage = useSimStore((s) => s.stage);
  const stage1Cleared = useSimStore((s) => s.stage1Cleared);

  useEffect(() => {
    init();
  }, [init]);

  const flaskColor = color;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-ink-950 text-textc-primary">
      {/* === 顶部栏 === */}
      <header className="flex-none px-4 py-2.5 border-b border-ink-700 bg-ink-900/70 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full bg-led-green animate-led-blink"
                style={{ filter: 'drop-shadow(0 0 6px currentColor)', color: '#00E676' }}
              />
              <div>
                <div className="font-mono text-[10px] tracking-[0.25em] text-textc-primary uppercase">
                  滴定遥测控制台
                </div>
                <div className="font-mono text-[9px] text-textc-disabled tracking-wider">
                  EDTA 络合滴定 · 失效模拟器 v1.0
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <StageProgress />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-textc-secondary tracking-wider">
              <Radio size={11} className="text-led-green" />
              <span>实时</span>
              <span className="text-textc-disabled">·</span>
              <LiveClock />
            </div>
          </div>
        </div>
      </header>

      {/* === 主体内容 === */}
      <main className="flex-1 min-h-0 p-4 grid grid-cols-12 gap-4">
        {/* 左：控制台 */}
        <div className="col-span-3 min-h-0">
          <ControlPanel />
        </div>

        {/* 中：引导 + 视觉 + 状态 */}
        <div className="col-span-5 min-h-0 flex flex-col gap-3">
          <OnboardingBanner />
          <OperationGuideCard />

          <div className="flex-1 min-h-0 relative border border-ink-700 bg-ink-900/40 rounded-sm shadow-panel backdrop-blur-sm overflow-hidden">
            {/* CRT 扫描线装饰 */}
            <div className="absolute inset-0 crt-scan pointer-events-none z-10" />
            <CornerLabel position="tl" label="摄像机-01" />
            <CornerLabel position="tr" label="体积锁定" />
            <CornerLabel position="bl" label={stage === 1 ? '锥瓶 · 锌标液' : '锥瓶 · ZnSO₄ 溶液'} />
            <CornerLabel position="br" label={`V=${volume.toFixed(2)} mL`} />

            <div className="h-full flex flex-col items-center justify-center p-4 gap-4">
              <FlaskVisual color={flaskColor} />
              <StatusText />
            </div>
          </div>

          {/* 底部小提示 */}
          <div className="flex items-center justify-between px-3 py-1.5 border border-ink-700 bg-ink-900/40 rounded-sm">
            <div className="font-mono text-[9px] text-textc-disabled tracking-wider">
              铬黑 T 指示剂 · Cr³⁺ 络合显色
            </div>
            <div className="font-mono text-[9px] text-textc-disabled tracking-wider">
              关卡 {stage} · {stage1Cleared ? '已标定' : '未标定'}
            </div>
          </div>
        </div>

        {/* 右：仪表盘 */}
        <div className="col-span-4 min-h-0 flex flex-col gap-3">
          <TelemetryCards />
          <div className="flex-1 min-h-0">
            <PHChart />
          </div>
        </div>
      </main>

      {/* === 底部状态条 === */}
      <footer className="flex-none px-4 py-1.5 border-t border-ink-700 bg-ink-900/70 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FooterItem label="帧率" value="60Hz" />
          <FooterItem label="传感器" value="在线" tone="green" />
          <FooterItem
            label="缓冲液"
            value={stage === 1 ? '已锁定' : bufferEnabled ? '已开启' : '已关闭'}
            tone={stage === 1 ? 'green' : bufferEnabled ? 'green' : 'red'}
          />
        </div>
        <div className="font-mono text-[9px] text-textc-disabled tracking-[0.2em] uppercase">
          ⚗ 滴定系统 · 失效模拟器 · 序列号 0001-EDTA
        </div>
        <div className="flex items-center gap-4">
          <FooterItem label="记录" value={`${historyLength} 点`} />
          <FooterItem label="CPU" value="12%" />
        </div>
      </footer>

      {/* 弹层 */}
      <Stage1InputModal />
      <Stage2InputModal />
      <ResultModal />
    </div>
  );
}

function FooterItem({
  label,
  value,
  tone = 'secondary',
}: {
  label: string;
  value: string;
  tone?: 'secondary' | 'green' | 'red' | 'blue';
}) {
  const colorMap = {
    secondary: 'text-textc-primary',
    green: 'text-led-green',
    red: 'text-led-red',
    blue: 'text-led-blue',
  };
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[9px] text-textc-disabled tracking-[0.2em]">{label}</span>
      <span className={`font-mono text-[9px] tracking-wider ${colorMap[tone]}`}>{value}</span>
    </div>
  );
}

function CornerLabel({
  position,
  label,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
  label: string;
}) {
  const posClass = {
    tl: 'top-2 left-2',
    tr: 'top-2 right-2',
    bl: 'bottom-2 left-2',
    br: 'bottom-2 right-2',
  }[position];
  return (
    <div
      className={`absolute ${posClass} font-mono text-[9px] text-textc-disabled tracking-wider pointer-events-none z-10`}
    >
      [{label}]
    </div>
  );
}

function LiveClock() {
  // 每秒刷新以显示真实时间
  const time = useTickNow();
  return (
    <span className="font-num tabular-nums">{time}</span>
  );
}

function useTickNow() {
  const [t, setT] = useState(() => formatNow());
  useEffect(() => {
    const id = setInterval(() => setT(formatNow()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function formatNow() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}