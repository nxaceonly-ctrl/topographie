import React from 'react';
import Svg, { Circle, G, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { fonts, useTheme } from '../theme';
import { toMil } from '../storage';

// Rose de boussole : le cadran tourne, l'index rouge en haut reste fixe.
export default function Rose({ heading, target, unit, size }: { heading: number; target: number | null; unit: 'deg' | 'mil'; size: number }) {
  const t = useTheme();
  const c = 150;
  const ticks = [];
  for (let i = 0; i < 360; i += 5) {
    const L = i % 30 === 0 ? 17 : i % 10 === 0 ? 11 : 6;
    const a = (i * Math.PI) / 180;
    ticks.push(
      <Line
        key={i}
        x1={c + Math.sin(a) * (140 - L)}
        y1={c - Math.cos(a) * (140 - L)}
        x2={c + Math.sin(a) * 140}
        y2={c - Math.cos(a) * 140}
        stroke={i % 90 === 0 ? t.text : t.faint}
        strokeWidth={i % 30 === 0 ? 1.6 : 0.8}
      />
    );
  }
  const card: Record<number, string> = { 0: 'N', 90: 'E', 180: 'S', 270: 'O' };
  const labels = [];
  for (let i = 0; i < 360; i += 30) {
    const a = (i * Math.PI) / 180;
    const isC = card[i] !== undefined;
    const r = isC ? 104 : 110;
    labels.push(
      <SvgText
        key={i}
        x={c + Math.sin(a) * r}
        y={c - Math.cos(a) * r}
        fill={i === 0 ? t.bad : isC ? t.text : t.dim}
        fontSize={isC ? 22 : 11}
        fontFamily={isC ? fonts.dispBold : fonts.mono}
        textAnchor="middle"
        alignmentBaseline="central"
        transform={`rotate(${i} ${c + Math.sin(a) * r} ${c - Math.cos(a) * r})`}
      >
        {isC ? card[i] : unit === 'deg' ? String(i) : String(Math.round(toMil(i) / 100))}
      </SvgText>
    );
  }
  const ta = target != null ? (target * Math.PI) / 180 : 0;
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300">
      <Circle cx={c} cy={c} r={144} fill={t.rose} stroke={t.line2} strokeWidth={1} />
      <G transform={`rotate(${-heading} ${c} ${c})`}>
        {ticks}
        {labels}
        {target != null && (
          <Line x1={c + Math.sin(ta) * 30} y1={c - Math.cos(ta) * 30} x2={c + Math.sin(ta) * 84} y2={c - Math.cos(ta) * 84} stroke={t.ok} strokeWidth={3} />
        )}
      </G>
      <Polygon points={`${c},${c - 76} ${c + 6},${c} ${c - 6},${c}`} fill={t.bad} />
      <Polygon points={`${c},${c + 76} ${c + 6},${c} ${c - 6},${c}`} fill={t.faint} />
      <Circle cx={c} cy={c} r={4} fill={t.acc} />
      <Line x1={c} y1={0} x2={c} y2={14} stroke={t.bad} strokeWidth={2} />
    </Svg>
  );
}
