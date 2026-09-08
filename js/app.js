/* ============================================================
   Piyush Kumar — Web & App Developer · app.js
   Pricing engine · booking flow · portfolio · AI tools grid
   ============================================================ */
'use strict';

const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

const WA_NUMBER = '919234610543';
const WA_LINK = 'https://wa.me/' + WA_NUMBER;

/* ------------------------------------------------
   Tier cosmetics
------------------------------------------------- */
const TIER_META = [
  { label: 'Basic',    acc: '#38bdf8' }, // sky
  { label: 'Standard', acc: '#8b5cf6' }, // violet
  { label: 'Pro',      acc: '#f5c452' }  // gold
];
const POPULAR_TIER = 1; // index of the "Popular" tier in every category

const money = (n) => '\u20B9' + n.toLocaleString('en-IN');

/* tier prices are kept separately (the feature table has no price row) */
const PRICING_RAW = {
  landing:  [2999, 4999, 7999],
  business: [3499, 5999, 9499],
  tools:    [2999, 5499, 8999]
};

/* ------------------------------------------------
   PRICING DATA  — single source of truth.
   values may be: string | boolean | array of strings (shown as lines)
------------------------------------------------- */
const PRICING = [
  {
    id: 'landing',
    icon: 'i-layout',
    label: 'Landing Pages',
    short: 'Landing Pages',
    popular: 1,
    desc: 'One focused page that turns visitors into customers — ideal for <b>Gym · Salon · Tuition · Pandit Ji · Café · Handyman</b> and other local services.',
    tiers: [
      { blurb: 'A clean, honest one-pager with your services, photos and contact details.' },
      { blurb: 'Modern colours plus a WhatsApp button, so customers reach you in one tap.' },
      { blurb: 'A premium animated long page with map, SEO basics and a very fast load.' }
    ],
    features: [
      { label: 'Pages', vals: ['1 Page', '1 Page', '1 Long Page'] },
      { label: 'Design', vals: ['Simple & Clean', 'Modern + Colors', 'Premium + Animations'] },
      { label: 'Mobile Responsive', vals: [true, true, true] },
      { label: 'WhatsApp Button', vals: [false, true, true] },
      { label: 'Contact Form', vals: [false, true, true] },
      { label: 'Google Map', vals: [false, false, true] },
      { label: 'Fast Loading', vals: ['Normal', 'Fast', 'Super Fast'] },
      { label: 'SEO Basic', vals: [false, false, true] },
      { label: 'Revisions', vals: ['1', '2', '3'] },
      { label: 'Delivery', vals: ['2 days', '3 days', '4 days'] },
      { label: 'Free Hosting Help', vals: [false, true, true] }
    ]
  },
  {
    id: 'business',
    icon: 'i-brief',
    label: 'Business Websites',
    short: 'Business Websites',
    popular: 1,
    desc: 'A complete multi-page presence that builds trust and helps you get found — ideal for <b>Clinic · CA / Accountant · School · Restaurant · Builder</b> and more.',
    tiers: [
      { blurb: 'The essentials — home, about and contact — online, clean and quick.' },
      { blurb: 'A fuller site with services, gallery and map, styled professionally.' },
      { blurb: 'A complete online home: blog, testimonials, dark/light mode, full SEO and one month of free support.' }
    ],
    features: [
      { label: 'Pages', vals: ['3 Pages', '5 Pages', '7 Pages'] },
      { label: 'Pages included', vals: [['Home', 'About', 'Contact'], ['+ Services', 'Gallery'], ['+ Blog', 'Testimonials']] },
      { label: 'Design', vals: ['Simple', 'Professional', 'Premium + Dark/Light Mode'] },
      { label: 'Mobile Responsive', vals: [true, true, true] },
      { label: 'Contact Form', vals: [true, true, true] },
      { label: 'WhatsApp Chat', vals: [false, true, 'Yes, floating button'] },
      { label: 'Google Map', vals: [false, true, true] },
      { label: 'Photo Gallery', vals: [false, true, 'Yes, with lightbox'] },
      { label: 'SEO Setup', vals: [false, 'Basic', 'Full (meta tags, sitemap)'] },
      { label: 'Speed Optimization', vals: [false, false, true] },
      { label: 'Revisions', vals: ['1', '2', '4'] },
      { label: 'Delivery', vals: ['3 days', '5 days', '7 days'] },
      { label: 'Free Domain Help', vals: [false, true, true] },
      { label: '1 Month Support', vals: [false, false, 'Yes, free'] }
    ]
  },
  {
    id: 'tools',
    icon: 'i-tool',
    label: 'Web Tools',
    short: 'Web Tools',
    popular: 1,
    desc: 'Practical tools your customers — or your own business — can use every day: <b>calculators · converters · generators · PDF utilities</b> and more.',
    tiers: [
      { blurb: 'A small, focused calculator that does one job really well.' },
      { blurb: 'A useful utility with a clean card-based interface and PDF export.' },
      { blurb: 'A full workflow tool with downloads, saved data and your branding.' }
    ],
    features: [
      { label: 'Tool Type', vals: ['Simple Calculator', 'Utility Tool', 'Multi-Feature Tool'] },
      { label: 'Example', vals: [['GST Calc', 'Age Calc'], ['Invoice Maker', 'QR Generator'], ['PDF Tools', 'Resume Builder']] },
      { label: 'Features', vals: ['1\u20132 inputs', '4\u20135 inputs + output', 'Full workflow + download'] },
      { label: 'Design', vals: ['Basic Form', 'Clean UI + Cards', 'Premium + Animations'] },
      { label: 'Mobile Friendly', vals: [true, true, true] },
      { label: 'Print / Download', vals: [false, 'Yes, PDF', 'Yes, PDF + Excel'] },
      { label: 'Data Save', vals: [false, false, 'Yes, local storage'] },
      { label: 'Branding (Logo)', vals: [false, 'Yes', 'Yes, full custom'] },
      { label: 'Revisions', vals: ['1', '2', '3'] },
      { label: 'Delivery', vals: ['1\u20132 days', '2\u20133 days', '4\u20135 days'] }
    ]
  }
];

