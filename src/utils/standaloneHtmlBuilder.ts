import { ELEMENTS, RECIPES, INITIAL_UNLOCKED_IDS } from '../data/alchemyData';

export function buildStandaloneHtmlFile(): string {
  const elementsJson = JSON.stringify(ELEMENTS, null, 2);
  const recipesJson = JSON.stringify(
    RECIPES.map((r) => [r.a, r.b, r.result]),
    null,
    2
  );
  const initialJson = JSON.stringify(INITIAL_UNLOCKED_IDS);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Alkimia Benda Mati & Teknologi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg-canvas: #0B0F19;
      --bg-surface: #111827;
      --bg-card: #1E293B;
      --bg-card-hover: #26354D;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --text-main: #F1F5F9;
      --text-muted: #94A3B8;
      --accent-cyan: #06B6D4;
      --accent-amber: #F59E0B;
      --accent-emerald: #10B981;
      --accent-rose: #F43F5E;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--bg-canvas);
      color: var(--text-main);
      min-height: 100dvh;
      display: flex;
      justify-content: center;
      overflow-x: hidden;
    }
    .app-shell {
      width: 100%;
      max-width: 440px;
      min-height: 100dvh;
      background-color: var(--bg-surface);
      border-left: 1px solid var(--border-subtle);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      position: relative;
      padding-bottom: 72px;
    }
    header {
      padding: 14px 16px;
      background: rgba(17, 24, 39, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 20;
    }
    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #fff;
    }
    .header-meta {
      margin-top: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }
    .progress-track {
      margin-top: 6px;
      height: 5px;
      width: 100%;
      background: #1E293B;
      border-radius: 999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald));
      transition: width 0.25s ease;
    }
    .icon-btn {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      border-radius: 10px;
      padding: 6px 10px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      min-height: 36px;
    }
    .altar-box {
      margin: 12px 16px;
      padding: 14px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid var(--border-subtle);
      border-radius: 18px;
    }
    .slots-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .slot {
      flex: 1;
      min-height: 78px;
      background: var(--bg-card);
      border: 1.5px dashed rgba(148, 163, 184, 0.35);
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px;
      cursor: pointer;
      transition: transform 0.15s ease, border-color 0.15s ease;
      text-align: center;
    }
    .slot.filled {
      border-style: solid;
      border-color: var(--accent-cyan);
      background: rgba(6, 182, 212, 0.08);
    }
    .slot .emoji {
      font-size: 1.75rem;
      line-height: 1.1;
    }
    .slot .label {
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 4px;
      color: var(--text-main);
    }
    .operator {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-muted);
    }
    .status-banner {
      margin-top: 10px;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 0.78rem;
      background: rgba(30, 41, 59, 0.6);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .status-banner.new-discovery {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #FDE68A;
    }
    .status-banner.known {
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.35);
      color: #A5F3FC;
    }
    .status-banner.fail {
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #FECDD3;
    }
    .stats-card {
      margin: 0 16px 12px;
      padding: 12px;
      background: rgba(11, 15, 25, 0.85);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .stat-item {
      background: rgba(17, 24, 39, 0.9);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 10px;
    }
    .stat-label {
      font-size: 0.68rem;
      color: var(--text-muted);
    }
    .stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1rem;
      font-weight: 700;
      margin-top: 2px;
      color: #fff;
    }
    .tier-ladder {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 3px;
      margin-top: 6px;
    }
    .tier-step {
      height: 6px;
      border-radius: 2px;
      background: #1E293B;
    }
    .tier-step.reached {
      background: var(--accent-emerald);
    }
    .tier-step.peak {
      background: var(--accent-amber);
    }
    .filter-bar {
      padding: 0 16px 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .search-input {
      width: 100%;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 9px 12px;
      color: #fff;
      font-size: 0.85rem;
      outline: none;
    }
    .tier-tabs {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .tier-btn {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      padding: 6px 11px;
      border-radius: 8px;
      font-size: 0.72rem;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
    }
    .tier-btn.active {
      background: var(--accent-cyan);
      color: #082F49;
      border-color: var(--accent-cyan);
    }
    .elements-grid {
      padding: 0 16px 16px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }
    .elem-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 10px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
      min-height: 76px;
      user-select: none;
      transition: transform 0.12s ease, background 0.12s ease;
    }
    .elem-card:active {
      transform: scale(0.95);
    }
    .elem-card:hover {
      background: var(--bg-card-hover);
    }
    .elem-card .emoji {
      font-size: 1.6rem;
    }
    .elem-card .name {
      font-size: 0.73rem;
      font-weight: 600;
      margin-top: 5px;
      line-height: 1.2;
      color: var(--text-main);
    }
    .elem-card .tier-tag {
      font-size: 0.62rem;
      color: var(--text-muted);
      margin-top: 2px;
      font-family: 'JetBrains Mono', monospace;
    }
    .list-container {
      padding: 0 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .hint-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .hint-formula {
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .bottom-nav {
      position: fixed;
      bottom: 0;
      width: 100%;
      max-width: 440px;
      height: 62px;
      background: rgba(17, 24, 39, 0.95);
      backdrop-filter: blur(12px);
      border-top: 1px solid var(--border-subtle);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      z-index: 30;
    }
    .nav-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.72rem;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      cursor: pointer;
    }
    .nav-btn.active {
      color: var(--accent-cyan);
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <header>
      <div class="header-top">
        <div class="brand-title">Alkimia Benda Mati & Teknologi</div>
        <div style="display:flex;gap:6px;">
          <button id="btn-sound" class="icon-btn" title="Suara">🔊</button>
          <button id="btn-reset" class="icon-btn" title="Reset Progres">Reset</button>
        </div>
      </div>
      <div class="header-meta">
        <span id="progress-text">4 / 50 Elemen</span>
        <span id="recipe-text">0 Resep Terbuka</span>
      </div>
      <div class="progress-track">
        <div id="progress-fill" class="progress-fill" style="width: 8%;"></div>
      </div>
    </header>

    <div id="view-play">
      <section class="altar-box" id="altar-dropzone">
        <div class="slots-row">
          <div class="slot" id="slot-a" onclick="clearSlot('a')">
            <span class="emoji">➕</span>
            <span class="label">Bahan 1</span>
          </div>
          <span class="operator">+</span>
          <div class="slot" id="slot-b" onclick="clearSlot('b')">
            <span class="emoji">➕</span>
            <span class="label">Bahan 2</span>
          </div>
          <span class="operator">=</span>
          <div class="slot" id="slot-res">
            <span class="emoji">⚗️</span>
            <span class="label">Hasil</span>
          </div>
        </div>
        <div id="status-banner" class="status-banner">
          <span>Ketuk atau seret 2 elemen benda mati untuk disintesis.</span>
        </div>
      </section>

      <section class="stats-card" id="stats-card"></section>

      <section class="filter-bar">
        <input type="text" id="search-input" class="search-input" placeholder="Cari elemen atau material..." oninput="renderInventory()" />
        <div class="tier-tabs" id="tier-tabs">
          <button class="tier-btn active" onclick="setTier('all')">Semua</button>
          <button class="tier-btn" onclick="setTier(0)">T0 Primordial</button>
          <button class="tier-btn" onclick="setTier(1)">T1 Alam</button>
          <button class="tier-btn" onclick="setTier(2)">T2 Material</button>
          <button class="tier-btn" onclick="setTier(3)">T3 Mesin</button>
          <button class="tier-btn" onclick="setTier(4)">T4 Teknologi</button>
        </div>
      </section>

      <section class="elements-grid" id="elements-grid"></section>
    </div>

    <div id="view-hints" style="display:none; padding-top:12px;">
      <div class="list-container" id="hints-list"></div>
    </div>

    <div id="view-codex" style="display:none; padding-top:12px;">
      <div class="list-container" id="codex-list"></div>
    </div>

    <nav class="bottom-nav">
      <button class="nav-btn active" id="tab-play" onclick="switchTab('play')">
        <span>⚗️</span>
        <span>Sintesis</span>
      </button>
      <button class="nav-btn" id="tab-hints" onclick="switchTab('hints')">
        <span>💡</span>
        <span>Buku Petunjuk</span>
      </button>
      <button class="nav-btn" id="tab-codex" onclick="switchTab('codex')">
        <span>📘</span>
        <span>Ensiklopedia</span>
      </button>
    </nav>
  </div>

  <script>
    const ELEMENTS = ${elementsJson};
    const RAW_RECIPES = ${recipesJson};
    const INITIAL_UNLOCKED = ${initialJson};
    const STORAGE_KEY = 'alkimia_teknologi_save_v1';

    const ELEMENT_MAP = {};
    ELEMENTS.forEach(e => { ELEMENT_MAP[e.id] = e; });

    let state = {
      unlocked: [...INITIAL_UNLOCKED],
      discoveredRecipes: [],
      recipeUsageCounts: {},
      slotA: null,
      slotB: null,
      lastResult: null,
      tierFilter: 'all',
      sound: true,
      confirmReset: false
    };

    function loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.unlocked)) state.unlocked = parsed.unlocked;
          if (Array.isArray(parsed.discoveredRecipes)) state.discoveredRecipes = parsed.discoveredRecipes;
          if (parsed.recipeUsageCounts && typeof parsed.recipeUsageCounts === 'object') {
            state.recipeUsageCounts = parsed.recipeUsageCounts;
          }
        }
      } catch (e) {}
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          unlocked: state.unlocked,
          discoveredRecipes: state.discoveredRecipes,
          recipeUsageCounts: state.recipeUsageCounts
        }));
      } catch (e) {}
    }

    function playTone(freq, duration) {
      if (!state.sound) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {}
    }

    function normKey(a, b) {
      return [a, b].sort().join('+');
    }

    function findRecipe(a, b) {
      const k = normKey(a, b);
      for (const [ra, rb, res] of RAW_RECIPES) {
        if (normKey(ra, rb) === k) return { a: ra, b: rb, result: res, key: k + '=' + res };
      }
      return null;
    }

    function selectElement(id) {
      playTone(540, 0.06);
      if (!state.slotA) {
        state.slotA = id;
        state.lastResult = null;
      } else if (!state.slotB) {
        state.slotB = id;
        evaluateSlots();
      } else {
        state.slotA = id;
        state.slotB = null;
        state.lastResult = null;
      }
      renderAltar();
    }

    function clearSlot(which) {
      playTone(300, 0.06);
      if (which === 'a') state.slotA = null;
      if (which === 'b') state.slotB = null;
      state.lastResult = null;
      renderAltar();
    }

    function evaluateSlots() {
      if (!state.slotA || !state.slotB) return;
      const match = findRecipe(state.slotA, state.slotB);
      const banner = document.getElementById('status-banner');
      if (match) {
        const resElem = ELEMENT_MAP[match.result];
        state.lastResult = resElem;
        state.recipeUsageCounts[match.key] = (state.recipeUsageCounts[match.key] || 0) + 1;
        const isNew = !state.unlocked.includes(match.result);
        if (isNew) {
          state.unlocked.push(match.result);
          playTone(880, 0.22);
          banner.className = 'status-banner new-discovery';
          banner.innerHTML = '<span>✨ <b>Penemuan Baru:</b> ' + resElem.emoji + ' ' + resElem.name + '</span>';
        } else {
          playTone(620, 0.12);
          banner.className = 'status-banner known';
          banner.innerHTML = '<span>Sintesis berhasil: ' + resElem.emoji + ' ' + resElem.name + '</span>';
        }
        if (!state.discoveredRecipes.includes(match.key)) {
          state.discoveredRecipes.push(match.key);
        }
        saveState();
        updateHeader();
        renderStatsCard();
        renderInventory();
      } else {
        state.lastResult = null;
        playTone(170, 0.14);
        banner.className = 'status-banner fail';
        banner.innerHTML = '<span>Tidak bereaksi. Coba kombinasi material lain.</span>';
      }
    }

    function renderStatsCard() {
      const box = document.getElementById('stats-card');
      const total = ELEMENTS.length;
      const count = state.unlocked.length;
      const pct = Math.round((count / total) * 100);

      let highestTier = 0;
      state.unlocked.forEach(id => {
        if (ELEMENT_MAP[id] && ELEMENT_MAP[id].tier > highestTier) {
          highestTier = ELEMENT_MAP[id].tier;
        }
      });

      const entries = Object.entries(state.recipeUsageCounts).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
      let topRecipeHtml = '<div style="font-size:0.72rem;color:#94A3B8;margin-top:2px;">Belum ada riwayat sintesis</div>';
      if (entries.length > 0) {
        const [code, uses] = entries[0];
        const [pair, resId] = code.split('=');
        const [idA, idB] = pair.split('+');
        const elA = ELEMENT_MAP[idA];
        const elB = ELEMENT_MAP[idB];
        const res = ELEMENT_MAP[resId];
        if (elA && elB && res) {
          topRecipeHtml = '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:3px;font-size:0.76rem;">' +
            '<span>' + elA.emoji + ' ' + elA.name + ' + ' + elB.emoji + ' ' + elB.name + ' → <b>' + res.emoji + ' ' + res.name + '</b></span>' +
            '<span style="color:#06B6D4;font-family:monospace;">' + uses + '×</span>' +
          '</div>';
        }
      }

      let ladderHtml = '';
      for (let t = 0; t <= 4; t++) {
        const cls = t === highestTier ? 'tier-step peak' : (t < highestTier ? 'tier-step reached' : 'tier-step');
        ladderHtml += '<div class="' + cls + '"></div>';
      }

      box.innerHTML =
        '<div class="stats-grid">' +
          '<div class="stat-item">' +
            '<div class="stat-label">Total Material Ditemukan</div>' +
            '<div class="stat-value">' + count + ' / ' + total + ' (' + pct + '%)</div>' +
            '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%;"></div></div>' +
          '</div>' +
          '<div class="stat-item">' +
            '<div class="stat-label">Tier Tertinggi Dicapai</div>' +
            '<div class="stat-value" style="color:#F59E0B;">Tier ' + highestTier + '</div>' +
            '<div class="tier-ladder">' + ladderHtml + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="stat-item">' +
          '<div class="stat-label">Resep Paling Sering Digunakan</div>' +
          topRecipeHtml +
        '</div>';
    }

    function renderAltar() {
      const sA = document.getElementById('slot-a');
      const sB = document.getElementById('slot-b');
      const sR = document.getElementById('slot-res');
      if (state.slotA && ELEMENT_MAP[state.slotA]) {
        const el = ELEMENT_MAP[state.slotA];
        sA.className = 'slot filled';
        sA.innerHTML = '<span class="emoji">' + el.emoji + '</span><span class="label">' + el.name + '</span>';
      } else {
        sA.className = 'slot';
        sA.innerHTML = '<span class="emoji">➕</span><span class="label">Bahan 1</span>';
      }
      if (state.slotB && ELEMENT_MAP[state.slotB]) {
        const el = ELEMENT_MAP[state.slotB];
        sB.className = 'slot filled';
        sB.innerHTML = '<span class="emoji">' + el.emoji + '</span><span class="label">' + el.name + '</span>';
      } else {
        sB.className = 'slot';
        sB.innerHTML = '<span class="emoji">➕</span><span class="label">Bahan 2</span>';
      }
      if (state.lastResult) {
        sR.className = 'slot filled';
        sR.innerHTML = '<span class="emoji">' + state.lastResult.emoji + '</span><span class="label">' + state.lastResult.name + '</span>';
      } else {
        sR.className = 'slot';
        sR.innerHTML = '<span class="emoji">⚗️</span><span class="label">Hasil</span>';
      }
    }

    function updateHeader() {
      const total = ELEMENTS.length;
      const count = state.unlocked.length;
      const pct = Math.round((count / total) * 100);
      document.getElementById('progress-text').textContent = count + ' / ' + total + ' Elemen (' + pct + '%)';
      document.getElementById('recipe-text').textContent = state.discoveredRecipes.length + ' Resep Terbuka';
      document.getElementById('progress-fill').style.width = pct + '%';
    }

    function setTier(t) {
      state.tierFilter = t;
      const btns = document.querySelectorAll('.tier-btn');
      btns.forEach((b, i) => {
        const val = i === 0 ? 'all' : i - 1;
        b.className = val === t ? 'tier-btn active' : 'tier-btn';
      });
      renderInventory();
    }

    function renderInventory() {
      const q = (document.getElementById('search-input').value || '').toLowerCase();
      const grid = document.getElementById('elements-grid');
      const items = ELEMENTS.filter(e => state.unlocked.includes(e.id))
        .filter(e => state.tierFilter === 'all' || e.tier === state.tierFilter)
        .filter(e => !q || e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));

      grid.innerHTML = items.map(e => (
        '<div class="elem-card" draggable="true" ondragstart="event.dataTransfer.setData(\\'text/plain\\', \\'' + e.id + '\\')" onclick="selectElement(\\'' + e.id + '\\')">' +
          '<span class="emoji">' + e.emoji + '</span>' +
          '<span class="name">' + e.name + '</span>' +
          '<span class="tier-tag">T' + e.tier + ' · ' + e.category + '</span>' +
        '</div>'
      )).join('');
    }

    function renderHints() {
      const container = document.getElementById('hints-list');
      const lockedElements = ELEMENTS.filter(e => !state.unlocked.includes(e.id));
      if (lockedElements.length === 0) {
        container.innerHTML = '<div class="hint-card">🎉 Seluruh 50 elemen telah berhasil ditemukan!</div>';
        return;
      }
      const html = lockedElements.map(target => {
        const recipe = RAW_RECIPES.find(([a, b, res]) => res === target.id && (state.unlocked.includes(a) || state.unlocked.includes(b)))
          || RAW_RECIPES.find(([a, b, res]) => res === target.id);
        if (!recipe) return '';
        const knownId = state.unlocked.includes(recipe[0]) ? recipe[0] : (state.unlocked.includes(recipe[1]) ? recipe[1] : null);
        const knownEl = knownId ? ELEMENT_MAP[knownId] : null;
        return '<div class="hint-card">' +
          '<div>' +
            '<div style="font-size:0.7rem;color:#94A3B8;margin-bottom:4px;">Target Tier ' + target.tier + ' · ' + target.category + '</div>' +
            '<div class="hint-formula">' +
              (knownEl ? '<span>' + knownEl.emoji + ' <b>' + knownEl.name + '</b></span>' : '<span>🔒 Bahan Belum Terbuka</span>') +
              '<span>+</span><span>[ ? ]</span><span>=</span><span>❓ <b>???</b></span>' +
            '</div>' +
          '</div>' +
          (knownEl ? '<button class="icon-btn" onclick="useHintIngredient(\\'' + knownEl.id + '\\')">Pakai</button>' : '') +
        '</div>';
      }).join('');
      container.innerHTML = html;
    }

    function useHintIngredient(id) {
      state.slotA = id;
      state.slotB = null;
      state.lastResult = null;
      switchTab('play');
      renderAltar();
    }

    function renderCodex() {
      const container = document.getElementById('codex-list');
      const unlockedList = ELEMENTS.filter(e => state.unlocked.includes(e.id));
      container.innerHTML = unlockedList.map(e => (
        '<div class="hint-card">' +
          '<div>' +
            '<div style="font-weight:700;font-size:0.9rem;">' + e.emoji + ' ' + e.name + ' <span style="font-size:0.7rem;color:#06B6D4;">(Tier ' + e.tier + ')</span></div>' +
            '<div style="font-size:0.76rem;color:#94A3B8;margin-top:3px;">' + e.description + '</div>' +
          '</div>' +
        '</div>'
      )).join('');
    }

    function switchTab(tab) {
      document.getElementById('view-play').style.display = tab === 'play' ? 'block' : 'none';
      document.getElementById('view-hints').style.display = tab === 'hints' ? 'block' : 'none';
      document.getElementById('view-codex').style.display = tab === 'codex' ? 'block' : 'none';
      document.getElementById('tab-play').className = tab === 'play' ? 'nav-btn active' : 'nav-btn';
      document.getElementById('tab-hints').className = tab === 'hints' ? 'nav-btn active' : 'nav-btn';
      document.getElementById('tab-codex').className = tab === 'codex' ? 'nav-btn active' : 'nav-btn';
      if (tab === 'hints') renderHints();
      if (tab === 'codex') renderCodex();
    }

    const dropzone = document.getElementById('altar-dropzone');
    dropzone.addEventListener('dragover', e => e.preventDefault());
    dropzone.addEventListener('drop', e => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      if (id && ELEMENT_MAP[id]) selectElement(id);
    });

    document.getElementById('btn-sound').addEventListener('click', function() {
      state.sound = !state.sound;
      this.textContent = state.sound ? '🔊' : '🔇';
    });

    document.getElementById('btn-reset').addEventListener('click', function() {
      if (!state.confirmReset) {
        state.confirmReset = true;
        this.textContent = 'Yakin?';
        setTimeout(() => { state.confirmReset = false; this.textContent = 'Reset'; }, 3000);
      } else {
        state.unlocked = [...INITIAL_UNLOCKED];
        state.discoveredRecipes = [];
        state.recipeUsageCounts = {};
        state.slotA = null;
        state.slotB = null;
        state.lastResult = null;
        state.confirmReset = false;
        this.textContent = 'Reset';
        saveState();
        updateHeader();
        renderStatsCard();
        renderAltar();
        renderInventory();
      }
    });

    loadState();
    updateHeader();
    renderStatsCard();
    renderAltar();
    renderInventory();
  </script>
</body>
</html>`;
}
