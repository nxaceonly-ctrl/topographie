import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export type HeadingState = 'off' | 'waiting' | 'on' | 'denied' | 'unavailable';

// Cap du téléphone (nord magnétique), en degrés.
// iPhone/Android natif : expo-location. Version web : capteur d'orientation du navigateur.
export function useHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  const [state, setState] = useState<HeadingState>('off');
  const stop = useRef<() => void>(() => {});

  useEffect(() => () => stop.current(), []);

  const start = useCallback(async () => {
    stop.current();
    setState('waiting');
    if (Platform.OS !== 'web') {
      try {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (perm.status !== 'granted') return setState('denied');
        const sub = await Location.watchHeadingAsync((h) => {
          if (h.magHeading >= 0) {
            setHeading(h.magHeading);
            setState('on');
          }
        });
        stop.current = () => sub.remove();
      } catch {
        setState('unavailable');
      }
      return;
    }
    // Web (Safari iPhone : la permission doit être demandée au toucher d'un bouton).
    const DOE: any = typeof window !== 'undefined' ? (window as any).DeviceOrientationEvent : undefined;
    if (!DOE) return setState('unavailable');
    try {
      if (typeof DOE.requestPermission === 'function') {
        const r = await DOE.requestPermission();
        if (r !== 'granted') return setState('denied');
      }
    } catch {
      return setState('denied');
    }
    const onOri = (e: any) => {
      let h: number | null = null;
      if (typeof e.webkitCompassHeading === 'number') h = e.webkitCompassHeading;
      else if (e.absolute && e.alpha != null) h = 360 - e.alpha;
      if (h == null) return;
      setHeading(((h % 360) + 360) % 360);
      setState('on');
    };
    window.addEventListener('deviceorientationabsolute' as any, onOri);
    window.addEventListener('deviceorientation', onOri);
    const timer = setTimeout(() => setState((s) => (s === 'waiting' ? 'unavailable' : s)), 3000);
    stop.current = () => {
      clearTimeout(timer);
      window.removeEventListener('deviceorientationabsolute' as any, onOri);
      window.removeEventListener('deviceorientation', onOri);
    };
  }, []);

  return { heading, state, start };
}