const catById = (id) => PRICING.find((c) => c.id === id);

/* ------------------------------------------------
   Booking state
------------------------------------------------- */
const state = {
  catId: null,
  tier: null,       // index
  price: null,
  catLabel: '',
  tierLabel: ''
};

/* ============================================================
   RENDER: Services / rate cards
============================================================ */
function valueHtml(v, acc) {
  if (v === true)  return '<span class="val-line v-ok"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg> <span>Yes</span></span>';
  if (v === false) return '<span class="val-line v-no"><svg class="ic" aria-hidden="true"><use href="#i-no"/></svg> <span>No</span></span>';
  if (Array.isArray(v)) {
    return v.map((l) => '<span class="val-line">' + l.replace(/^\+/, '<span class="sub-line">+</span>') + '</span>').join('');
  }
  return '<span class="val-line">' + String(v) + '</span>';
}

function chooseButtonHtml(cat, i) {
  const t = TIER_META[i];
  const sel = state.catId === cat.id && state.tier === i;
  return '<button type="button" class="btn-choose" data-choose data-cat="' + cat.id + '" data-tier="' + i + '" aria-pressed="' + sel + '">' +
         (sel ? 'Selected \u2713' : 'Choose this plan') + '</button>';
}

function buildDesktopTable(cat) {
  const accs = TIER_META.map((t) => t.acc);
  const thead = '<tr><th class="th-feat">What you get</th>' + TIER_META.map((t, i) =>
    '<th class="plan-cell' + (i === cat.popular ? ' is-popular' : '') + '" style="--acc:' + t.acc + '">' +
      (i === cat.popular ? '<span class="plan-pop">Popular</span>' : '') +
      '<span class="plan-name">' + t.label + '</span>' +
      '<span class="plan-sub">' + cat.tiers[i].blurb + '</span>' +
      '<span class="plan-price">' + money(cat.tiers[i].price) + ' <small>one-time</small></span>' +
      '<span class="plan-once">No hidden charges</span>' +
      chooseButtonHtml(cat, i) +
    '</th>').join('') + '</tr>';

  const body = cat.features.map((f) =>
    '<tr><td class="feat-name">' + f.label + '</td>' +
    f.vals.map((v, i) => '<td style="--acc:' + accs[i] + '">' + valueHtml(v) + '</td>').join('') +
    '</tr>').join('');

  return '<div class="cmp-table"><table><thead>' + thead + '</thead><tbody>' + body + '</tbody></table></div>';
}

function liHtml(label, v) {
  const val = v === true
    ? '<svg class="ic v-ok"><use href="#i-check"/></svg>'
    : v === false
      ? '<svg class="ic v-no"><use href="#i-no"/></svg>'
      : Array.isArray(v) ? v.join(' · ') : String(v);
  return '<li' + (Array.isArray(v) ? ' class="multi"' : '') + '><span>' + label + '</span><span>' + val + '</span></li>';
}

