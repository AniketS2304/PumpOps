/**
 * PumpOps V2 — App Utilities & Navigation
 * Shared helpers used across prototype screens.
 */

'use strict';

// ─── Offline / Sync State ─────────────────────────────────────
let _syncState = 'online'; // 'online' | 'offline' | 'pending' | 'syncing'

function getSyncState() { return _syncState; }
function setSyncState(state) {
  _syncState = state;
  document.querySelectorAll('.js-sync-badge').forEach(el => {
    el.className = 'sync-status sync-status--' + (state === 'online' ? 'online' : state === 'offline' ? 'offline' : 'pending');
    const icons = { online: '●', offline: '○', pending: '↑', syncing: '⟳' };
    const labels = { online: 'Online', offline: 'Offline', pending: '3 pending', syncing: 'Syncing…' };
    el.textContent = icons[state] + ' ' + labels[state];
  });
}

// ─── Time ─────────────────────────────────────────────────────
function now() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return h + ':' + m;
}

function nowAmPm() {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + m + ' ' + ampm;
}

function greetingPrefix() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Drill-down Modal ─────────────────────────────────────────
function showCalcModal(title, rows) {
  // Remove existing
  document.querySelectorAll('.modal-overlay').forEach(el => el.remove());

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-sheet" style="position:relative">
      <div class="modal-sheet__handle"></div>
      <div class="modal-sheet__title">${title}</div>
      <div class="modal-sheet__body">
        ${rows.map(r => `
          <div class="row">
            <span class="row__label">${r.label}</span>
            <span class="row__value">${r.value}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ─── Confirm Modal ────────────────────────────────────────────
function showConfirmModal({ title, body, confirmLabel, confirmClass, onConfirm }) {
  document.querySelectorAll('.confirm-modal-overlay').forEach(el => el.remove());

  const overlay = document.createElement('div');
  overlay.className = 'confirm-modal-overlay';
  overlay.innerHTML = `
    <div class="confirm-modal">
      <div class="confirm-modal__title">${title}</div>
      <div class="confirm-modal__body">${body}</div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn--ghost" id="cm-cancel" style="flex:1">Cancel</button>
        <button class="btn ${confirmClass || 'btn--primary'}" id="cm-confirm" style="flex:1">${confirmLabel || 'Confirm'}</button>
      </div>
    </div>
  `;
  overlay.querySelector('#cm-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#cm-confirm').addEventListener('click', () => { overlay.remove(); onConfirm && onConfirm(); });
  document.body.appendChild(overlay);
}

// ─── Toast ────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const colors = { success: '#16a34a', error: '#dc2626', info: '#2563eb', warn: '#d97706' };
  toast.style.cssText = `
    position:fixed;top:16px;left:50%;transform:translateX(-50%);
    background:${colors[type]||colors.success};color:#fff;
    padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;
    z-index:9999;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.2);
    animation:toastIn .2s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ─── Active Nav Item ──────────────────────────────────────────
function setActiveNav(id) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('nav-item--active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('nav-item--active');
}

// ─── Tab Switching ────────────────────────────────────────────
function initTabs(containerSelector, onSwitch) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const tabs = container.querySelectorAll('.tab-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('tab-item--active'));
      tab.classList.add('tab-item--active');
      const target = tab.dataset.target;
      document.querySelectorAll('[data-tab-panel]').forEach(p => {
        p.classList.toggle('hidden', p.dataset.tabPanel !== target);
      });
      if (onSwitch) onSwitch(target);
    });
  });
}

// ─── Stepper ──────────────────────────────────────────────────
function initStepper(steps, currentStep) {
  steps.forEach((step, i) => {
    const el = document.querySelector(`[data-step="${i + 1}"]`);
    if (!el) return;
    const dot = el.querySelector('.step-dot');
    el.classList.remove('step-item--active', 'step-item--done');
    if (i + 1 < currentStep) {
      el.classList.add('step-item--done');
      if (dot) dot.textContent = '✓';
    } else if (i + 1 === currentStep) {
      el.classList.add('step-item--active');
      if (dot) dot.textContent = i + 1;
    } else {
      if (dot) dot.textContent = i + 1;
    }
  });
}

// ─── Filter Pills ─────────────────────────────────────────────
function initFilterPills(containerSelector, onChange) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('filter-pill--active'));
      pill.classList.add('filter-pill--active');
      if (onChange) onChange(pill.dataset.value);
    });
  });
}

// ─── Clock ────────────────────────────────────────────────────
function startClock(selector) {
  function update() {
    const el = document.querySelector(selector);
    if (el) el.textContent = nowAmPm();
  }
  update();
  setInterval(update, 30000);
}

