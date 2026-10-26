export interface Scale {
  max: number;
  ticks: number[];
}

const NICE_FACTORS = [1, 2, 2.5, 5, 10];

function niceStep(raw: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const factor = NICE_FACTORS.find((f) => f * magnitude >= raw) ?? 10;
  return factor * magnitude;
}

/**
 * Y-axis scale with round ticks that covers `maxValue`.
 * E.g. 350 with 4 intervals → step 100, max 400, ticks 0…400 (as in the design).
 * Recharts' own "nice" ticks give 0, 95, 190… for the same input.
 */
export function niceScale(maxValue: number, intervals = 4): Scale {
  if (!(maxValue > 0)) return { max: 1, ticks: [0, 1] };

  const step = niceStep(maxValue / intervals);
  const max = Math.ceil(maxValue / step) * step;
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  return { max, ticks };
}