function buildMobileCards(cat) {
  return '<div class="plan-cards">' + TIER_META.map((t, i) => {
    const pr = cat.tiers[i].price;
    return '<div class="plan-card' + (i === cat.popular ? ' is-popular' : '') + '" style="--acc:' + t.acc + '">' +
      '<div class="plan-card-head">' +
        '<span class="plan-tag">' + t.label + '</span>' +
        '<span class="plan-price">' + money(pr) + '</span>' +
      '</div>' +
      '<span class="plan-once">one-time &middot; no hidden charges</span>' +
      '<span class="plan-sub">' + cat.tiers[i].blurb + '</span>' +
      '<ul>' + cat.features.map((f) => liHtml(f.label, f.vals[i])).join('') + '</ul>' +
      chooseButtonHtml(cat, i) +
    '</div>';
  }).join('') + '</div>';
}

function buildPanels() {
  const wrap = $('#catPanels');
  PRICING.forEach((cat) => {
    cat.tiers.forEach((t, i) => { t.price = PRICING_RAW[cat.id][i]; });
    const panel = document.createElement('div');
    panel.className = 'cat-panel';
    panel.dataset.catPanel = cat.id;
    panel.innerHTML = buildDesktopTable(cat) + buildMobileCards(cat);
    wrap.appendChild(panel);
  });
}

function activateCategory(id, opts = {}) {
  $$('.cat-tab').forEach((b) => {
    const on = b.dataset.cat === id;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', String(on));
  });
  $$('.cat-panel').forEach((p) => {
    p.classList.toggle('is-open', p.dataset.catPanel === id);
  });
  const cat = catById(id);
  $('#catDesc').innerHTML = cat.desc;
  if (opts.syncChoices !== false) syncAllChoiceButtons();
  if (opts.updateUrl !== false) {
    history.replaceState(null, '', '#' + (id ? 'services' : 'services'));
  }
}

function syncAllChoiceButtons() {
  $$('[data-choose]').forEach((b) => {
    const on = state.catId === b.dataset.cat && Number(b.dataset.tier) === state.tier;
    b.classList.toggle('is-selected', on);
    b.setAttribute('aria-pressed', String(on));
    b.innerHTML = on ? 'Selected \u2713' : 'Choose this plan';
  });
}

function setTabListeners() {
  $$('.cat-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activateCategory(tab.dataset.cat);
    });
  });
}

/* ============================================================
   RENDER: Portfolio — repeatable card layout.
   ADD A NEW PROJECT: push one object into PORTFOLIO.
     { name, desc, tags:[], url, urlLabel, qr, type, icon }
   Leave `qr` empty unless you add a scan graphic for it.
============================================================ */
const PORTFOLIO = [
  {
    name: 'Prem Kumar Technicians',
    desc: 'An online home for a trusted electronic & home appliance repair service — clear service listings, easy contact options and fast, mobile-first design.',
    tags: ['Repair Service', 'Business Website'],
    type: 'Local Business Website',
    url: 'https://premkumar-technicians.vercel.app/',
    urlLabel: 'Visit live site',
    qr: 'assets/qr-prem-technicians.png',
    status: 'Live'
  }
  /* ,{
     name: 'Your next project',
     ...
  } */
];

function renderPortfolio() {
  const grid = $('#portfolioGrid');
  PORTFOLIO.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'port-card';
    card.innerHTML =
      '<div class="port-thumb">' +
        '<div class="port-thumb-big">' +
          '<svg class="ic"><use href="#i-globe"/></svg>' +
          '<span class="port-thumb-cat">' + p.type + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="port-body">' +
        '<div class="port-meta">' +
          '<span class="port-status">' + (p.status || 'Live') + '</span>' +
          '<span class="port-tags">' + p.tags.map((t) => '<span>' + t + '</span>').join('') + '</span>' +
        '</div>' +
        '<h3>' + p.name + '</h3>' +
        '<p>' + p.desc + '</p>' +
        '<div class="port-foot">' +
          '<a class="port-link" href="' + p.url + '" target="_blank" rel="noopener">' + (p.urlLabel || 'Visit live site') +
            ' <svg class="ic"><use href="#i-ext"/></svg></a>' +
          (p.qr
            ? '<div class="port-qr"><img src="' + p.qr + '" alt="QR code for ' + p.name + ' — ' + p.url + '" loading="lazy" width="56" height="56"><span class="port-qr-cap">Scan to<br>visit site</span></div>'
            : '') +
        '</div>' +
      '</div>';
    grid.appendChild(card);
  });

  // "your project here" card keeps the layout alive between projects
  const ghost = document.createElement('article');
  ghost.className = 'port-card port-card--ghost';
  ghost.innerHTML =
    '<div class="port-body" style="align-items:center;justify-content:center;text-align:center;padding:34px 24px;">' +
      '<span class="ghost-ic"><svg class="ic"><use href="#i-spark"/></svg></span>' +
      '<h3>Your project here</h3>' +
      '<p>This card is reserved for the next project I ship. Have an idea? Let\u2019s build it.</p>' +
      '<a class="btn btn-wa-sm" href="' + WA_LINK + '" target="_blank" rel="noopener">' +
        '<svg class="ic"><use href="#i-wa"/></svg> Discuss your project</a>' +
    '</div>';
  grid.appendChild(ghost);
}

