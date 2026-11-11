import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

// Valeur gardée sur le téléphone (survit à la fermeture de l'app).
export function usePersist<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(initial);
  const loaded = useRef(false);
  useEffect(() => {
    AsyncStorage.getItem('azimut.' + key)
      .then((s) => {
        if (s != null) setVal(JSON.parse(s));
      })
      .catch(() => {})
      .finally(() => (loaded.current = true));
  }, [key]);
  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem('azimut.' + key, JSON.stringify(val)).catch(() => {});
  }, [key, val]);
  return [val, setVal];
}

export const num = (v: string) => parseFloat(String(v).replace(',', '.'));
export const fmt = (n: number, d = 0) =>
  n.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: d });
export const toMil = (deg: number) => (deg * 6400) / 360;
