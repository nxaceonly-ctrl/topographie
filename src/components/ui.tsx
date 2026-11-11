import React from 'react';
import { Pressable, StyleProp, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { fonts, useTheme } from '../theme';

type TxtProps = {
  children: React.ReactNode;
  font?: keyof typeof fonts;
  size?: number;
  color?: string;
  dim?: boolean;
  caps?: boolean;
  spacing?: number;
  style?: StyleProp<TextStyle>;
};
export function Txt({ children, font = 'body', size = 15, color, dim, caps, spacing, style }: TxtProps) {
  const t = useTheme();
  return (
    <Text
      style={[
        { fontFamily: fonts[font], fontSize: size, color: color ?? (dim ? t.dim : t.text), letterSpacing: spacing },
        caps && { textTransform: 'uppercase' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// Petite étiquette en capitales (police mono).
export const Label = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <Txt font="mono" size={10.5} dim color={color} caps spacing={1.4} style={{ marginBottom: 4 }}>
    {children}
  </Txt>
);

// Coin en équerre (repère "HUD").
function Corner({ pos, color }: { pos: 'tl' | 'tr' | 'bl' | 'br'; color: string }) {
  const s = 10;
  const top = pos[0] === 't', left = pos[1] === 'l';
  const st: ViewStyle = {
    position: 'absolute', width: s, height: s, borderColor: color,
    ...(top ? { top: -1, borderTopWidth: 2 } : { bottom: -1, borderBottomWidth: 2 }),
    ...(left ? { left: -1, borderLeftWidth: 2 } : { right: -1, borderRightWidth: 2 }),
  };
  return <View pointerEvents="none" style={st} />;
}

// Panneau avec titre, code et coins en équerre.
export function Panel({
  title,
  code,
  tone = 'acc',
  children,
  style,
}: {
  title?: string;
  code?: string;
  tone?: 'acc' | 'warn';
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const c = tone === 'warn' ? t.warn : t.acc;
  return (
    <View style={[{ backgroundColor: t.panel, borderWidth: 1, borderColor: t.line2, padding: 16, gap: 14 }, style]}>
      <Corner pos="tl" color={c} />
      <Corner pos="br" color={c} />
      {title ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Txt font="disp" size={13} caps spacing={3}>
            {title}
          </Txt>
          {code ? (
            <Txt font="mono" size={10.5} color={c} spacing={0.8}>
              {code}
            </Txt>
          ) : null}
          <View style={{ flex: 1, height: 1, backgroundColor: t.line2 }} />
        </View>
      ) : null}
      {children}
    </View>
  );
}

// Encadré de résultat (filet bleu à gauche).
export function Tile({ children, style, tone = 'acc' }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: 'acc' | 'ok' }) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: t.line,
          borderLeftWidth: 2,
          borderLeftColor: tone === 'ok' ? t.ok : t.acc,
          backgroundColor: tone === 'ok' ? t.okSoft : t.accSoft,
          paddingVertical: 10,
          paddingHorizontal: 12,
          gap: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Big({ children, size = 24, color }: { children: React.ReactNode; size?: number; color?: string }) {
  return (
    <Txt font="monoBold" size={size} color={color} style={{ fontVariant: ['tabular-nums'] }}>
      {children}
    </Txt>
  );
}

export function Field({ label, style, ...rest }: TextInputProps & { label: string }) {
  const t = useTheme();
  const [focus, setFocus] = React.useState(false);
  return (
    <View style={[{ flex: 1, minWidth: 0 }, style as ViewStyle]}>
      <Label>{label}</Label>
      <TextInput
        placeholderTextColor={t.faint}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        autoCorrect={false}
        style={{
          fontFamily: fonts.mono,
          fontSize: 16,
          color: t.text,
          paddingVertical: 8,
          paddingHorizontal: 2,
          borderBottomWidth: focus ? 2 : 1,
          borderBottomColor: focus ? t.acc : t.line2,
          outlineStyle: 'none',
        } as unknown as TextStyle}
        {...rest}
      />
    </View>
  );
}

export function Btn({
  label,
  onPress,
  variant = 'primary',
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const prim = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        {
          paddingVertical: 13,
          paddingHorizontal: 14,
          alignItems: 'center',
          backgroundColor: prim ? t.acc : 'transparent',
          borderWidth: 1,
          borderColor: t.acc,
          opacity: pressed ? 0.65 : 1,
        },
        style,
      ]}
    >
      <Txt font="disp" size={13} caps spacing={2.4} color={prim ? t.onAcc : t.acc} style={{ textAlign: 'center' }}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function Seg<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: t.line2 }}>
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={{
              flex: 1,
              paddingVertical: 9,
              alignItems: 'center',
              backgroundColor: on ? t.acc : 'transparent',
              borderLeftWidth: i ? 1 : 0,
              borderLeftColor: t.line,
            }}
          >
            <Txt font="disp" size={12} caps spacing={1.6} color={on ? t.onAcc : t.dim}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

export const Row = ({ children, gap = 10, style }: { children: React.ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) => (
  <View style={[{ flexDirection: 'row', gap, alignItems: 'flex-start' }, style]}>{children}</View>
);