/* ============================================================
   RENDER: My AI Tools grid.
   ADD A TOOL: push { name, desc, icon, color, href? } into AI_TOOLS.
   Placeholder tiles automatically fill the remaining grid slots
   ("more tools launching soon") until a tool is added.
============================================================ */
const AI_TOOLS = [
  /* { name: 'Resume Builder', desc: '...', icon: 'i-doc', color: '#7c8cff', href: '#' } */
];

const AI_GHOSTS = [
  { icon: 'i-zap',    color: '#38d2f5' },
  { icon: 'i-coin',   color: '#f5c452' },
  { icon: 'i-tool',   color: '#8b5cf6' },
  { icon: 'i-spark',  color: '#7c8cff' },
  { icon: 'i-layout', color: '#43d9a0' },
  { icon: 'i-globe',  color: '#f472b6' }
];

function tileHtml(icon, color, body) {
  return '<div class="tool-tile" style="--tt:' + color + '">' +
    '<span class="tool-ic"><svg class="ic"><use href="#' + icon + '"/></svg></span>' + body + '</div>';
}

function renderTools() {
  const grid = $('#toolsGrid');
  const slots = Math.max(6, Math.ceil((AI_TOOLS.length + 1) / 3) * 3);

  AI_TOOLS.forEach((t) => {
    const body = '<h3>' + t.name + '</h3>' + (t.desc ? '<p>' + t.desc + '</p>' : '') + '<div class="tool-skel"><span style="width:70%"></span><span style="width:45%"></span></div>';
    grid.insertAdjacentHTML('beforeend', tileHtml(t.icon || 'i-spark', t.color || '#7c8cff', body));
  });

  for (let i = AI_TOOLS.length; i < slots; i++) {
    const g = AI_GHOSTS[(i - AI_TOOLS.length) % AI_GHOSTS.length];
    const body = '<h3>Tool launching soon</h3>' +
      '<span class="tool-soon">In the workshop</span>' +
      '<p>Being built &amp; tested — it will live free in this grid when it ships.</p>' +
      '<div class="tool-skel"><span style="width:72%"></span><span style="width:48%"></span></div>';
    grid.insertAdjacentHTML('beforeend', tileHtml(g.icon, g.color, body));
  }
}

/* ============================================================
   Booking flow
============================================================ */
const bkSelValue = $('#bkSelValue');

function updateBookingSummary() {
  const empty = !state.catId || state.tier === null;
  bkSelValue.classList.toggle('is-empty', empty);
  if (empty) {
    bkSelValue.textContent = 'No plan selected yet — choose any plan above.';
    return;
  }
  bkSelValue.innerHTML = '';
  const txt = document.createElement('span');
  txt.textContent = state.catLabel + ' \u2014 ' + state.tierLabel;
  const chip = document.createElement('span');
  chip.className = 'bk-price-chip';
  chip.textContent = money(state.price) + ' · one-time';
  bkSelValue.append(txt, chip);
}

function choosePlan(catId, tierIdx) {
  const cat = catById(catId);
  state.catId = catId;
  state.tier = tierIdx;
  state.price = cat.tiers[tierIdx].price;
  state.catLabel = cat.label;
  state.tierLabel = TIER_META[tierIdx].label;
  syncAllChoiceButtons();
  updateBookingSummary();

  const scroll = (el, block) => { if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: block || 'start' }); };
  setTimeout(() => scroll($('#bookingFormCard'), 'center'), 80);

  $('#bkError').hidden = true;
}

function planClickHandler(e) {
  const btn = e.target.closest('[data-choose]');
  if (!btn) return;
  choosePlan(btn.dataset.cat, Number(btn.dataset.tier));
}

/* form */
const form = $('#bookingForm');
const fName = $('#fName');
const fPhone = $('#fPhone');
const fReq = $('#fReq');
const bkError = $('#bkError');
const bkSuccess = $('#bkSuccess');
const bkFallback = $('#bkFallback');

