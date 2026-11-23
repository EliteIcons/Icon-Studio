export const WORKBENCH_HTML = `
  <div class="workbench">
    <header class="topbar">
      <div class="brand">
        <span class="badge">STUDIO // V1.0</span>
        <h1>ELITE<span>ICON STUDIO</span></h1>
      </div>
      <div class="top-actions">
        <a href="https://github.io" class="nav-link">← BACK TO GALLERY</a>
        <button id="btn-import" class="btn outline">PASTE / IMPORT SVG</button>
        <button id="btn-copy-svg" class="btn primary">COPY SVG</button>
        <button id="btn-dl-svg" class="btn outline">DOWNLOAD .SVG</button>
        <button id="btn-dl-png" class="btn outline">EXPORT .PNG (512PX)</button>
      </div>
    </header>

    <div class="workspace">
      <!-- Left Tool Palette -->
      <aside class="panel left-panel">
        <div class="section-title">CREATE ON 24×24 GRID</div>
        <div class="tool-grid">
          <button class="tool-btn active" data-tool="line">╱ LINE</button>
          <button class="tool-btn" data-tool="rect">□ RECT</button>
          <button class="tool-btn" data-tool="circle">○ CIRCLE</button>
          <button class="tool-btn" data-tool="pen">✎ PEN</button>
        </div>

        <div class="row-btns">
          <button id="btn-undo" class="btn small">↩ UNDO</button>
          <button id="btn-clear" class="btn small danger">✕ CLEAR CANVAS</button>
        </div>

        <div class="section-title">TRANSFORM & GEOMETRY</div>
        <div class="tool-grid">
          <button id="btn-rot-left" class="btn small">↺ -90°</button>
          <button id="btn-rot-right" class="btn small">↻ +90°</button>
          <button id="btn-flip-x" class="btn small">⇄ FLIP H</button>
          <button id="btn-flip-y" class="btn small">⇅ FLIP V</button>
        </div>

        <div class="control">
          <label><span>STROKE COLOR</span><code id="lbl-color">#CCFF00</code></label>
          <input id="inp-color" type="color" value="#ccff00" />
        </div>

        <div class="control">
          <label><span>STROKE WIDTH</span><code id="lbl-stroke">2PX</code></label>
          <input id="inp-stroke" type="range" min="1" max="3.5" step="0.25" value="2" />
        </div>

        <div class="control">
          <label><span>LINE CAP</span></label>
          <div class="segmented" id="cap-group">
            <button data-cap="round" class="active">ROUND</button>
            <button data-cap="butt">BUTT</button>
            <button data-cap="square">SQUARE</button>
          </div>
        </div>

        <label class="checkbox-row">
          <input id="chk-grid" type="checkbox" checked />
          <span>SHOW 24×24 PIXEL GRID</span>
        </label>
      </aside>

      <!-- Center Interactive Canvas -->
      <main class="stage-area">
        <div class="canvas-frame" id="canvas-frame">
          <div class="pixel-grid" id="pixel-grid"></div>
          <svg id="editor-svg" viewBox="0 0 24 24" width="336" height="336" fill="none"></svg>
          <svg id="preview-overlay" viewBox="0 0 24 24" width="336" height="336" fill="none"></svg>
        </div>
        <div class="coords" id="coords">GRID: 12, 12 // SNAP: 1PX</div>
      </main>

      <!-- Right Animation & Code Panel -->
      <aside class="panel right-panel">
        <div class="section-title">TEST ANIMATIONS</div>
        <div class="anim-grid" id="anim-group">
          <button data-anim="none" class="active">NONE</button>
          <button data-anim="spin">SPIN</button>
          <button data-anim="pulse">PULSE</button>
          <button data-anim="bounce">BOUNCE</button>
          <button data-anim="ping">PING</button>
          <button data-anim="wiggle">WIGGLE</button>
        </div>

        <div class="anim-preview-box">
          <div id="anim-stage"></div>
          <button id="btn-copy-css" class="btn small">COPY ANIMATION CSS</button>
        </div>

        <div class="section-title">LIVE SVG CODE (EDITABLE)</div>
        <textarea id="code-editor" spellcheck="false"></textarea>
        <button id="btn-apply-code" class="btn primary full">APPLY CODE TO CANVAS</button>
      </aside>
    </div>

    <!-- Import Modal -->
    <div id="modal" class="modal hidden">
      <div class="modal-card">
        <div class="modal-head">
          <span>PASTE RAW &lt;SVG&gt; MARKUP</span>
          <button id="btn-close-modal" class="btn small">✕</button>
        </div>
        <textarea id="import-input" placeholder="<svg viewBox='0 0 24 24'>...</svg>"></textarea>
        <button id="btn-confirm-import" class="btn primary full">LOAD INTO STUDIO</button>
      </div>
    </div>

    <div id="toast" class="toast hidden"></div>
  </div>
`;
