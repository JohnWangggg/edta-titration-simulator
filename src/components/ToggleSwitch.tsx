// 拟物拨杆开关
import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  ledColor?: 'green' | 'red' | 'amber' | 'blue';
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  ledColor = 'green',
}: ToggleSwitchProps) {
  const ledClass = {
    green: 'bg-led-green shadow-glow-green text-led-green',
    red: 'bg-led-red shadow-glow-pink text-led-red',
    amber: 'bg-led-amber shadow-glow-amber text-led-amber',
    blue: 'bg-led-blue shadow-glow-blue text-led-blue',
  }[ledColor];

  return (
    <label
      className={cn(
        'flex items-center gap-3 select-none cursor-pointer group',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
    >
      <div className="relative">
        {/* LED 指示灯 */}
        <div
          className={cn(
            'absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300',
            checked
              ? ledClass.split(' ').slice(0, 2).join(' ')
              : 'bg-ink-600 shadow-none',
          )}
          style={{
            boxShadow: checked ? `0 0 8px currentColor` : 'none',
          }}
        />

        {/* 拨杆底座 */}
        <div
          className={cn(
            'w-14 h-7 rounded-sm relative transition-colors duration-300',
            'border border-ink-700 shadow-bezel',
            checked ? 'bg-ink-800' : 'bg-ink-900',
          )}
          onClick={() => !disabled && onChange(!checked)}
        >
          {/* 拨杆滑块 */}
          <div
            className={cn(
              'absolute top-0.5 w-6 h-5 rounded-sm transition-all duration-300',
              'border border-ink-600',
              checked
                ? 'left-[30px] bg-gradient-to-b from-textc-primary to-textc-secondary'
                : 'left-0.5 bg-gradient-to-b from-ink-600 to-ink-700',
            )}
            style={{
              boxShadow: checked
                ? '0 0 12px rgba(77,208,225,0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
                : 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          />

          {/* 槽内刻度线 */}
          <div className="absolute inset-y-1 left-1/2 -translate-x-1/2 flex flex-col justify-between py-0.5">
            <div className="w-px h-1 bg-ink-700" />
            <div className="w-px h-1 bg-ink-700" />
            <div className="w-px h-1 bg-ink-700" />
          </div>
        </div>
      </div>

      {label && (
        <span className="font-mono text-xs text-textc-secondary tracking-wider uppercase group-hover:text-textc-primary transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}