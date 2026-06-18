// 左侧控制台
import { useMemo } from 'react';
import { Power, Droplet, RotateCcw, FlaskConical } from 'lucide-react';
import { useSimStore } from '@/store/simStore';
import { isStage1NearEndpoint } from '@/engine/physics';
import ToggleSwitch from './ToggleSwitch';
import { cn } from '@/lib/utils';

export default function ControlPanel() {
  const stage = useSimStore((s) => s.stage);
  const volume = useSimStore((s) => s.volume);
  const bufferEnabled = useSimStore((s) => s.bufferEnabled);
  const status = useSimStore((s) => s.status);
  const setVolume = useSimStore((s) => s.setVolume);
  const addDrop = useSimStore((s) => s.addDrop);
  const toggleBuffer = useSimStore((s) => s.toggleBuffer);
  const reset = useSimStore((s) => s.reset);

  const sliderDisabled =
    (stage === 1 && status === 'STAGE_1_OVERSHOT') ||
    (stage === 2 && (status === 'STAGE_2_PINK_LOCK' || status === 'STAGE_2_SUCCESS'));

  const inNearZone = stage === 1 && isStage1NearEndpoint(volume);
  const sliderStep = inNearZone ? 0.5 : 0.1;

  const progress = useMemo(() => `${(volume / 30) * 100}%`, [volume]);

  const bufferLed = bufferEnabled ? 'green' : 'red';

  return (
    <aside className="h-full flex flex-col gap-3 p-4 bg-ink-900/60 border border-ink-700 rounded-sm shadow-panel backdrop-blur-sm">
      {/* 标题区 */}
      <div className="flex items-center justify-between pb-3 border-b border-ink-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-led-blue animate-led-blink" style={{ filter: 'drop-shadow(0 0 4px currentColor)', color: '#4DD0E1' }} />
          <h2 className="font-mono text-xs tracking-[0.25em] text-textc-primary">
            控制台 · CONSOLE
          </h2>
        </div>
        <span className="font-mono text-[10px] text-textc-secondary tracking-wider">
          关卡 {stage}
        </span>
      </div>

      {/* 缓冲液开关（仅 Stage 2） */}
      {stage === 2 && (
        <div className={cn(
          'p-3 border rounded-sm transition-colors',
          bufferEnabled
            ? 'border-led-green/30 bg-led-green/5'
            : 'border-led-red/30 bg-led-red/5'
        )}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <FlaskConical size={12} className={bufferEnabled ? 'text-led-green' : 'text-led-red'} />
                <div className="font-mono text-[10px] tracking-[0.2em] text-textc-secondary">
                  缓冲液系统
                </div>
              </div>
              <div className="text-xs text-textc-primary leading-relaxed">
                注入氨-氯化铵缓冲液
              </div>
              <div className="font-mono text-[9px] text-textc-disabled mt-0.5 tracking-wider">
                锁定 pH = 10.00
              </div>
            </div>
            <ToggleSwitch
              checked={bufferEnabled}
              onChange={toggleBuffer}
              ledColor={bufferLed}
            />
          </div>
        </div>
      )}

      {/* Stage 1 默认提示 */}
      {stage === 1 && (
        <div className="p-3 border border-led-blue/20 bg-led-blue/5 rounded-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <FlaskConical size={12} className="text-led-blue" />
            <div className="font-mono text-[10px] tracking-[0.2em] text-textc-secondary">
              缓冲液系统
            </div>
          </div>
          <div className="text-xs text-textc-primary">
            已加入缓冲溶液（系统默认）
          </div>
          <div className="font-mono text-[9px] text-textc-disabled mt-0.5 tracking-wider">
            锁定 pH = 10.00 · 自动
          </div>
        </div>
      )}

      {/* 体积滑块 */}
      <div className="p-3 border border-ink-700 bg-ink-800/40 rounded-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Droplet size={12} className="text-led-blue" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-textc-secondary">
              EDTA 体积
            </span>
          </div>
          <span className="font-num text-sm text-led-blue tabular-nums">
            {volume.toFixed(2)}<span className="text-textc-disabled text-[10px] ml-1">mL</span>
          </span>
        </div>

        <div className="relative">
          <input
            type="range"
            min="0"
            max="30"
            step={sliderStep}
            value={volume}
            disabled={sliderDisabled}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full"
            style={{ '--progress': progress } as React.CSSProperties}
            aria-label="EDTA 体积（毫升）"
          />

          {/* 刻度标 */}
          <div className="flex justify-between mt-2 px-0.5">
            {[0, 5, 10, 15, 19.5, 20, 20.5, 25, 30].map((v) => (
              <div
                key={v}
                className={cn(
                  'font-mono text-[9px] tabular-nums',
                  v === 19.5 || v === 20 ? 'text-led-amber' :
                  v === 20.5 ? 'text-led-red' :
                  'text-textc-disabled'
                )}
              >
                {v.toFixed(1)}
              </div>
            ))}
          </div>

          {/* 标记线 */}
          <div className="absolute top-[14px] left-0 right-0 h-px pointer-events-none">
            <div
              className="absolute w-px h-2 bg-led-amber/50 -top-1"
              style={{ left: `${(19.5 / 30) * 100}%` }}
            />
            <div
              className="absolute w-px h-2 bg-led-amber -top-1"
              style={{ left: `${(20 / 30) * 100}%` }}
            />
            <div
              className="absolute w-px h-2 bg-led-red/50 -top-1"
              style={{ left: `${(20.5 / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* 微调按钮组 */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={addDrop}
            disabled={sliderDisabled || volume >= 30}
            className={cn(
              'flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-sm',
              'border border-ink-600 bg-ink-800 hover:bg-ink-700',
              'font-mono text-[10px] tracking-wider text-textc-primary',
              'transition-all duration-150',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-ink-800',
              'active:scale-95',
              inNearZone && 'border-led-amber/60 shadow-glow-amber'
            )}
          >
            <Droplet size={11} />
            <span>+ 半滴</span>
            <span className="text-textc-disabled">0.05</span>
          </button>
          <button
            onClick={() => setVolume(0)}
            disabled={volume === 0}
            className={cn(
              'flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-sm',
              'border border-ink-600 bg-ink-800 hover:bg-ink-700',
              'font-mono text-[10px] tracking-wider text-textc-secondary',
              'transition-all duration-150',
              'disabled:opacity-30 disabled:cursor-not-allowed',
              'active:scale-95'
            )}
          >
            <RotateCcw size={11} />
            <span>清零</span>
          </button>
        </div>

        {inNearZone && stage === 1 && (
          <div className="mt-2 px-2 py-1.5 bg-led-amber/10 border border-led-amber/30 rounded-sm">
            <div className="font-mono text-[9px] tracking-wider text-led-amber leading-tight">
              ⚠ 进入末端 · 主滑块步长已禁用
            </div>
            <div className="font-mono text-[9px] text-textc-secondary mt-0.5">
              USE HALF-DROP BUTTON ONLY
            </div>
          </div>
        )}
      </div>

      {/* 系统状态指示 */}
      <div className="p-3 border border-ink-700 bg-ink-800/40 rounded-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-textc-secondary">
            系统状态
          </span>
          <span
            className={cn(
              'font-mono text-[10px] tracking-wider font-semibold',
              status === 'STAGE_1_OVERSHOT' || status === 'STAGE_2_PINK_LOCK'
                ? 'text-led-red'
                : status === 'STAGE_2_SUCCESS' || status === 'ALL_CLEAR' || status === 'STAGE_1_SUCCESS'
                ? 'text-led-green'
                : status === 'NEAR_ENDPOINT'
                ? 'text-led-amber'
                : 'text-textc-primary'
            )}
          >
            {status === 'STANDBY' ? '就绪' :
             status === 'TITRATING' ? '运行中' :
             status === 'NEAR_ENDPOINT' ? '警告' :
             status === 'STAGE_1_OVERSHOT' ? '故障' :
             status === 'STAGE_2_PINK_LOCK' ? '死锁' :
             status === 'STAGE_2_SUCCESS' || status === 'STAGE_1_SUCCESS' ? '正常' :
             status === 'ALL_CLEAR' ? '完成' :
             '运行中'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              status === 'STAGE_2_PINK_LOCK' || status === 'STAGE_1_OVERSHOT'
                ? 'bg-led-red animate-pulse-fast'
                : status === 'STAGE_2_SUCCESS' || status === 'ALL_CLEAR'
                ? 'bg-led-green animate-led-blink'
                : 'bg-led-blue animate-led-blink'
            )}
            style={{
              filter: 'drop-shadow(0 0 4px currentColor)',
              color:
                status === 'STAGE_2_PINK_LOCK' || status === 'STAGE_1_OVERSHOT'
                  ? '#FF5252'
                  : status === 'STAGE_2_SUCCESS' || status === 'ALL_CLEAR'
                  ? '#00E676'
                  : '#4DD0E1',
            }}
          />
          <span className="font-mono text-[9px] text-textc-disabled tracking-wider">
            滴定引擎 · v1.0
          </span>
        </div>
      </div>

      {/* Reset 按钮 */}
      <button
        onClick={reset}
        className={cn(
          'mt-auto flex items-center justify-center gap-2 px-3 py-2 rounded-sm',
          'border border-led-amber/40 bg-led-amber/5 hover:bg-led-amber/15',
          'font-mono text-[10px] tracking-[0.2em] text-led-amber',
          'transition-all duration-150',
          'active:scale-95 hover:shadow-glow-amber'
        )}
      >
        <Power size={12} />
        <span>系统归零 · RESET</span>
      </button>
    </aside>
  );
}