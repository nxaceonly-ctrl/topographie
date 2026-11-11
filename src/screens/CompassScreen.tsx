import React, { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Rose from '../components/Rose';
import { Big, Btn, Field, Panel, Row, Seg, Tile, Txt } from '../components/ui';
import { useHeading } from '../heading';
import { num, toMil, usePersist } from '../storage';
import { useTheme } from '../theme';

export default function CompassScreen() {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const [unit, setUnit] = usePersist<'deg' | 'mil'>('unit', 'deg');
  const [target, setTarget] = usePersist('target', '120');
  const [decl, setDecl] = usePersist('decl', '2');
  const [demo, setDemo] = useState(42);
  const { heading: sensor, state, start } = useHeading();
  const heading = state === 'on' && sensor != null ? sensor : demo;

  const show = (d: number) =>
    unit === 'deg'
      ? String(Math.round(d) % 360).padStart(3, '0') + '°'
      : String(Math.round(toMil(d)) % 6400).padStart(4, '0') + ' ‰';
  const amount = (d: number) => (unit === 'deg' ? Math.round(d) + '°' : Math.round(toMil(d)) + ' ‰');

  const tg = num(target);
  const dc = num(decl) || 0;
  const mag = isNaN(tg) ? null : (((tg - dc) % 360) + 360) % 360;
  const diff = mag == null ? 0 : (((mag - heading + 540) % 360) - 180);

  const status =
    state === 'on'
      ? 'Capteur actif · nord magnétique'
      : state === 'waiting'
        ? 'En attente du capteur…'
        : state === 'denied'
          ? 'Accès refusé. Autorise la boussole dans les réglages.'
          : state === 'unavailable'
            ? 'Pas de capteur ici. Mode démo : utilise les boutons.'
            : 'Mode démo : utilise les boutons, ou active le capteur.';

  const size = Math.min(300, width - 80);
  return (
    <View style={{ gap: 14 }}>
      <Panel title="Boussole" code="01 · CAP">
        <Seg options={[{ value: 'deg', label: 'Degrés' }, { value: 'mil', label: 'Millièmes' }]} value={unit} onChange={setUnit} />
        <View style={{ alignItems: 'center', paddingTop: 4 }}>
          <Rose heading={heading} target={mag} unit={unit} size={size} />
        </View>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Big size={44}>{show(heading)}</Big>
          <Txt size={13} dim style={{ textAlign: 'center' }}>{status}</Txt>
        </View>
        {state !== 'on' && (
          <Row gap={6}>
            {[-10, -1, 1, 10].map((d) => (
              <Btn key={d} variant="secondary" label={(d > 0 ? '+' : '−') + Math.abs(d) + '°'} onPress={() => setDemo((h) => (h + d + 360) % 360)} style={{ flex: 1, paddingHorizontal: 2 }} />
            ))}
          </Row>
        )}
        {state !== 'on' && <Btn label="Activer le capteur" onPress={start} />}
      </Panel>

      <Panel title="Suivre un azimut" code="02 · NAV">
        <Row>
          <Field label="Azimut carte (°)" value={target} onChangeText={setTarget} keyboardType="decimal-pad" />
          <Field label="Déclinaison (°E)" value={decl} onChangeText={setDecl} keyboardType="numbers-and-punctuation" />
        </Row>
        {mag == null ? (
          <Tile><Txt font="mono" size={13.5} color={t.acc}>Entre un azimut</Txt></Tile>
        ) : Math.abs(diff) <= 3 ? (
          <Tile tone="ok"><Txt font="mono" size={13.5} color={t.ok}>DANS L'AXE · boussole {show(mag)}</Txt></Tile>
        ) : (
          <Tile>
            <Txt font="mono" size={13.5} color={t.acc}>
              {diff > 0 ? 'Tourne à droite de ' : 'Tourne à gauche de '}
              {amount(Math.abs(diff))} · boussole {show(mag)}
            </Txt>
          </Tile>
        )}
        <Txt size={13} dim>
          La déclinaison sert à passer de l'azimut carte (nord géographique) à l'azimut boussole (nord magnétique). Vérifie la valeur dans la marge de ta carte.
        </Txt>
      </Panel>
    </View>
  );
}
