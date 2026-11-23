import { state, pushHistory } from './state';

export function setupCanvas(
  previewOverlay: SVGSVGElement,
  coordsEl: HTMLElement,
  onCommit: () => void
) {
  let isDrawing = false;
  let startPt: [number, number] =;
  let penPoints: [number, number][] = [];

  function getGridPoint(e: PointerEvent): [number, number] {
    const rect = previewOverlay.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 24);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 24);
    return [Math.max(0, Math.min(24, x)), Math.max(0, Math.min(24, y))];
  }

  previewOverlay.addEventListener('pointermove', (e) => {
    const [x, y] = getGridPoint(e);
    coordsEl.textContent = `GRID: ${x}, ${y} // SNAP: 1PX`;
    if (!isDrawing) return;

    previewOverlay.setAttribute('stroke', state.color);
    previewOverlay.setAttribute('stroke-width', String(state.strokeWidth));
    previewOverlay.setAttribute('stroke-linecap', state.lineCap);

    if (state.tool === 'line') {
      previewOverlay.innerHTML = `<line x1="${startPt[0]}" y1="${startPt[1]}" x2="${x}" y2="${y}" />`;
    } else if (state.tool === 'rect') {
      const rx = Math.min(startPt[0], x);
      const ry = Math.min(startPt[1], y);
      const rw = Math.abs(x - startPt[0]);
      const rh = Math.abs(y - startPt[1]);
      previewOverlay.innerHTML = `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="1" />`;
    } else if (state.tool === 'circle') {
      const r = Math.max(1, Math.round(Math.hypot(x - startPt[0], y - startPt[1])));
      previewOverlay.innerHTML = `<circle cx="${startPt[0]}" cy="${startPt[1]}" r="${r}" />`;
    } else if (state.tool === 'pen') {
      const last = penPoints[penPoints.length - 1];
      if (!last || last[0] !== x || last[1] !== y) {
        penPoints.push([x, y]);
        const d = penPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]} ${p[1]}`).join(' ');
        previewOverlay.innerHTML = `<path d="${d}" />`;
      }
    }
  });

  previewOverlay.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    startPt = getGridPoint(e);
    penPoints = [startPt];
  });

  window.addEventListener('pointerup', () => {
    if (!isDrawing) return;
    isDrawing = false;
    if (previewOverlay.innerHTML.trim()) {
      pushHistory();
      state.innerSvg = `${state.innerSvg}\n  ${previewOverlay.innerHTML.trim()}`.trim();
      previewOverlay.innerHTML = '';
      onCommit();
    }
  });
}