function showError(msg) {
  bkSuccess.hidden = true;
  bkError.hidden = false;
  bkError.textContent = msg;
}
function clearError() { bkError.hidden = true; }

function markInvalid(el, bad) {
  el.classList.toggle('is-invalid', bad);
  return !bad;
}

function buildWaMessage() {
  const lines = [];
  if (state.catId) {
    lines.push('Hi Piyush \uD83D\uDC4B');
    lines.push('');
    lines.push('I\u2019d like to book the ' + state.catLabel + ' \u2014 ' + state.tierLabel + ' plan (' + money(state.price) + ', one-time).');
  } else {
    lines.push('Hi Piyush \uD83D\uDC4B, I\u2019d like to discuss a website / app project.');
  }
  lines.push('');
  lines.push('Name: ' + fName.value.trim());
  lines.push('WhatsApp: ' + fPhone.value.trim());
  if (fReq.value.trim()) {
    lines.push('');
    lines.push('My requirement:');
    lines.push(fReq.value.trim());
  }
  return lines.join('\n');
}

function onSubmit(e) {
  e.preventDefault();
  clearError();

  let ok = true;
  ok = markInvalid(fName, fName.value.trim().length < 2) && ok;
  const digits = (fPhone.value.match(/\d/g) || []).length;
  ok = markInvalid(fPhone, digits < 10 || digits > 13) && ok;

  if (!ok) {
    showError('Please add your full name and a valid 10-digit contact number so I can reach you.');
    return;
  }
  if (!state.catId) {
    const sel = $('.bk-selection');
    sel.classList.remove('shake');
    void sel.offsetWidth; // restart animation
    sel.classList.add('shake');
    showError('No plan selected yet — scroll up and choose a plan from Services & Pricing, then send your request.');
    $('#services').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { $('#bookingFormCard').scrollIntoView({ behavior: 'smooth' }); }, 550);
    return;
  }

  const msg = buildWaMessage();
  $('#fMsg').value = msg;
  const waUrl = WA_LINK + '?text=' + encodeURIComponent(msg);
  bkFallback.href = waUrl;
  window.open(waUrl, '_blank', 'noopener');
  bkSuccess.hidden = false;
}

/* ============================================================
   Header / nav / scroll-spy / footer
============================================================ */
const header = $('#siteHeader');
const menuBtn = $('#menuBtn');

function onScroll() {
  header.classList.toggle('is-solid', window.scrollY > 10);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* scroll spy */
const spySections = ['about', 'services', 'portfolio', 'tools', 'booking'];
const spyLinks = $$('[data-spy]');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    spyLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.spy === en.target.id));
  });
}, { rootMargin: '-38% 0px -55% 0px' });
spySections.forEach((id) => {
  const sec = document.getElementById(id);
  if (sec) spyObserver.observe(sec);
});

/* mobile menu */
function closeMenu() {
  document.body.classList.remove('menu-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
}
menuBtn.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMenu();
});
$$('.main-nav a').forEach((a) => a.addEventListener('click', closeMenu));

/* footer links that open a specific service category */
$$('[data-open-cat]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    activateCategory(a.dataset.openCat);
    $('#services').scrollIntoView({ behavior: 'smooth' });
  });
});

/* form listeners */
form.addEventListener('submit', onSubmit);
fName.addEventListener('input', () => markInvalid(fName, false));
fPhone.addEventListener('input', () => markInvalid(fPhone, false));
document.addEventListener('click', planClickHandler);

/* year */
$('#year').textContent = new Date().getFullYear();

/* ============================================================
   Init
============================================================ */
function init() {
  buildPanels();
  setTabListeners();
  activateCategory('landing', { updateUrl: false });
  renderPortfolio();
  renderTools();
  updateBookingSummary();
  // restore a saved choice if present
  try {
    const saved = JSON.parse(localStorage.getItem('pk_selection') || 'null');
    if (saved && catById(saved.catId) && saved.tier >= 0 && saved.tier <= 2) {
      state.catId = saved.catId;
      state.tier = saved.tier;
      state.price = catById(saved.catId).tiers[saved.tier].price;
      state.catLabel = catById(saved.catId).label;
      state.tierLabel = TIER_META[saved.tier].label;
      activateCategory(saved.catId, { updateUrl: false });
      updateBookingSummary();
      syncAllChoiceButtons();
    }
  } catch (_) { /* ignore */ }

  document.addEventListener('beforeunload', () => {
    try {
      localStorage.setItem('pk_selection', JSON.stringify({ catId: state.catId, tier: state.tier }));
    } catch (_) { /* ignore */ }
  });
}
init();