// CSS animation helper
const style = document.createElement('style');
style.textContent = `
  @keyframes toastIn {
    from { opacity:0; transform:translateX(-50%) translateY(-8px); }
    to   { opacity:1; transform:translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(style);

// ─── State Management (localStorage) ─────────────────────────
const STATE_KEY = 'pumpops_shift';
const PRICES_KEY = 'pumpops_prices';
const EXPENSES_KEY = 'pumpops_expenses';
const CREDIT_ENTRIES_KEY = 'pumpops_credit_entries';
const QUALITY_KEY = 'pumpops_quality_checks';
const READINGS_KEY = 'pumpops_readings';

function getState() {
  try { return JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); } catch(e) { return {}; }
}
function setState(data) {
  localStorage.setItem(STATE_KEY, JSON.stringify({ ...getState(), ...data }));
}
function clearShiftState() {
  [STATE_KEY, EXPENSES_KEY, CREDIT_ENTRIES_KEY, QUALITY_KEY, READINGS_KEY].forEach(k => localStorage.removeItem(k));
}

// Fuel Prices
function getPrices() {
  try {
    const p = JSON.parse(localStorage.getItem(PRICES_KEY) || 'null');
    if (p) return p;
  } catch(e) {}
  // Default from mock data
  return { MS: 104.72, HSD: 92.40, Speed: 113.50, setDate: null };
}
function setPrices(ms, hsd, speed) {
  localStorage.setItem(PRICES_KEY, JSON.stringify({
    MS: parseFloat(ms), HSD: parseFloat(hsd), Speed: parseFloat(speed),
    setDate: new Date().toDateString()
  }));
}
function arePricesLockedToday() {
  const p = getPrices();
  return p.setDate === new Date().toDateString();
}

// Expenses
function getExpenses() {
  try { return JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]'); } catch(e) { return []; }
}
function saveExpenses(list) { localStorage.setItem(EXPENSES_KEY, JSON.stringify(list)); }

// Credit Entries (DSM)
function getCreditEntries() {
  try { return JSON.parse(localStorage.getItem(CREDIT_ENTRIES_KEY) || '[]'); } catch(e) { return []; }
}
function saveCreditEntries(list) { localStorage.setItem(CREDIT_ENTRIES_KEY, JSON.stringify(list)); }

// Quality Checks
function getQualityChecks() {
  try { return JSON.parse(localStorage.getItem(QUALITY_KEY) || '[]'); } catch(e) { return []; }
}
function saveQualityChecks(list) { localStorage.setItem(QUALITY_KEY, JSON.stringify(list)); }
function getLastQualityCheck() {
  const checks = getQualityChecks();
  return checks.length ? checks[checks.length - 1] : null;
}
function minutesSinceLastCheck() {
  const last = getLastQualityCheck();
  if (!last) return Infinity;
  return Math.floor((Date.now() - new Date(last.timestamp).getTime()) / 60000);
}

// Nozzle readings
function getReadings() {
  try { return JSON.parse(localStorage.getItem(READINGS_KEY) || '{}'); } catch(e) { return {}; }
}
function saveReadings(data) {
  localStorage.setItem(READINGS_KEY, JSON.stringify({ ...getReadings(), ...data }));
}

// ─── Grade-wise Litres Helper ──────────────────────────────────
/**
 * Render grade-wise breakdown HTML
 * @param {Array} grades — [{grade:'MS', litres:359, amount:37594}, ...]
 * @returns {string} HTML
 */
function renderGradeBreakdown(grades) {
  const gradeStyles = {
    MS:    { color: 'var(--green)',  bg: 'var(--green-bg)',  border: 'var(--green-border)',  icon: '⛽', label: 'Petrol (MS)' },
    Speed: { color: '#d97706',       bg: '#fffbeb',          border: '#fde68a',              icon: '🔥', label: 'Speed (Premium)' },
    HSD:   { color: 'var(--blue)',   bg: 'var(--blue-bg)',   border: 'var(--blue-border)',   icon: '🛢', label: 'Diesel (HSD)' },
  };
  return grades.map(g => {
    const s = gradeStyles[g.grade] || {};
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:16px;">${s.icon||''}</span>
          <div>
            <div style="font-size:12px;font-weight:700;color:${s.color||'var(--text-primary)'};">${s.label||g.grade}</div>
            <div style="font-size:11px;color:var(--text-muted);">Nozzle ${g.nozzle||''}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:14px;font-weight:800;">${(g.litres||0).toFixed(2)} L</div>
          ${g.amount != null ? `<div style="font-size:11px;color:var(--text-muted);">${PO ? PO.formatINR(g.amount) : ''}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ─── MPD/Nozzle Helpers ───────────────────────────────────────
function getMpdData(mpdId) {
  if (typeof MOCK === 'undefined') return null;
  return MOCK.mpds.find(m => m.id === mpdId) || null;
}
function getNozzlesForMpd(mpdId) {
  const mpd = getMpdData(mpdId);
  if (!mpd) return [];
  return mpd.nozzles;
}
function getGradeColor(grade) {
  const colors = { MS: '#16a34a', HSD: '#2563eb', Speed: '#d97706' };
  return colors[grade] || '#64748b';
}
function getGradeBadgeClass(grade) {
  const cls = { MS: 'badge--green', HSD: 'badge--blue', Speed: 'badge--amber' };
  return cls[grade] || 'badge--slate';
}

// ─── Time Duration ────────────────────────────────────────────
function calcDuration(inTimeStr, outTimeStr) {
  if (!inTimeStr || !outTimeStr) return null;
  const parse = s => {
    const [h,m] = s.replace(/\s?(AM|PM)/i,'').split(':').map(Number);
    const ampm = /PM/i.test(s);
    return (ampm && h !== 12 ? h + 12 : (!ampm && h === 12 ? 0 : h)) * 60 + m;
  };
  const diff = parse(outTimeStr) - parse(inTimeStr);
  if (diff <= 0) return null;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${hrs} hr${hrs !== 1 ? 's' : ''} ${mins} min`;
}

window.APP = {
  getSyncState, setSyncState,
  now, nowAmPm, greetingPrefix,
  showCalcModal, showConfirmModal, showToast,
  setActiveNav, initTabs, initStepper, initFilterPills, startClock,
  // State
  getState, setState, clearShiftState,
  // Prices
  getPrices, setPrices, arePricesLockedToday,
  // Expenses
  getExpenses, saveExpenses,
  // Credit
  getCreditEntries, saveCreditEntries,
  // Quality
  getQualityChecks, saveQualityChecks, getLastQualityCheck, minutesSinceLastCheck,
  // Readings
  getReadings, saveReadings,
  // Helpers
  renderGradeBreakdown, getMpdData, getNozzlesForMpd, getGradeColor, getGradeBadgeClass, calcDuration,
};
