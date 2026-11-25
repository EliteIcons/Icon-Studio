import './style.css';
import {
  Tool,
  AnimationType,
  state,
  pushHistory,
  getTransformAttribute,
  buildFullSvg,
} from './state';
import { setupCanvas } from './canvas';
import {
  copySvgCode,
  downloadSvgFile,
  exportPngFile,
  copyAnimationCss,
} from './exporters';
import { WORKBENCH_HTML } from './template';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = WORKBENCH_HTML;

const editorSvg = document.getElementById('editor-svg') as unknown as SVGSVGElement;
const previewOverlay = document.getElementById('preview-overlay') as unknown as SVGSVGElement;
const codeEditor = document.getElementById('code-editor') as HTMLTextAreaElement;
const animStage = document.getElementById('anim-stage')!;
const coordsEl = document.getElementById('coords')!;
const toastEl = document.getElementById('toast')!;

function showToast(msg: string) {
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), 1800);
}

function render() {
  editorSvg.setAttribute('stroke', state.color);
  editorSvg.setAttribute('stroke-width', String(state.strokeWidth));
  editorSvg.setAttribute('stroke-linecap', state.lineCap);
  editorSvg.setAttribute('stroke-linejoin', 'round');

  const transformAttr = getTransformAttribute();
  editorSvg.innerHTML = transformAttr
    ? `<g${transformAttr}>${state.innerSvg}</g>`
    : state.innerSvg;

  codeEditor.value = buildFullSvg(24);

  animStage.innerHTML = buildFullSvg(48);
  const animSvg = animStage.querySelector('svg');
  if (animSvg && state.animation !== 'none') {
    animSvg.classList.add(`anim-${state.animation}`);
  }

  document.getElementById('pixel-grid')!.style.display = state.showGrid ? 'block' : 'none';
  document.getElementById('lbl-color')!.textContent = state.color.toUpperCase();
  document.getElementById('lbl-stroke')!.textContent = `${state.strokeWidth}PX`;
}

setupCanvas(previewOverlay, coordsEl, render);

// Tool buttons
document.querySelectorAll<HTMLButtonElement>('.tool-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tool-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.tool = btn.dataset.tool as Tool;
  });
});

// Undo & Clear
document.getElementById('btn-undo')!.addEventListener('click', () => {
  if (state.history.length > 0) {
    state.innerSvg = state.history.pop()!;
    render();
  }
});

document.getElementById('btn-clear')!.addEventListener('click', () => {
  pushHistory();
  state.innerSvg = '';
  render();
});

// Transforms
document.getElementById('btn-rot-left')!.addEventListener('click', () => {
  state.rotate = (state.rotate + 270) % 360;
  render();
});
document.getElementById('btn-rot-right')!.addEventListener('click', () => {
  state.rotate = (state.rotate + 90) % 360;
  render();
});
document.getElementById('btn-flip-x')!.addEventListener('click', () => {
  state.flipX = !state.flipX;
  render();
});
document.getElementById('btn-flip-y')!.addEventListener('click', () => {
  state.flipY = !state.flipY;
  render();
});

// Style controls
document.getElementById('inp-color')!.addEventListener('input', (e) => {
  state.color = (e.target as HTMLInputElement).value;
  render();
});
document.getElementById('inp-stroke')!.addEventListener('input', (e) => {
  state.strokeWidth = Number((e.target as HTMLInputElement).value);
  render();
});
document.getElementById('chk-grid')!.addEventListener('change', (e) => {
  state.showGrid = (e.target as HTMLInputElement).checked;
  render();
});

document.querySelectorAll<HTMLButtonElement>('#cap-group button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#cap-group button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.lineCap = btn.dataset.cap as 'round' | 'butt' | 'square';
    render();
  });
});

// Animations
document.querySelectorAll<HTMLButtonElement>('#anim-group button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#anim-group button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.animation = btn.dataset.anim as AnimationType;
    render();
  });
});

document.getElementById('btn-copy-css')!.addEventListener('click', () => {
  copyAnimationCss(state.animation, showToast);
});

// Live code editor apply
document.getElementById('btn-apply-code')!.addEventListener('click', () => {
  const raw = codeEditor.value.trim();
  const inner = raw.replace(/^<svg[^>]*>/i, '').replace(/<\/svg>$/i, '').trim();
  pushHistory();
  state.rotate = 0;
  state.flipX = false;
  state.flipY = false;
  state.innerSvg = inner;
  render();
  showToast('APPLIED SVG CODE!');
});

// Exporters
document.getElementById('btn-copy-svg')!.addEventListener('click', () => copySvgCode(showToast));
document.getElementById('btn-dl-svg')!.addEventListener('click', () => downloadSvgFile(showToast));
document.getElementById('btn-dl-png')!.addEventListener('click', () => exportPngFile(512, showToast));

// Shareable live studio link
document.getElementById('btn-share-link')!.addEventListener('click', () => {
  const params = new URLSearchParams();
  params.set('svg', buildFullSvg(24));
  params.set('color', state.color.replace('#', ''));
  params.set('stroke', String(state.strokeWidth));
  if (state.animation !== 'none') {
    params.set('anim', state.animation);
  }
  const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  navigator.clipboard.writeText(shareUrl);
  showToast('COPIED SHAREABLE STUDIO LINK!');
});

// Import Modal
const modal = document.getElementById('modal')!;
document.getElementById('btn-import')!.addEventListener('click', () => modal.classList.remove('hidden'));
document.getElementById('btn-close-modal')!.addEventListener('click', () => modal.classList.add('hidden'));
document.getElementById('btn-confirm-import')!.addEventListener('click', () => {
  const raw = (document.getElementById('import-input') as HTMLTextAreaElement).value.trim();
  if (raw) {
    pushHistory();
    state.rotate = 0;
    state.flipX = false;
    state.flipY = false;
    state.innerSvg = raw.replace(/^<svg[^>]*>/i, '').replace(/<\/svg>$/i, '').trim();
    render();
    showToast('IMPORTED SVG!');
  }
  modal.classList.add('hidden');
});

// Load icon, color, stroke, and animation from URL if opened via a shared link
const urlParams = new URLSearchParams(window.location.search);
const incomingSvg = urlParams.get('svg');
if (incomingSvg) {
  state.innerSvg = incomingSvg.replace(/^<svg[^>]*>/i, '').replace(/<\/svg>$/i, '').trim();
}
const incomingColor = urlParams.get('color');
if (incomingColor && /^[0-9a-fA-F]{6}$/.test(incomingColor)) {
  state.color = `#${incomingColor}`;
  (document.getElementById('inp-color') as HTMLInputElement).value = state.color;
}
const incomingStroke = Number(urlParams.get('stroke'));
if (incomingStroke >= 1 && incomingStroke <= 3.5) {
  state.strokeWidth = incomingStroke;
  (document.getElementById('inp-stroke') as HTMLInputElement).value = String(incomingStroke);
}
const incomingAnim = urlParams.get('anim') as AnimationType | null;
if (incomingAnim && ['none', 'spin', 'pulse', 'bounce', 'ping', 'wiggle'].includes(incomingAnim)) {
  state.animation = incomingAnim;
  document.querySelectorAll<HTMLButtonElement>('#anim-group button').forEach((b) => {
    b.classList.toggle('active', b.dataset.anim === incomingAnim);
  });
}

render();
