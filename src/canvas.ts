import { state, pushHistory } from './state';

interface Point {
  x: number;
  y: number;
}

export function setupCanvas(
  previewOverlay: SVGSVGElement,
  coordsEl: HTMLElement,
  onCommit: () => void
) {
  let isDrawing = false;
  let startPt: Point = { x: 0, y: 0 };
  let penPoints: Point[] = [];

  function getGridPoint(e: PointerEvent): Point {
    const rect = previewOverlay.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 24);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 24);
    return {
      x: Math.max(0, Math.min(24, x)),
      y: Math.max(0, Math.min(24, y)),
    };
  }

  previewOverlay.addEventListener('pointermove', (e) => {
    const pt = getGridPoint(e);
    coordsEl.textContent = `GRID: ${pt.x}, ${pt.y} // SNAP: 1PX`;
    if (!isDrawing) return;

    previewOverlay.setAttribute('stroke', state.color);
    previewOverlay.setAttribute('stroke-width', String(state.strokeWidth));
    previewOverlay.setAttribute('stroke-linecap', state.lineCap);

    if (state.tool === 'line') {
      previewOverlay.innerHTML = `<line x1="${startPt.x}" y1="${startPt.y}" x2="${pt.x}" y2="${pt.y}" />`;
    } else if (state.tool === 'rect') {
      const rx = Math.min(startPt.x, pt.x);
      const ry = Math.min(startPt.y, pt.y);
      const rw = Math.abs(pt.x - startPt.x);
      const rh = Math.abs(pt.y - startPt.y);
      previewOverlay.innerHTML = `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="1" />`;
    } else if (state.tool === 'circle') {
      const r = Math.max(1, Math.round(Math.hypot(pt.x - startPt.x, pt.y - startPt.y)));
      previewOverlay.innerHTML = `<circle cx="${startPt.x}" cy="${startPt.y}" r="${r}" />`;
    } else if (state.tool === 'pen') {
      const last = penPoints[penPoints.length - 1];
      if (!last || last.x !== pt.x || last.y !== pt.y) {
        penPoints.push(pt);
        const d = penPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
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
