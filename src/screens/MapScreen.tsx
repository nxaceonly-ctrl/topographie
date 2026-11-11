import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Big, Btn, Field, Label, Panel, Row, Seg, Tile, Txt } from '../components/ui';
import { GEO } from '../geo';
import { fmt, num, toMil, usePersist } from '../storage';
import { useTheme } from '../theme';

const llText = (lat: number, lon: number) =>
  `${fmt(Math.abs(lat), 5)}° ${lat >= 0 ? 'N' : 'S'} · ${fmt(Math.abs(lon), 5)}° ${lon >= 0 ? 'E' : 'O'}`;

export default function MapScreen() {
  const t = useTheme();
  const [pos, setPos] = useState<{ lat: number; lon: number; acc: number } | null>(null);
  const [gpsMsg, setGpsMsg] = useState('Touche le bouton pour trouver ta position.');
  const [conv, setConv] = useState<'ll' | 'mg'>('ll');
  const [lat, setLat] = useState('45.1885');
  const [lon, setLon] = useState('5.7245');
  const [mg, setMg] = useState('31T GL 14026 07502');
  const [pA, setPA] = usePersist('pA', '31U DQ 48250 11951');
  const [pB, setPB] = usePersist('pB', '31U DQ 50100 13400');
  const [cm, setCm] = useState('4.2');
  const [scale, setScale] = useState<'25000' | '50000' | '100000'>('25000');
  const [pas, setPas] = usePersist('pas', '65');
  const [count, setCount] = usePersist('pasN', 0);

  async function locate() {
    setGpsMsg('Recherche du signal…');
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') return setGpsMsg('Accès à la position refusé. Autorise-le dans les réglages.');
      const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      setPos({ lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy ?? 0 });
      setGpsMsg(`Précision ± ${Math.round(p.coords.accuracy ?? 0)} m`);
    } catch {
      setGpsMsg('Position introuvable. Va à découvert et réessaie.');
    }
  }
  const myM = pos ? GEO.toMGRS(pos.lat, pos.lon) : null;

  // Conversion
  let convOut: React.ReactNode;
  if (conv === 'll') {
    const la = num(lat), lo = num(lon);
    const m = !isNaN(la) && !isNaN(lo) && la >= -80 && la <= 84 && Math.abs(lo) <= 180 ? GEO.toMGRS(la, lo) : null;
    convOut = m ? (
      <Tile>
        <Label>MGRS</Label>
        <Big size={21}>{m.text}</Big>
        <Txt font="mono" size={12} dim>UTM {m.zone}{m.band} · E {fmt(Math.round(m.utm.E))} · N {fmt(Math.round(m.utm.N))}</Txt>
      </Tile>
    ) : (
      <Txt font="mono" size={13} color={t.bad}>Latitude entre −80 et 84, longitude entre −180 et 180.</Txt>
    );
  } else {
    const p = GEO.parseMGRS(mg);
    convOut = p ? (
      <Tile>
        <Label>GPS (WGS84)</Label>
        <Big size={20}>{fmt(p.lat, 5)}, {fmt(p.lon, 5)}</Big>
        <Txt font="mono" size={12} dim>{llText(p.lat, p.lon)} · précision {p.prec} m</Txt>
      </Tile>
    ) : (
      <Txt font="mono" size={13} color={t.bad}>Format attendu : 31U DQ 48250 11951</Txt>
    );
  }

  // Azimut A → B
  const a = GEO.parseMGRS(pA), b = GEO.parseMGRS(pB);
  const az = a && b ? GEO.bearing(a.lat, a.lon, b.lat, b.lon) : 0;
  const d = a && b ? GEO.dist(a.lat, a.lon, b.lat, b.lon) : 0;
  const back = (az + 180) % 360;
  const pasN = num(pas);

  const cmV = num(cm), sc = +scale;
  const ground = isNaN(cmV) ? null : (cmV * sc) / 100;

  return (
    <View style={{ gap: 14 }}>
      <Panel title="Ma position" code="01 · GPS">
        <Btn label="Localiser ma position" onPress={locate} />
        {myM && pos ? (
          <Tile>
            <Label>MGRS</Label>
            <Big size={21}>{myM.text}</Big>
            <Txt font="mono" size={12} dim>{llText(pos.lat, pos.lon)}</Txt>
          </Tile>
        ) : null}
        <Txt size={13} dim>{gpsMsg}</Txt>
        {myM ? <Btn variant="secondary" label="Utiliser comme point de départ" onPress={() => setPA(myM.text)} /> : null}
      </Panel>

      <Panel title="Convertir" code="02 · CONV">
        <Seg options={[{ value: 'll', label: 'GPS → MGRS' }, { value: 'mg', label: 'MGRS → GPS' }]} value={conv} onChange={setConv} />
        {conv === 'll' ? (
          <Row>
            <Field label="Latitude" value={lat} onChangeText={setLat} keyboardType="numbers-and-punctuation" />
            <Field label="Longitude" value={lon} onChangeText={setLon} keyboardType="numbers-and-punctuation" />
          </Row>
        ) : (
          <Field label="Coordonnée MGRS" value={mg} onChangeText={setMg} autoCapitalize="characters" />
        )}
        {convOut}
      </Panel>

      <Panel title="Azimut et distance" code="03 · A→B">
        <Field label="Point de départ (MGRS)" value={pA} onChangeText={setPA} autoCapitalize="characters" />
        <Field label="Point d'arrivée (MGRS)" value={pB} onChangeText={setPB} autoCapitalize="characters" />
        {a && b ? (
          <View style={{ gap: 10 }}>
            <Row>
              <Tile style={{ flex: 1 }}>
                <Label>Azimut</Label>
                <Big size={21}>{Math.round(az)}°</Big>
                <Txt font="mono" size={12} dim>{fmt(Math.round(toMil(az)))} ‰</Txt>
              </Tile>
              <Tile style={{ flex: 1 }}>
                <Label>Distance</Label>
                <Big size={21}>{d < 1000 ? Math.round(d) + ' m' : fmt(d / 1000, 2) + ' km'}</Big>
                <Txt font="mono" size={12} dim>{pasN > 0 ? `≈ ${fmt(Math.round((d / 100) * pasN))} doubles pas` : ' '}</Txt>
              </Tile>
            </Row>
            <Tile>
              <Label>Azimut retour</Label>
              <Txt font="mono">{Math.round(back)}° · {fmt(Math.round(toMil(back)))} ‰</Txt>
            </Tile>
          </View>
        ) : (
          <Txt font="mono" size={13} color={t.bad}>Vérifie les deux coordonnées MGRS.</Txt>
        )}
      </Panel>

      <Panel title="Carte" code="04 · ÉCHELLE">
        <Seg options={[{ value: '25000', label: '1/25 000' }, { value: '50000', label: '1/50 000' }, { value: '100000', label: '1/100 000' }]} value={scale} onChange={setScale} />
        <Row style={{ alignItems: 'flex-end' }}>
          <Field label="Sur la carte (cm)" value={cm} onChangeText={setCm} keyboardType="decimal-pad" />
          <Tile style={{ flex: 1 }}>
            <Label>Sur le terrain</Label>
            <Big size={21}>{ground == null ? '—' : ground >= 1000 ? fmt(ground / 1000, 2) + ' km' : fmt(Math.round(ground)) + ' m'}</Big>
          </Tile>
        </Row>
        <Txt size={13} dim>Au 1/25 000, 1 cm sur la carte = 250 m, et un carreau du quadrillage = 1 km.</Txt>
      </Panel>

      <Panel title="Compte-pas" code="05 · PAS">
        <Row style={{ alignItems: 'flex-end' }}>
          <Field label="Doubles pas / 100 m" value={pas} onChangeText={setPas} keyboardType="number-pad" />
          <Tile style={{ flex: 1 }}>
            <Label>Distance</Label>
            <Big size={21}>{pasN > 0 ? fmt(Math.round((count * 100) / pasN)) + ' m' : '—'}</Big>
          </Tile>
        </Row>
        <Pressable
          onPress={() => setCount((c) => c + 1)}
          accessibilityLabel="Ajouter un double pas"
          style={({ pressed }) => ({
            alignSelf: 'center',
            width: 150,
            height: 150,
            borderRadius: 75,
            borderWidth: 1,
            borderColor: t.acc,
            backgroundColor: pressed ? t.accSoft : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <Big size={40}>{count}</Big>
          <Txt font="mono" size={9.5} dim caps spacing={1.6}>Doubles pas</Txt>
        </Pressable>
        <Row>
          <Btn variant="secondary" label="− 1" onPress={() => setCount((c) => Math.max(0, c - 1))} style={{ flex: 1 }} />
          <Btn variant="secondary" label="Remettre à zéro" onPress={() => setCount(0)} style={{ flex: 2 }} />
        </Row>
      </Panel>
    </View>
  );
}
