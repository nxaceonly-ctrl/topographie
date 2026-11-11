export type UTM = { zone: number; E: number; N: number; south: boolean };
export type MGRS = { zone: number; band: string; sq: string; e: string; n: string; utm: UTM; text: string };
export type Parsed = { lat: number; lon: number; zone: number; E: number; N: number; south: boolean; prec: number };
export declare const GEO: {
  toMGRS(lat: number, lon: number): MGRS | null;
  parseMGRS(s: string): Parsed | null;
  toUTM(lat: number, lon: number, zone?: number): UTM & { zone: number };
  fromUTM(zone: number, E: number, N: number, south: boolean): { lat: number; lon: number };
  bearing(lat1: number, lon1: number, lat2: number, lon2: number): number;
  dist(lat1: number, lon1: number, lat2: number, lon2: number): number;
};
