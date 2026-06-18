// 右侧遥测指标卡
import { Activity, Beaker, TrendingDown } from 'lucide-react';
import { useSimStore } from '@/store/simStore';
import { cn } from '@/lib/utils';

export default function TelemetryCards() {
  const pH = useSimStore((s) => s.pH);
  const volume = useSimStore((s) => s.volume);
  const bufferEnabled = useSimStore((s) => s.bufferEnabled);
  const status = useSimStore((s) => s.status);

  const isPHAlert = pH < 6.5;
  const isPHStable = bufferEnabled && Math.abs(pH - 10) < 0.01;
  const phTrend = isPHAlert ? 'down' : isPHStable ? 'flat' : 'neutral';

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* pH 卡片 */}
      <div
        className={cn(
          'relative p-4 border rounded-sm overflow-hidden',
          'bg-ink-900/60 backdrop-blur-sm transition-colors',
          isPHAlert ? 'border-led-red/50 shadow-glow-pink' :
          isPHStable ? 'border-led-green/30' :
          'border-ink-700'
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Activity size={11} className="text-textc-secondary" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-textc-secondary">
              pH 值
            </span>
          </div>
          <div className="flex items-center gap-1">
            {phTrend === 'down' && <TrendingDown size={11} className="text-led-red" />}
            {phTrend === 'flat' && (
              <span className="font-mono text-[9px] text-led-green">稳定</span>
            )}
          </div>
        </div>
        <div
          className={cn(
            'font-num text-3xl md:text-4xl font-semibold tabular-nums tracking-tight',
            isPHAlert ? 'text-led-red' :
            isPHStable ? 'text-led-green' :
            'text-led-blue'
          )}
          style={{
            textShadow:
              isPHAlert ? '0 0 20px rgba(255,45,117,0.5)' :
              isPHStable ? '0 0 20px rgba(0,230,118,0.4)' :
              '0 0 20px rgba(77,208,225,0.4)',
          }}
        >
          {pH.toFixed(2)}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-mono text-[9px] text-textc-disabled tracking-wider">
            0 ─────── 14
          </span>
          <span className={cn(
            'font-mono text-[9px] tracking-wider',
            isPHAlert ? 'text-led-red' : 'text-textc-secondary'
          )}>
            {isPHAlert ? '低于警戒线' :
             isPHStable ? '缓冲液锁定' :
             bufferEnabled ? '已缓冲' : '未缓冲'}
          </span>
        </div>

        {/* 背景刻度条 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-ink-800">
          <div
            className="h-full bg-gradient-to-r from-led-blue via-led-amber to-led-red"
            style={{ width: `${(pH / 14) * 100}%`, transition: 'width 300ms ease' }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-led-red"
            style={{ left: `${(6.5 / 14) * 100}%` }}
          />
        </div>
      </div>

      {/* Volume 卡片 */}
      <div className="relative p-4 border border-ink-700 rounded-sm bg-ink-900/60 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Beaker size={11} className="text-textc-secondary" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-textc-secondary">
              已用 EDTA
            </span>
          </div>
          <span className="font-mono text-[9px] text-textc-secondary tracking-wider">
            {((volume / 30) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="font-num text-3xl md:text-4xl font-semibold tabular-nums tracking-tight text-textc-primary">
          {volume.toFixed(2)}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-mono text-[9px] text-textc-disabled tracking-wider">
            mL · 0 → 30
          </span>
          <span className="font-mono text-[9px] text-textc-secondary tracking-wider">
            {status === 'STAGE_1_OVERSHOT' ? '过量' :
             status === 'STAGE_2_PINK_LOCK' ? '已锁死' : '正常'}
          </span>
        </div>
        {/* 进度条 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-ink-800">
          <div
            className={cn(
              'h-full transition-all duration-300',
              volume >= 20.5 ? 'bg-led-red' :
              volume >= 20 ? 'bg-led-blue' :
              'bg-led-amber/60'
            )}
            style={{ width: `${(volume / 30) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}