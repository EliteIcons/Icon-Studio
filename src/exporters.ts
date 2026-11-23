import { AnimationType, buildFullSvg } from './state';

export function copySvgCode(onDone: (msg: string) => void) {
  navigator.clipboard.writeText(buildFullSvg(24));
  onDone('COPIED SVG TO CLIPBOARD!');
}

export function downloadSvgFile(onDone: (msg: string) => void) {
  const blob = new Blob([buildFullSvg(24)], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'elite-icon.svg';
  a.click();
  URL.revokeObjectURL(url);
  onDone('DOWNLOADED ELITE-ICON.SVG');
}

export function exportPngFile(size = 512, onDone: (msg: string) => void) {
  const svgString = buildFullSvg(size);
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, size, size);
    URL.revokeObjectURL(url);

    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      const pngUrl = URL.createObjectURL(pngBlob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `elite-icon-${size}.png`;
      a.click();
      URL.revokeObjectURL(pngUrl);
      onDone(`EXPORTED ${size}PX PNG!`);
    }, 'image/png');
  };

  img.src = url;
}

export function copyAnimationCss(animation: AnimationType, onDone: (msg: string) => void) {
  const cssSnippets: Record<AnimationType, string> = {
    none: '/* Select an animation first */',
    spin: '@keyframes spin { to { transform: rotate(360deg); } }\n.elite-icon { animation: spin 1.2s linear infinite; }',
    pulse: '@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }\n.elite-icon { animation: pulse 1.5s ease-in-out infinite; }',
    bounce: '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20%); } }\n.elite-icon { animation: bounce 0.8s ease infinite; }',
    ping: '@keyframes ping { 75%, 100% { transform: scale(1.6); opacity: 0; } }\n.elite-icon { animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite; }',
    wiggle: '@keyframes wiggle { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }\n.elite-icon { animation: wiggle 0.5s ease-in-out infinite; }',
  };
  navigator.clipboard.writeText(cssSnippets[animation]);
  onDone('COPIED ANIMATION CSS!');
}
