// SVG 锥形瓶视窗
import { useEffect, useRef } from 'react';
import { useSimStore } from '@/store/simStore';

interface FlaskVisualProps {
  color: string;
}

export default function FlaskVisual({ color }: FlaskVisualProps) {
  const isAnimatingDrop = useSimStore((s) => s.isAnimatingDrop);
  const stage = useSimStore((s) => s.stage);
  const status = useSimStore((s) => s.status);
  const resetTick = useSimStore((s) => s.resetTick);
  const prevColor = useRef(color);
  const isFlashing = useRef(false);

  useEffect(() => {
    prevColor.current = color;
  }, [color]);

  useEffect(() => {
    isFlashing.current = true;
    const t = setTimeout(() => {
      isFlashing.current = false;
    }, 600);
    return () => clearTimeout(t);
  }, [resetTick]);

  const isLocked = status === 'STAGE_2_PINK_LOCK' || status === 'STAGE_1_OVERSHOT';
  const liquidHeight = 70; // 液体填充高度（瓶身 %）
  const liquidTopY = 130 - (liquidHeight / 100) * 100;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 背景网格 */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(122,138,168,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(122,138,168,0.08) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          maskImage:
            'radial-gradient(ellipse 60% 60% at center, black 30%, transparent 75%)',
        }}
      />

      {/* 滴定管 */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
        width="40"
        height="140"
        viewBox="0 0 40 140"
      >
        {/* 管壁 */}
        <rect
          x="14"
          y="0"
          width="12"
          height="120"
          fill="none"
          stroke="rgba(232,236,244,0.18)"
          strokeWidth="1"
        />
        {/* 刻度 */}
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1={i % 2 === 0 ? 8 : 12}
            y1={20 + i * 12}
            x2={14}
            y2={20 + i * 12}
            stroke="rgba(232,236,244,0.15)"
            strokeWidth="0.6"
          />
        ))}
        {/* 内部液体（EDTA） */}
        <rect
          x="16"
          y="20"
          width="8"
          height="100"
          fill="#4DD0E1"
          opacity="0.18"
        />
        <rect
          x="16"
          y="20"
          width="8"
          height="100"
          fill="url(#edtaGrad)"
          opacity="0.6"
        />
        <defs>
          <linearGradient id="edtaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4DD0E1" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#4DD0E1" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        {/* 管嘴 */}
        <path
          d="M 14 120 L 26 120 L 22 132 L 18 132 Z"
          fill="rgba(232,236,244,0.1)"
          stroke="rgba(232,236,244,0.25)"
          strokeWidth="0.8"
        />
        {/* 滴下的液滴 */}
        {isAnimatingDrop && (
          <circle
            key={Date.now()}
            cx="20"
            cy="138"
            r="2.5"
            fill="#4DD0E1"
            className="animate-drop-fall"
            style={{ filter: 'drop-shadow(0 0 4px #4DD0E1)' }}
          />
        )}
      </svg>

      {/* 锥形瓶 SVG */}
      <svg
        width="240"
        height="280"
        viewBox="0 0 240 280"
        className="relative z-0"
      >
        <defs>
          {/* 玻璃质感渐变 */}
          <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
          </linearGradient>
          {/* 液体高光 */}
          <linearGradient id="liquidShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="20%" stopColor="rgba(255,255,255,0)" />
            <stop offset="80%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>
          {/* 液体色渐变 */}
          <radialGradient id="liquidGrad" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.85" />
          </radialGradient>
          {/* 软阴影 */}
          <filter id="liquidGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="flaskClip">
            <path d="M 70 130 L 70 160 Q 70 170 60 180 L 30 220 Q 20 232 20 248 L 20 260 Q 20 268 28 268 L 212 268 Q 220 268 220 260 L 220 248 Q 220 232 210 220 L 180 180 Q 170 170 170 160 L 170 130 Z" />
          </clipPath>
        </defs>

        {/* 锥形瓶外形 */}
        <path
          d="M 70 130 L 70 160 Q 70 170 60 180 L 30 220 Q 20 232 20 248 L 20 260 Q 20 268 28 268 L 212 268 Q 220 268 220 260 L 220 248 Q 220 232 210 220 L 180 180 Q 170 170 170 160 L 170 130 Z"
          fill="rgba(15, 21, 36, 0.4)"
          stroke="rgba(232, 236, 244, 0.2)"
          strokeWidth="1.5"
        />

        {/* 瓶口 */}
        <rect
          x="60"
          y="80"
          width="120"
          height="50"
          fill="rgba(15, 21, 36, 0.4)"
          stroke="rgba(232, 236, 244, 0.2)"
          strokeWidth="1.5"
        />
        <line x1="60" y1="90" x2="180" y2="90" stroke="rgba(232,236,244,0.1)" strokeWidth="0.5" />

        {/* 液体（夹在瓶内） */}
        <g clipPath="url(#flaskClip)">
          <rect
            x="0"
            y={liquidTopY}
            width="240"
            height="200"
            fill="url(#liquidGrad)"
            style={{
              filter: isLocked ? 'drop-shadow(0 0 12px rgba(255,45,117,0.5))' : 'drop-shadow(0 0 12px rgba(77,208,225,0.25))',
              transition: 'fill 300ms ease, filter 300ms ease',
            }}
          />
          {/* 高光带 */}
          <rect
            x="0"
            y={liquidTopY}
            width="240"
            height="200"
            fill="url(#liquidShine)"
            opacity="0.5"
          />
          {/* 液面波纹 */}
          <ellipse
            cx="120"
            cy={liquidTopY}
            rx="50"
            ry="2"
            fill={color}
            opacity="0.7"
            style={{ transition: 'fill 300ms ease' }}
          />
          {/* 重置闪烁白边 */}
          {isFlashing.current && (
            <rect
              x="0"
              y="0"
              width="240"
              height="280"
              fill="white"
              opacity="0.3"
            >
              <animate attributeName="opacity" values="0.3;0;0.3;0" dur="0.6s" repeatCount="1" />
            </rect>
          )}
        </g>

        {/* 玻璃反光 */}
        <path
          d="M 70 130 L 70 160 Q 70 170 60 180 L 30 220 Q 20 232 20 248 L 20 260 Q 20 268 28 268 L 212 268 Q 220 268 220 260 L 220 248 Q 220 232 210 220 L 180 180 Q 170 170 170 160 L 170 130 Z"
          fill="url(#glassGrad)"
          pointerEvents="none"
        />

        {/* 体积刻度线 */}
        <g stroke="rgba(232,236,244,0.3)" strokeWidth="0.6">
          <line x1="170" y1="150" x2="180" y2="150" />
          <line x1="170" y1="180" x2="178" y2="180" />
          <line x1="170" y1="210" x2="180" y2="210" />
          <line x1="170" y1="240" x2="178" y2="240" />
        </g>
        <text x="184" y="153" fontSize="8" fill="rgba(232,236,244,0.4)" fontFamily="JetBrains Mono">
          10
        </text>
        <text x="184" y="213" fontSize="8" fill="rgba(232,236,244,0.4)" fontFamily="JetBrains Mono">
          20
        </text>
        <text x="184" y="243" fontSize="8" fill="rgba(232,236,244,0.4)" fontFamily="JetBrains Mono">
          25
        </text>

        {/* 标签 */}
        <text
          x="120"
          y="50"
          fontSize="11"
          fill="rgba(232,236,244,0.5)"
          fontFamily="JetBrains Mono"
          textAnchor="middle"
          letterSpacing="2"
        >
          {stage === 1 ? 'FLASK · Zn STANDARD' : 'FLASK · Na₂SO₄ SAMPLE'}
        </text>
        <text
          x="120"
          y="65"
          fontSize="8"
          fill="rgba(122,138,168,0.6)"
          fontFamily="JetBrains Mono"
          textAnchor="middle"
          letterSpacing="1.5"
        >
          {stage === 1 ? '25.00 mL · 0.0500 mol/L Zn²⁺' : '试样就绪 · pH 实时监控'}
        </text>

        {/* 锁定警告标签 */}
        {isLocked && (
          <g>
            <rect x="40" y="100" width="160" height="22" fill="rgba(255,45,117,0.15)" stroke="rgba(255,45,117,0.6)" />
            <text
              x="120"
              y="115"
              fontSize="11"
              fill="#FF2D75"
              fontFamily="JetBrains Mono"
              textAnchor="middle"
              letterSpacing="2"
              fontWeight="600"
            >
              ⚠ {status === 'STAGE_1_OVERSHOT' ? '过量滴定' : '系统锁死'}
            </text>
          </g>
        )}
      </svg>

      {/* 底部基座阴影 */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-3 rounded-full blur-md"
        style={{ background: color, opacity: 0.15 }}
      />
    </div>
  );
}