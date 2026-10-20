/**
 * dsh-theme-p5r — Client half.
 *
 * A fan-made, asset-free skin: everything below is CSS and token values, no
 * image, logo or font file from Persona 5 Royal is bundled or referenced.
 *
 * Two layers, in this order:
 *   1) theme.overrideTokens — the app's own --dsw-alias-* tokens, in light and
 *      dark pairs, so every surface the app paints itself follows the palette
 *      and follows the OS light/dark switch with no JS repaint.
 *   2) one scoped stylesheet under body[data-p5r] — geometry (square corners,
 *      slanted accents), typography (heavy italic), halftone grain, scrollbar,
 *      selection and hover inversion. Scoped so that removing the attribute and
 *      the style element restores the stock UI exactly.
 *
 * Settings live nowhere: the plugin's presence is the switch. Uninstall or
 * disable the bundle to get the stock look back.
 */
window.__ModuleLoader__.load({
  id: 'dsh-theme-p5r',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    var React = require('react')

    /* Original watermark emblem: a whale in the calling-card idiom — flat black
       silhouette, hard corners, a white eye and a bitten-out jaw line. Drawn
       here as geometry; nothing is traced, imported or bundled. It is the
       project's own mark, not a game logo. */
    var EMBLEM_SVG =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
      '<g fill="#0a0a0b">' +
      /* body: blunt head at the left, back ridge, tail stock, two flukes */
      '<path d="M92 300 C104 214 188 166 286 182 L340 172 C388 168 422 190 440 224 ' +
      'L492 180 L474 250 L508 302 L444 308 C418 348 372 370 318 376 ' +
      'C236 386 148 362 100 330 Z"/>' +
      /* pectoral fin */
      '<path d="M212 344 L286 330 L246 392 Z"/>' +
      /* spout: three hard splinters */
      '<path d="M150 132 L178 190 L196 150 L216 200 L228 158 L244 178 L228 128 Z"/>' +
      '</g>' +
      '<g fill="#f7f1e3">' +
      /* eye */
      '<path d="M146 246 L212 230 L204 278 L152 284 Z"/>' +
      /* jaw line bitten out of the silhouette */
      '<path d="M98 316 L196 322 L186 338 L96 332 Z"/>' +
      '</g>' +
      '</svg>'

    var EMBLEM_URL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(EMBLEM_SVG)

    /* Bumped whenever CSS changes: distinguishes a duplicate mount (ignore) from
       an in-place rebuild swap, where the page still carries the old sheet. */
    var BUILD = 'p5r-build/2026-10-20-x'
    var TOKEN_SOURCE = 'p5r-velvet'
    var STYLE_SELECTOR = 'style[data-plugin="dsh-theme-p5r"]'

    /* Calling-card palette: the canvas IS the red card in dark mode, with ink
       panels and black rules on top of it; light mode is the same card before
       the ink was laid down (paper stock, black rules, red accents). */
    var TOKENS = {
      '--dsw-alias-bg-base': { light: '#efe6d6', dark: '#c8102e' },
      '--dsw-alias-bg-layer-1': { light: '#fbf6ea', dark: '#100b0c' },
      '--dsw-alias-bg-layer-2': { light: '#e2d7c3', dark: '#1c1214' },
      '--dsw-alias-bg-overlay': { light: '#fffdf6', dark: '#0d0909' },
      '--dsw-alias-border-l1': { light: '#0a0a0b', dark: '#0a0a0b' },
      '--dsw-alias-border-l2': { light: '#3a2a26', dark: '#33161a' },
      '--dsw-alias-brand-primary': { light: '#c8102e', dark: '#e60012' },
      '--dsw-alias-label-primary': { light: '#12100f', dark: '#f7f1e3' },
      '--dsw-alias-label-secondary': { light: '#4a3f3a', dark: '#cbb9b4' },
      '--dsw-alias-label-deep-diving': { light: '#c8102e', dark: '#ffffff' },
      '--dsw-alias-label-deep-diving-shimmer': {
        light: 'rgba(200, 16, 46, 0.34)',
        dark: 'rgba(255, 255, 255, 0.42)',
      },
      '--dsw-alias-state-error-primary': { light: '#d4001f', dark: '#ff6b6b' },
      '--dsw-alias-state-success-primary': { light: '#2f7d4f', dark: '#4ade80' },
      '--dsw-alias-state-warn-primary': { light: '#b26a00', dark: '#ffd166' },
      '--dsw-alias-state-idle-primary': { light: '#8a7a70', dark: '#8a7a76' },
      '--dsw-specific-sidebar-fill': { light: '#e7dcc8', dark: '#0a0708' },
      '--dsw-menu-surface-fill': { light: '#fffdf6', dark: '#100b0c' },
    }

    var CSS = `
/* ============================================================
   P5R phantom skin — scoped to body[data-p5r]
   ============================================================ */

body[data-p5r] {
  --p5-red: #e60012;
  --p5-red-deep: #a3000d;
  --p5-accent: #c8102e;
  --p5-ink: #0a0a0b;
  --p5-paper: #f0e9db;

  /* Print geometry: nothing is rounded. */
  --dsw-radius-xs: 0px;
  --dsw-radius-sm: 0px;
  --dsw-radius-md: 0px;
  --dsw-radius-lg: 0px;
  --dsw-radius-xl: 0px;
  --dsw-radius-panel: 0px;

  /* Editorial stack: a heavy grotesque leads, the app's own stack trails. */
  --dsw-font-family: "HarmonyOS Sans SC", "MiSans", "PingFang SC",
    "Microsoft YaHei", "Segoe UI", system-ui, sans-serif;

  font-feature-settings: "tnum" 1, "pnum" 1;
}

body[data-p5r][data-ds-dark-theme] {
  --p5-accent: #ff3b4e;
}

/* --- selection: red block, paper type ------------------------------- */
body[data-p5r] ::selection {
  background: var(--p5-red);
  color: #fff;
}

/* --- scrollbars: thin, square, red on hover ------------------------- */
body[data-p5r] ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
body[data-p5r] ::-webkit-scrollbar-track {
  background: transparent;
}
body[data-p5r] ::-webkit-scrollbar-thumb {
  background: rgba(128, 118, 108, 0.35);
  border: 2px solid transparent;
  background-clip: content-box;
  border-radius: 0;
}
body[data-p5r] ::-webkit-scrollbar-thumb:hover {
  background: var(--p5-red);
  background-clip: content-box;
}

/* --- focus: a hard red rule, never a blue glow ---------------------- */
body[data-p5r] :focus-visible {
  outline: 2px solid var(--p5-red);
  outline-offset: 2px;
}

/* --- type: heavy oblique display, like a magazine masthead ---------- */
body[data-p5r] h1,
body[data-p5r] h2,
body[data-p5r] h3,
body[data-p5r] h4,
body[data-p5r] strong {
  font-style: italic;
  font-weight: 900;
  letter-spacing: -0.015em;
}

body[data-p5r] a {
  color: var(--p5-accent);
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

body[data-p5r] hr {
  border: 0;
  border-top: 1px solid var(--p5-red);
  opacity: 0.5;
}

/* --- controls: square, and hover inverts to a red block ------------- */
body[data-p5r] button,
body[data-p5r] [role="button"],
body[data-p5r] input,
body[data-p5r] textarea,
body[data-p5r] [role="dialog"] {
  border-radius: 0;
}

body[data-p5r] button:not(:disabled):not([aria-pressed="true"]):hover {
  background-color: var(--p5-red);
  border-color: var(--p5-red);
  color: #fff;
}

body[data-p5r] button:not(:disabled):hover svg {
  color: #fff;
}

/* --- chosen things carry a red spine -------------------------------- */
body[data-p5r] [aria-selected="true"],
body[data-p5r] [aria-current="page"],
body[data-p5r] [aria-pressed="true"] {
  box-shadow: inset 3px 0 0 var(--p5-red);
}

/* --- dialogs: printed card with a hard offset shadow ---------------- */
body[data-p5r] [role="dialog"] {
  border: 1px solid var(--p5-red);
  box-shadow: 7px 7px 0 rgba(230, 0, 18, 0.18);
}

/* --- code: a red rule on the gutter --------------------------------- */
body[data-p5r] pre {
  border-left: 3px solid var(--p5-red);
  border-radius: 0;
}

/* --- signature: halftone grain + slogan, painted above everything --- */
body[data-p5r]::after {
  content: "TAKE YOUR HEART";
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0 20px 12px;
  pointer-events: none;
  font-family: var(--dsw-font-family);
  font-style: italic;
  font-weight: 900;
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.16);
  background-image: radial-gradient(rgba(10, 10, 10, 0.075) 1px, transparent 1.2px);
  background-size: 5px 5px;
}

body[data-p5r][data-ds-dark-theme]::after {
  color: rgba(255, 255, 255, 0.2);
  background-image: radial-gradient(rgba(0, 0, 0, 0.11) 1px, transparent 1.2px);
}

/* --- a red hairline along the top of the frame, with a slow scan ----- */
body[data-p5r]::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 2147483001;
  pointer-events: none;
  background-image: linear-gradient(
    90deg,
    var(--p5-red) 0%,
    var(--p5-red) 6%,
    transparent 12%,
    transparent 100%
  );
  background-size: 260% 100%;
  background-repeat: no-repeat;
  animation: p5r-scan 9s linear infinite;
}

@keyframes p5r-scan {
  from {
    background-position: -6% 0;
  }
  to {
    background-position: 100% 0;
  }
}

/* --- rows of the transcript slap in like pasted paper --------------- */
@keyframes p5r-slap {
  from {
    opacity: 0;
    transform: translate3d(0, 14px, 0) skewX(-3.5deg);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

body[data-p5r] [data-chat-flow] > * {
  animation: p5r-slap 0.34s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

/* --- controls tilt when touched ------------------------------------- */
body[data-p5r] button,
body[data-p5r] [role="button"] {
  transition: transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1),
    background-color 0.16s ease, color 0.16s ease, border-color 0.16s ease;
}

body[data-p5r] button:not(:disabled):hover,
body[data-p5r] [role="button"]:hover {
  transform: skewX(-4deg) translateY(-1px);
}

body[data-p5r] button:not(:disabled):active,
body[data-p5r] [role="button"]:active {
  transform: skewX(-4deg) translateY(1px) scale(0.985);
}

/* --- dialogs land rather than fade ---------------------------------- */
@keyframes p5r-pop {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.97) rotate(-0.6deg);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

body[data-p5r] [role="dialog"] {
  animation: p5r-pop 0.26s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

/* --- full-frame phantom layer (shell.overlay) ----------------------- */
.p5r-layer {
  position: fixed;
  inset: 0;
  z-index: 2147482999;
  pointer-events: none;
  overflow: hidden;
}

/* the calling-card emblem, floated behind the reading column: big enough to
   read as a mark, capped so it never reaches the sidebar or the composer */
.p5r-emblem {
  position: absolute;
  left: 50%;
  top: 41%;
  width: min(46vw, 580px);
  max-height: calc(100vh - 320px);
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%) rotate(-4deg);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.13;
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* Speed lines. The layer is a large SQUARE centred on the frame and sized past
   the viewport diagonal, so no edge of it can ever sweep into view while it
   turns — that hard stop the rays used to end on was this element's own border.
   The mask is a circle (not closest-side, which became an ellipse on a
   rectangle) and fades out well before the square's edge, so the rays thin away
   instead of stopping. */
.p5r-lines {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120vmax;
  height: 120vmax;
  margin: -60vmax 0 0 -60vmax;
  background: repeating-conic-gradient(
    from 0deg at 50% 50%,
    rgba(10, 10, 10, 0.18) 0deg 1deg,
    transparent 1deg 6.5deg
  );
  -webkit-mask-image: radial-gradient(
    circle at 50% 50%,
    transparent 0 24vmax,
    #000 34vmax 52vmax,
    transparent 62vmax
  );
  mask-image: radial-gradient(
    circle at 50% 50%,
    transparent 0 24vmax,
    #000 34vmax 52vmax,
    transparent 62vmax
  );
  animation: p5r-spin 34s linear infinite;
  opacity: 0.42;
  will-change: transform;
}

@keyframes p5r-spin {
  to {
    transform: rotate(360deg);
  }
}

/* the wipe: an ink blade with a red edge, crossing the frame */
.p5r-slash {
  position: absolute;
  top: -12%;
  bottom: -12%;
  left: -50%;
  width: 34%;
  opacity: 0;
  transform: skewX(-14deg);
  background: linear-gradient(
    100deg,
    #0a0a0b 0%,
    #0a0a0b 62%,
    #e60012 62%,
    #e60012 74%,
    transparent 74%
  );
}

.p5r-slash[data-on] {
  animation: p5r-slash 0.52s cubic-bezier(0.7, 0, 0.3, 1) both;
}

@keyframes p5r-slash {
  0% {
    left: -45%;
    opacity: 0.95;
  }
  70% {
    opacity: 0.95;
  }
  100% {
    left: 115%;
    opacity: 0;
  }
}

/* impact flash */
.p5r-flash {
  position: absolute;
  inset: 0;
  background: #fff;
  opacity: 0;
}

.p5r-flash[data-on] {
  animation: p5r-flash 0.3s ease-out both;
}

@keyframes p5r-flash {
  0% {
    opacity: 0;
  }
  16% {
    opacity: 0.3;
  }
  100% {
    opacity: 0;
  }
}

/* the whole frame takes the hit */
body[data-p5r].p5r-shake {
  animation: p5r-shake 0.34s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes p5r-shake {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  15% {
    transform: translate3d(-5px, 2px, 0) rotate(-0.25deg);
  }
  35% {
    transform: translate3d(4px, -3px, 0) rotate(0.3deg);
  }
  55% {
    transform: translate3d(-3px, 1px, 0) rotate(-0.2deg);
  }
  75% {
    transform: translate3d(2px, 2px, 0);
  }
}

/* --- sidebar: the spec sheet from the cover art ---------------------
   Each row is an ink bar riding on a red jagged backing that peeks out on the
   left and right, exactly like the spec rows on the P5 cover. The hooks are the
   semantic tail of the app's CSS-module names (hIlkoa_sessionRow ->
   [class*='_sessionRow']), so a rebuild that changes the hash keeps matching.
   -------------------------------------------------------------------- */
body[data-p5r] [data-slot='sidebar'] {
  border-right: 2px solid var(--p5-red);
}

body[data-p5r] [class*='_sessionRow'],
body[data-p5r] [class*='_projectRow'],
body[data-p5r] [class*='_panelRow'] {
  position: relative;
  border-radius: 0 !important;
  margin: 4px 10px 4px 2px;
  padding-left: 10px;
  font-weight: 700;
  font-style: italic;
  letter-spacing: 0.01em;
  box-shadow: none !important;
  transition: transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* No background or colour override on these rows. The app paints every row
   state itself (idle / hover / chosen) and pairs that paint with matching text;
   a forced pair here kept losing its label whenever the app repainted one half.
   The theme only supplies the cut-out behind the row and the type. */

body[data-p5r] [class*='_sessionRow']::before,
body[data-p5r] [class*='_projectRow']::before,
body[data-p5r] [class*='_panelRow']::before {
  content: "";
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: -10px;
  right: -10px;
  background: var(--p5-red);
  /* A true parallelogram: both vertical edges lean, so the backing reads as a
     slanted cut rather than a rectangle with a nudge. */
  clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
  /* A border cannot follow a clip-path, so the keyline is four zero-blur
     drop-shadows of the clipped shape: a real outline around the cut-out,
     corners included, with no extra element and no layout change. */
  filter: drop-shadow(1.5px 0 0 #f7f1e3) drop-shadow(-1.5px 0 0 #f7f1e3)
    drop-shadow(0 1.5px 0 #f7f1e3) drop-shadow(0 -1.5px 0 #f7f1e3);
  z-index: -1;
}

body[data-p5r] [class*='_sessionRow']:nth-of-type(even)::before,
body[data-p5r] [class*='_projectRow']:nth-of-type(even)::before,
body[data-p5r] [class*='_panelRow']:nth-of-type(even)::before {
  transform: translateX(5px);
}

/* Chosen row: only the cut-out behind it changes — the bar keeps the app's own
   paint, so its label can never lose contrast. */
body[data-p5r] [class*='_sessionRow'][class*='_selected']::before,
body[data-p5r] [class*='_panelRow'][class*='_panelActive']::before {
  background: #0a0a0b;
  filter: drop-shadow(1.5px 0 0 #f7f1e3) drop-shadow(-1.5px 0 0 #f7f1e3)
    drop-shadow(0 1.5px 0 #f7f1e3) drop-shadow(0 -1.5px 0 #f7f1e3);
}

/* hover: the bar lifts off the backing */
body[data-p5r] [class*='_sessionRow']:hover,
body[data-p5r] [class*='_projectRow']:hover,
body[data-p5r] [class*='_panelRow']:hover {
  transform: translateX(2px) skewX(-2deg);
}

/* the mark at the head of a panel row */
body[data-p5r] [class*='_panelGlyph'] {
  color: var(--p5-red);
}

body[data-p5r] [class*='_sessionRow'] {
  height: 30px;
}

/* new-session button: plain ink plate, no keyline (a red outline here read as a
   stray artefact next to the brand row), inverted on hover */
body[data-p5r] [class*='_newSession'] {
  background: #0a0a0b !important;
  color: #f7f1e3 !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

body[data-p5r] [class*='_newSession']:hover {
  background: var(--p5-red) !important;
  color: #0a0a0b !important;
}

/* --- transcript: dialogue plates -----------------------------------
   The flow item carries data-chat-flow-kind, which is a semantic, hash-free
   hook: 'user' for the prompt, 'assistant-step' for one reply block. The plates
   therefore survive any rebuild that keeps the node kinds.
   -------------------------------------------------------------------- */
body[data-p5r] [data-chat-flow-kind='user'] {
  position: relative;
}

body[data-p5r] [data-chat-flow-kind='user'] [class*='_bubble'] {
  background: #0a0a0b !important;
  color: #f7f1e3 !important;
  border-radius: 0 !important;
  /* extra room on the right: the tail lives inside the same box, because a
     clip-path can never paint outside the element it belongs to */
  padding: 12px 46px 14px 20px !important;
  /* The same manga panel as the composer: four straight edges at uneven
     angles, three small shears, and ONE tail biting out of the right edge,
     pointing at the speaker. */
  clip-path: polygon(
    0 14px,
    14px 0,
    calc(100% - 54px) 4px,
    calc(100% - 51px) 30%,
    100% 50%,
    calc(100% - 42px) 57%,
    calc(100% - 37px) 78%,
    calc(100% - 24px) 100%,
    22px calc(100% - 2px),
    0 calc(100% - 18px)
  );
  filter: drop-shadow(2.5px 0 0 #f7f1e3) drop-shadow(-2.5px 0 0 #f7f1e3)
    drop-shadow(0 2.5px 0 #f7f1e3) drop-shadow(0 -2.5px 0 #f7f1e3);
}

body[data-p5r] [data-chat-flow-kind='assistant-step'] {
  background: #0a0a0b !important;
  border: 2px solid #f7f1e3;
  padding: 12px 16px;
  margin: 4px 0;
}

/* --- the composer plate ---------------------------------------------
   The composer mounts through a stack of display:contents wrappers plus a
   data-chain-overlay-fallback chain, so the seat is NOT a usable positioning
   ancestor: everything between it and the card is display:contents and cannot
   hold an absolute child. The data-composer-card attribute on the input card is
   semantic and stable; its direct parent is the one real box, and that is where
   the plate belongs.
   -------------------------------------------------------------------- */
body[data-p5r] div:has(> [data-composer-card]) {
  position: relative;
}

body[data-p5r] div:has(> [data-composer-card])::before {
  content: "";
  position: absolute;
  top: -9px;
  bottom: -11px;
  /* The wrapper is the full column width (padding + centred card capped by
     --dsh-composer-card-max-width), so insetting from it drew a plate that ran
     into the sidebar. Size the plate from the CARD instead: card width + the
     11px overhang on each side, capped by the card's own max width. */
  left: 50%;
  /* card width + room for the spikes on the right (the shift below keeps the
     left overhang modest so the plate still hugs the input) */
  width: min(
    calc(100% - 2 * var(--dsh-composer-side-clearance, 0px) + 64px),
    calc(var(--dsh-composer-card-max-width, 100%) + 64px)
  );
  transform: translateX(calc(-50% + 10px));
  background: #0a0a0b;
  /* A manga panel: four straight edges whose corners sit at uneven angles (cut
     by hand, not by a rectangle), plus ONE tail biting out of the right edge and
     pointing at whatever is speaking. Bevels on the other three corners keep the
     "scissors" feel without reading as a rounded box. */
  clip-path: polygon(
    0 16px,
    16px 0,
    calc(100% - 74px) 3px,
    calc(100% - 72px) 32%,
    100% 52%,
    calc(100% - 63px) 58%,
    calc(100% - 57px) 74%,
    calc(100% - 44px) 100%,
    26px calc(100% - 3px),
    0 calc(100% - 22px)
  );
  filter: drop-shadow(4px 0 0 #f7f1e3) drop-shadow(-4px 0 0 #f7f1e3)
    drop-shadow(0 4px 0 #f7f1e3) drop-shadow(0 -4px 0 #f7f1e3);
  /* plate sits in flow and the card is lifted above it: no negative z-index, so
     no ancestor background can swallow the frame */
  z-index: 0;
  pointer-events: none;
}

/* Optional drop-in: put a file named dialog.png next to client.js and it is
   painted over the plate. The rule resolves to a 404 when the file is absent,
   and a missing background layer simply paints nothing — so the CSS plate
   above stays the default and nothing has to be switched off. */
body[data-p5r] div:has(> [data-composer-card])::after {
  content: "";
  position: absolute;
  top: -9px;
  bottom: -11px;
  left: 50%;
  width: min(
    calc(100% - 2 * var(--dsh-composer-side-clearance, 0px) + 64px),
    calc(var(--dsh-composer-card-max-width, 100%) + 64px)
  );
  transform: translateX(calc(-50% + 10px));
  background-image: url("/plugins/theme-p5r/dialog.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 0;
}

body[data-p5r] [data-composer-card] {
  position: relative;
  z-index: 1;
  background: #0a0a0b !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* --- reduce ---------------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  body[data-p5r] *,
  body[data-p5r]::before {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`

    function insertCss(css) {
      var doc = document
      var stale = doc.querySelectorAll(STYLE_SELECTOR)
      for (var i = 0; i < stale.length; i += 1) stale[i].remove()
      var el = doc.createElement('style')
      el.setAttribute('data-plugin', 'dsh-theme-p5r')
      el.textContent = css + '\n/* ' + BUILD + ' */'
      doc.head.appendChild(el)
      return function () {
        if (el.parentNode) el.parentNode.removeChild(el)
      }
    }

    function apply(ctx) {
      if (typeof document === 'undefined' || !document.body) return

      var disposed = false
      var timer = null
      var cleanups = []

      var install = function (theme) {
        if (disposed) return
        /* Same build mounted twice (boot loader + cordis composition): the first
           mount owns the tokens and the sheet, leave it alone. */
        if (window.__dshP5rBuild === BUILD) return

        var disposeTokens = theme.overrideTokens(TOKEN_SOURCE, TOKENS)
        var disposeCss = insertCss(CSS)
        document.body.setAttribute('data-p5r', '')
        window.__dshP5rBuild = BUILD

        cleanups.push(function () {
          disposeTokens()
          disposeCss()
          document.body.removeAttribute('data-p5r')
          if (window.__dshP5rBuild === BUILD) delete window.__dshP5rBuild
        })
      }

      var tryInstall = function () {
        var theme = ctx.get('theme')
        if (theme && typeof theme.overrideTokens === 'function') {
          install(theme)
          return true
        }
        return false
      }

      if (!tryInstall()) {
        /* Boot race: the roster mounts immediately, the theme service may land a
           tick later. Retry briefly instead of silently doing nothing. */
        var tries = 0
        timer = setInterval(function () {
          tries += 1
          if (tryInstall() || tries >= 20) {
            clearInterval(timer)
            timer = null
          }
        }, 120)
      }

      ctx.effect(function () {
        return function () {
          disposed = true
          if (timer !== null) {
            clearInterval(timer)
            timer = null
          }
          for (var i = 0; i < cleanups.length; i += 1) cleanups[i]()
          cleanups = []
        }
      })
    }

    /* The frame-wide phantom layer: speed lines, the wipe and the impact flash.
       It watches the transcript for newly appended rows — the one moment the
       app announces by itself — and fires the effect once per burst. All of it
       is pointer-events:none, so nothing under it loses a click. */
    function PhantomLayer() {
      var rootRef = React.useRef(null)

      React.useEffect(function () {
        var doc = document
        var node = rootRef.current
        if (!node) return undefined

        var reduced =
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        var observer = null
        var poll = null
        var tries = 0
        var timer = null

        var fire = function () {
          if (reduced) return
          var flash = node.querySelector('.p5r-flash')
          var slash = node.querySelector('.p5r-slash')
          /* Re-trigger: dropping and re-adding the attribute restarts the CSS
             animation without remounting the element. */
          if (flash) {
            flash.removeAttribute('data-on')
            void flash.offsetWidth
            flash.setAttribute('data-on', '')
          }
          if (slash) {
            slash.removeAttribute('data-on')
            void slash.offsetWidth
            slash.setAttribute('data-on', '')
          }
          doc.body.classList.remove('p5r-shake')
          void doc.body.offsetWidth
          doc.body.classList.add('p5r-shake')
          if (timer !== null) clearTimeout(timer)
          timer = window.setTimeout(function () {
            doc.body.classList.remove('p5r-shake')
            if (flash) flash.removeAttribute('data-on')
            if (slash) slash.removeAttribute('data-on')
            timer = null
          }, 700)
        }

        var attach = function () {
          var host = doc.querySelector('[data-chat-flow]')
          if (!host) return false
          observer = new MutationObserver(function (records) {
            for (var i = 0; i < records.length; i += 1) {
              if (records[i].addedNodes && records[i].addedNodes.length > 0) {
                fire()
                return
              }
            }
          })
          observer.observe(host, { childList: true })
          return true
        }

        /* No session open yet: the transcript seat does not exist. Poll briefly
           instead of giving the layer up for the rest of the session. */
        if (!attach()) {
          poll = window.setInterval(function () {
            tries += 1
            if (attach() || tries > 40) {
              window.clearInterval(poll)
              poll = null
            }
          }, 500)
        }

        return function () {
          if (observer) observer.disconnect()
          if (poll !== null) window.clearInterval(poll)
          if (timer !== null) clearTimeout(timer)
          doc.body.classList.remove('p5r-shake')
        }
      }, [])

      return React.createElement(
        'div',
        { className: 'p5r-layer', 'aria-hidden': true },
        React.createElement('div', {
          className: 'p5r-emblem',
          style: { backgroundImage: 'url("' + EMBLEM_URL + '")' },
        }),
        React.createElement('div', { className: 'p5r-lines' }),
        React.createElement('div', { className: 'p5r-slash' }),
        React.createElement('div', { className: 'p5r-flash' })
      )
    }

    /* One additive seat, registered defensively: a composition without the seat
       keeps the stylesheet, it only misses the element. */
    function registerSlot(ctx, key, id, order, component) {
      var slots = ctx.get('slots')
      if (!slots || typeof slots.register !== 'function' || typeof slots.inject !== 'function') return
      try {
        ctx.effect(function () {
          return slots.inject(key, function () {
            var dispose = null
            try {
              dispose = slots.register({ name: key, id: id, order: order }, component)
            } catch (e) {
              dispose = null
            }
            return typeof dispose === 'function' ? dispose : function () {}
          })
        })
      } catch (e) {
        /* no such seat in this composition */
      }
    }

    exports.inject = ['theme', 'slots']
    exports.apply = function (ctx) {
      apply(ctx)
      registerSlot(ctx, 'shell.overlay', 'p5r-layer', 1, PhantomLayer)
    }
    return module.exports
  },
})
