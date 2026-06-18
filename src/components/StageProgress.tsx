// 顶部关卡进度
import { Check, Lock } from 'lucide-react';
import { useSimStore } from '@/store/simStore';
import { cn } from '@/lib/utils';

export default function StageProgress() {
  const stage = useSimStore((s) => s.stage);
  const stage1Cleared = useSimStore((s) => s.stage1Cleared);
  const stage2Cleared = useSimStore((s) => s.stage2Cleared);

  return (
    <div className="flex items-center gap-4">
      <div className="font-mono text-[10px] tracking-[0.25em] text-textc-secondary">
        任务进度
      </div>

      <div className="flex items-center gap-2">
        {/* Stage 1 */}
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 border rounded-sm transition-all',
            stage1Cleared ? 'border-led-green/50 bg-led-green/10 shadow-glow-green' :
            stage === 1 ? 'border-led-blue/50 bg-led-blue/10' :
            'border-ink-700'
          )}
        >
          <div
            className={cn(
              'w-5 h-5 rounded-sm flex items-center justify-center font-mono text-[10px] font-semibold',
              stage1Cleared ? 'bg-led-green text-ink-950' :
              stage === 1 ? 'bg-led-blue text-ink-950 animate-pulse-fast' :
              'bg-ink-700 text-textc-disabled'
            )}
          >
            {stage1Cleared ? <Check size={11} /> : '1'}
          </div>
          <div>
            <div className={cn(
              'font-mono text-[10px] tracking-wider',
              stage1Cleared ? 'text-led-green' :
              stage === 1 ? 'text-textc-primary' : 'text-textc-disabled'
            )}>
              关卡 一
            </div>
            <div className={cn(
              'font-mono text-[9px]',
              stage === 1 && !stage1Cleared ? 'text-led-blue' : 'text-textc-disabled'
            )}>
              {stage1Cleared ? '已标定' : stage === 1 ? '进行中' : '待开始'}
            </div>
          </div>
        </div>

        {/* 连接线 */}
        <div className="w-8 h-px relative">
          <div className={cn(
            'absolute inset-0 transition-colors',
            stage1Cleared ? 'bg-led-green/50' : 'bg-ink-700'
          )} />
          <div
            className={cn(
              'absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 transition-colors',
              stage1Cleared ? 'bg-led-green/70' : 'bg-ink-700'
            )}
          />
        </div>

        {/* Stage 2 */}
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 border rounded-sm transition-all',
            stage2Cleared ? 'border-led-green/50 bg-led-green/10 shadow-glow-green' :
            stage === 2 ? 'border-led-blue/50 bg-led-blue/10' :
            'border-ink-700'
          )}
        >
          <div
            className={cn(
              'w-5 h-5 rounded-sm flex items-center justify-center font-mono text-[10px] font-semibold',
              stage2Cleared ? 'bg-led-green text-ink-950' :
              stage === 2 ? 'bg-led-blue text-ink-950 animate-pulse-fast' :
              stage1Cleared ? 'bg-ink-600 text-textc-secondary' :
              'bg-ink-700 text-textc-disabled'
            )}
          >
            {stage2Cleared ? <Check size={11} /> :
             !stage1Cleared ? <Lock size={9} /> : '2'}
          </div>
          <div>
            <div className={cn(
              'font-mono text-[10px] tracking-wider',
              stage2Cleared ? 'text-led-green' :
              stage === 2 ? 'text-textc-primary' :
              stage1Cleared ? 'text-textc-secondary' : 'text-textc-disabled'
            )}>
              关卡 二
            </div>
            <div className={cn(
              'font-mono text-[9px]',
              stage === 2 && !stage2Cleared ? 'text-led-blue' :
              stage2Cleared ? 'text-led-green' : 'text-textc-disabled'
            )}>
              {stage2Cleared ? '已完成' :
               stage === 2 ? '进行中' :
               !stage1Cleared ? '未解锁' : '就绪'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}