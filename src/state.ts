export type Tool = 'line' | 'rect' | 'circle' | 'pen';
export type AnimationType = 'none' | 'spin' | 'pulse' | 'bounce' | 'ping' | 'wiggle';

export interface StudioState {
  innerSvg: string;
  history: string[];
  color: string;
  strokeWidth: number;
  lineCap: 'round' | 'butt' | 'square';
  rotate: number;
  flipX: boolean;
  flipY: boolean;
  showGrid: boolean;
  animation: AnimationType;
  tool: Tool;
}

export const state: StudioState = {
  innerSvg: `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />`,
  history: [],
  color: '#ccff00',
  strokeWidth: 2,
  lineCap: 'round',
  rotate: 0,
  flipX: false,
  flipY: false,
  showGrid: true,
  animation: 'none',
  tool: 'line',
};

export function pushHistory() {
  state.history.push(state.innerSvg);
  if (state.history.length > 30) state.history.shift();
}

export function getTransformAttribute(): string {
  const parts: string[] = [];
  if (state.rotate !== 0) {
    parts.push(`rotate(${state.rotate} 12 12)`);
  }
  if (state.flipX || state.flipY) {
    const sx = state.flipX ? -1 : 1;
    const sy = state.flipY ? -1 : 1;
    parts.push(`translate(12 12) scale(${sx} ${sy}) translate(-12 -12)`);
  }
  return parts.length ? ` transform="${parts.join(' ')}"` : '';
}

export function buildFullSvg(size = 24): string {
  const transformAttr = getTransformAttribute();
  const body = transformAttr
    ? `<g${transformAttr}>\n  ${state.innerSvg.trim()}\n  </g>`
    : state.innerSvg.trim();

  return `<svg xmlns="http://w3.org" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${state.color}" stroke-width="${state.strokeWidth}" stroke-linecap="${state.lineCap}" stroke-linejoin="round">\n  ${body}\n</svg>`;
}
