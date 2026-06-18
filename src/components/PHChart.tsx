// pH 跌落监控折线图
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts';
import { useSimStore } from '@/store/simStore';

export default function PHChart() {
  const history = useSimStore((s) => s.history);
  const bufferEnabled = useSimStore((s) => s.bufferEnabled);

  return (
    <div className="relative h-full w-full p-3 border border-ink-700 bg-ink-900/60 rounded-sm backdrop-blur-sm">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-led-blue animate-led-blink" style={{ filter: 'drop-shadow(0 0 4px currentColor)', color: '#4DD0E1' }} />
          <span className="font-mono text-[10px] tracking-[0.25em] text-textc-primary">
            pH 遥测曲线
          </span>
          <span className="font-mono text-[9px] text-textc-disabled tracking-wider">
            记录 {history.length} 点
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Legend color="#FF2D75" label="警戒线 6.5" />
          {bufferEnabled && <Legend color="#00E676" label="缓冲 pH 10" />}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="88%">
        <ComposedChart
          data={history}
          margin={{ top: 10, right: 16, left: -10, bottom: 4 }}
        >
          <defs>
            <linearGradient id="phAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4DD0E1" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#4DD0E1" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="2 4"
            stroke="rgba(122,138,168,0.12)"
            vertical={true}
          />

          <XAxis
            dataKey="volume"
            type="number"
            domain={[0, 30]}
            ticks={[0, 5, 10, 15, 19.5, 20, 20.5, 25, 30]}
            stroke="rgba(122,138,168,0.4)"
            tick={{ fill: '#7A8AA8', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            tickLine={{ stroke: 'rgba(122,138,168,0.3)' }}
            label={{
              value: 'EDTA 体积 (mL)',
              position: 'insideBottom',
              offset: -2,
              fill: '#7A8AA8',
              fontSize: 9,
              fontFamily: 'JetBrains Mono',
              letterSpacing: 1,
            }}
          />

          <YAxis
            domain={[3.5, 14]}
            ticks={[3.5, 6.5, 10, 14]}
            stroke="rgba(122,138,168,0.4)"
            tick={{ fill: '#7A8AA8', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            tickLine={{ stroke: 'rgba(122,138,168,0.3)' }}
            width={28}
            label={{
              value: 'pH',
              angle: -90,
              position: 'insideLeft',
              offset: 16,
              fill: '#7A8AA8',
              fontSize: 9,
              fontFamily: 'JetBrains Mono',
            }}
          />

          {/* 警示红线 6.5 */}
          <ReferenceLine
            y={6.5}
            stroke="#FF2D75"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{
              value: '警戒线 6.5',
              position: 'insideTopRight',
              fill: '#FF2D75',
              fontSize: 9,
              fontFamily: 'JetBrains Mono',
              letterSpacing: 1,
            }}
          />

          {/* 缓冲液 10 */}
          {bufferEnabled && (
            <ReferenceLine
              y={10}
              stroke="#00E676"
              strokeDasharray="2 4"
              strokeWidth={1}
              opacity={0.6}
            />
          )}

          {/* 19.5 / 20 / 20.5 标线 */}
          <ReferenceLine x={19.5} stroke="#FFB300" strokeDasharray="3 3" strokeWidth={0.5} opacity={0.5} />
          <ReferenceLine x={20} stroke="#4DD0E1" strokeDasharray="3 3" strokeWidth={0.5} opacity={0.5} />
          <ReferenceLine x={20.5} stroke="#FF5252" strokeDasharray="3 3" strokeWidth={0.5} opacity={0.5} />

          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 21, 36, 0.95)',
              border: '1px solid rgba(77,208,225,0.4)',
              borderRadius: 2,
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              padding: '6px 10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
            labelStyle={{ color: '#7A8AA8', fontSize: 9, letterSpacing: 1 }}
            itemStyle={{ color: '#4DD0E1' }}
            formatter={(v: number) => [`pH ${v.toFixed(2)}`, '']}
            labelFormatter={(v) => `体积 = ${Number(v).toFixed(2)} mL`}
          />

          {/* 区域填充 */}
          <Area
            type="monotone"
            dataKey="pH"
            stroke="none"
            fill="url(#phAreaGrad)"
            isAnimationActive={false}
          />

          {/* 主折线 */}
          <Line
            type="monotone"
            dataKey="pH"
            stroke="#4DD0E1"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, index, payload } = props as any;
              const isLast = index === history.length - 1;
              const isAlert = payload.pH < 6.5;
              const color = isAlert ? '#FF2D75' : isLast ? '#E8ECF4' : '#4DD0E1';
              const r = isLast ? 4 : 2;
              return (
                <g key={`dot-${index}`}>
                  <circle cx={cx} cy={cy} r={r} fill={color} stroke="#0F1524" strokeWidth={1} />
                  {isLast && (
                    <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={isAlert ? '#FF2D75' : '#4DD0E1'} strokeWidth={1} opacity={0.5}>
                      <animate attributeName="r" values={`${r};${r + 8};${r}`} dur="1.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0;0.7" dur="1.4s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* 角落装饰 */}
      <CornerOrnament className="absolute top-1.5 left-1.5" />
      <CornerOrnament className="absolute top-1.5 right-1.5 rotate-90" />
      <CornerOrnament className="absolute bottom-1.5 left-1.5 -rotate-90" />
      <CornerOrnament className="absolute bottom-1.5 right-1.5 rotate-180" />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-3 h-px" style={{ background: color }} />
      <span className="font-mono text-[9px] text-textc-secondary tracking-wider">{label}</span>
    </div>
  );
}

function CornerOrnament({ className = '' }: { className?: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" className={className}>
      <path d="M 0 0 L 8 0 L 8 1 L 1 1 L 1 8 L 0 8 Z" fill="rgba(77,208,225,0.5)" />
    </svg>
  );
}