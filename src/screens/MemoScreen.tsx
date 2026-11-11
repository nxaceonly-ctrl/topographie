import React from 'react';
import { View } from 'react-native';
import { Panel, Tile, Txt } from '../components/ui';
import { IDEAS, NATO, TIPS } from '../data';
import { useTheme } from '../theme';

export default function MemoScreen() {
  const t = useTheme();
  const rows = [];
  for (let i = 0; i < 26; i += 2) rows.push([NATO[i], NATO[i + 1]]);
  return (
    <View style={{ gap: 14 }}>
      <Panel title="Alphabet OTAN" code="REF">
        <View>
          {rows.map((r, i) => (
            <View key={i} style={{ flexDirection: 'row', paddingVertical: 7, borderTopWidth: i ? 1 : 0, borderTopColor: t.line }}>
              {r.map((w) => (
                <View key={w} style={{ flex: 1, flexDirection: 'row', gap: 12 }}>
                  <Txt font="mono" color={t.acc} style={{ width: 16 }}>{w[0]}</Txt>
                  <Txt>{w}</Txt>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Panel>
      <Panel title="Repères utiles" code="REF">
        {TIPS.map((x) => (
          <Tile key={x}><Txt size={14}>{x}</Txt></Tile>
        ))}
      </Panel>
      <Panel title="Idées à ajouter" code="À VENIR" tone="warn">
        {IDEAS.map(([title, d], i) => (
          <View key={title} style={{ flexDirection: 'row', gap: 12, paddingTop: i ? 10 : 0, borderTopWidth: i ? 1 : 0, borderTopColor: t.line }}>
            <Txt font="mono" color={t.warn}>+</Txt>
            <View style={{ flex: 1 }}>
              <Txt font="bodyBold">{title}</Txt>
              <Txt size={13} dim>{d}</Txt>
            </View>
          </View>
        ))}
      </Panel>
      <Txt size={12.5} dim style={{ textAlign: 'center', paddingHorizontal: 8 }}>
        Application non officielle, sans lien avec le ministère des Armées. Vérifie toujours avec ta carte et ta boussole réglementaires.
      </Txt>
    </View>
  );
}
