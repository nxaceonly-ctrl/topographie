import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Btn, Label, Panel, Row, Seg, Txt } from '../components/ui';
import { PACKS, PackKey } from '../data';
import { usePersist } from '../storage';
import { fonts, useTheme } from '../theme';

type ListState = { done: Record<string, 1>; extra: string[]; removed: Record<string, 1> };
const empty = (): ListState => ({ done: {}, extra: [], removed: {} });

export default function PackScreen() {
  const t = useTheme();
  const [pack, setPack] = usePersist<PackKey>('packTab', 'terrain');
  const [all, setAll] = usePersist<Partial<Record<PackKey, ListState>>>('pack', {});
  const [newItem, setNewItem] = useState('');
  const st = all[pack] ?? empty();
  const update = (fn: (s: ListState) => ListState) =>
    setAll((p) => ({ ...p, [pack]: fn(JSON.parse(JSON.stringify(p[pack] ?? empty()))) }));

  const cats: [string, string[]][] = Object.entries(PACKS[pack]);
  if (st.extra.length) cats.push(['Mes ajouts', st.extra]);
  let total = 0, ok = 0;
  const visible = cats.map(([c, items]) => {
    const v = items.filter((i) => !st.removed[i]);
    total += v.length;
    ok += v.filter((i) => st.done[i]).length;
    return [c, v] as [string, string[]];
  });
  const pct = total ? Math.round((ok * 100) / total) : 0;

  function add() {
    const v = newItem.trim();
    if (!v) return;
    update((s) => {
      if (!s.extra.includes(v)) s.extra.push(v);
      delete s.removed[v];
      return s;
    });
    setNewItem('');
  }

  return (
    <View style={{ gap: 14 }}>
      <Panel title="Paquetage" code="CHECK" tone="warn">
        <Seg
          options={[{ value: 'terrain', label: 'Terrain' }, { value: 'perm', label: 'Perm' }, { value: 'stage', label: 'Stage' }]}
          value={pack}
          onChange={setPack}
        />
        <Row style={{ justifyContent: 'space-between' }}>
          <Label>{ok} / {total} prêts</Label>
          <Txt font="mono" size={12} dim>{pct} %</Txt>
        </Row>
        <View style={{ height: 4, backgroundColor: t.line }}>
          <View style={{ height: 4, width: `${pct}%`, backgroundColor: pct === 100 ? t.ok : t.acc }} />
        </View>
      </Panel>

      {visible.filter(([, v]) => v.length).map(([cat, items]) => (
        <Panel key={cat}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Label>{cat}</Label>
            <Txt font="mono" size={12} dim>{items.filter((i) => st.done[i]).length}/{items.length}</Txt>
          </Row>
          <View>
            {items.map((it, idx) => {
              const done = !!st.done[it];
              return (
                <Pressable
                  key={it}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: done }}
                  onPress={() => update((s) => { if (s.done[it]) delete s.done[it]; else s.done[it] = 1; return s; })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderTopWidth: idx ? 1 : 0, borderTopColor: t.line }}
                >
                  <View style={{ width: 18, height: 18, transform: [{ rotate: '45deg' }], borderWidth: 1, borderColor: done ? t.ok : t.line2, backgroundColor: done ? t.ok : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    {done && (
                      <Svg width={12} height={12} viewBox="0 0 24 24" style={{ transform: [{ rotate: '-45deg' }] }}>
                        <Path d="M5 12l5 5 9-10" stroke={t.onAcc} strokeWidth={3.5} fill="none" />
                      </Svg>
                    )}
                  </View>
                  <Txt style={{ flex: 1, textDecorationLine: done ? 'line-through' : 'none' }} color={done ? t.faint : t.text}>{it}</Txt>
                  <Pressable
                    hitSlop={10}
                    accessibilityLabel={'Retirer ' + it}
                    onPress={() => update((s) => { if (s.extra.includes(it)) s.extra = s.extra.filter((x) => x !== it); else s.removed[it] = 1; delete s.done[it]; return s; })}
                  >
                    <Txt size={18} color={t.faint}>×</Txt>
                  </Pressable>
                </Pressable>
              );
            })}
          </View>
        </Panel>
      ))}

      <Panel>
        <Label>Ajouter un objet</Label>
        <Row style={{ alignItems: 'center' }}>
          <TextInput
            value={newItem}
            onChangeText={setNewItem}
            onSubmitEditing={add}
            placeholder="Ex. : batterie externe"
            placeholderTextColor={t.faint}
            style={{ flex: 1, fontFamily: fonts.body, fontSize: 16, color: t.text, borderBottomWidth: 1, borderBottomColor: t.line2, paddingVertical: 8, outlineStyle: 'none' } as any}
          />
          <Btn label="Ajouter" onPress={add} />
        </Row>
        <Btn variant="secondary" label="Tout décocher" onPress={() => update(() => empty())} />
      </Panel>
    </View>
  );
}
