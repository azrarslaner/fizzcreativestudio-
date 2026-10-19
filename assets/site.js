(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Try it on your name ---------- */
const TYPES = {
  cafe:       { post: 'Grand opening',      web: 'Book a table',     cta: 'Reserve',      win: 'Open daily' },
  restaurant: { post: 'Tonight’s menu',     web: 'Book a table',     cta: 'Reserve',      win: 'Dinner from 7' },
  clinic:     { post: 'Smile, it’s Monday', web: 'Book a check-up',  cta: 'Book a visit', win: 'By appointment' },
  salon:      { post: 'New season colour',  web: 'Book your chair',  cta: 'Book now',     win: 'Walk-ins welcome' },
  barber:     { post: 'Fresh cuts only',    web: 'Grab a chair',     cta: 'Book a cut',   win: 'Walk-ins welcome' },
  bakery:     { post: 'Out of the oven',    web: 'Order a cake',     cta: 'Order',        win: 'From 7 am' },
  boutique:   { post: 'New in this week',   web: 'Shop the edit',    cta: 'Visit us',     win: 'New in' }
};
const PALS = [
  { a: '#1D4A5E', b: '#E06A4E', c: '#F6F1EA', wall: '#A9C3C5' },
  { a: '#3B2A22', b: '#D9A441', c: '#F3E9DC', wall: '#E7D6BF' },
  { a: '#0F4C45', b: '#7CC2B0', c: '#EEF5F1', wall: '#CFE3DA' },
  { a: '#5A2338', b: '#E79A8A', c: '#F8ECEA', wall: '#EBC9C3' }
];
const FORM_TYPE = { cafe: 'Café', restaurant: 'Restaurant', clinic: 'Dental clinic', salon: 'Beauty salon', barber: 'Barber', bakery: 'Bakery', boutique: 'Boutique' };

const input = $('#bizName'), big = $('#bigName'), kit = $('#kit');
let type = 'cafe';
const clean = v => v.replace(/\s+/g, ' ').trim();
const nameOf = () => clean(input.value) || 'Luna';

function drawName() {
  const n = nameOf();
  big.textContent = n;
  $$('.nm', kit).forEach(e => (e.textContent = n));
  $('.ini', kit).textContent = n.charAt(0);
  $('#kHandle').textContent = '@' + n.toLowerCase().replace(/[^a-z0-9çğıöşüëé]+/gi, '');
  kit.setAttribute('aria-label', `Sketches of ${n} as a shop sign, an Instagram post and a booking page`);
  fitName();
}
function drawType(animate) {
  const t = TYPES[type];
  const els = { '#kPost': t.post, '#kWeb': t.web, '#kCta': t.cta, '#kWin': t.win };
  for (const [sel, text] of Object.entries(els)) {
    const el = $(sel);
    el.textContent = text;
    /* a short blur bridges the old words and the new ones */
    if (animate && !reduce && el.animate) el.animate([{ opacity: .35, filter: 'blur(3px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 240, easing: 'cubic-bezier(.23,1,.32,1)' });
  }
}
/* the big name fits the content width; the sign name fits its board */
const innerW = el => { const cs = getComputedStyle(el); return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); };
function fitName() {
  const p = $('.try-name');
  const box = innerW(p.parentElement);
  p.style.fontSize = '100px';
  p.style.display = 'inline-block';
  const w = p.scrollWidth || 1;
  p.style.display = '';
  const cap = innerWidth < 700 ? innerWidth * 0.26 : Math.min(innerWidth * 0.2, 300);
  p.style.fontSize = Math.min(cap, 100 * box / w) + 'px';
  const sign = $('.shop-sign');
  const s = sign.querySelector('.nm');
  sign.style.fontSize = '';
  const room = sign.clientWidth * 0.84;
  const sw = s.scrollWidth + s.nextElementSibling.offsetWidth;
  if (sw > room) sign.style.fontSize = parseFloat(getComputedStyle(sign).fontSize) * room / sw + 'px';
}

input.addEventListener('input', drawName);
input.addEventListener('focus', () => input.select());
$$('#bizTypes button').forEach(b => b.addEventListener('click', () => {
  $$('#bizTypes button').forEach(x => x.setAttribute('aria-pressed', x === b));
  type = b.dataset.type;
  drawType(true);
}));
$$('#bizPals button').forEach(b => b.addEventListener('click', () => {
  $$('#bizPals button').forEach(x => x.setAttribute('aria-pressed', x === b));
  const p = PALS[+b.dataset.pal];
  kit.style.setProperty('--pa', p.a);
  kit.style.setProperty('--pb', p.b);
  kit.style.setProperty('--pc', p.c);
  $('.shop', kit).style.background = p.wall;
}));
$('#tryGo').addEventListener('click', () => {
  $('#f-biz').value = nameOf();
  $('#f-type').value = FORM_TYPE[type];
  const brand = $('input[name="Services"][value="Branding"]');
  if (brand) brand.checked = true;
  $('#brief').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  setTimeout(() => $('#f-name').focus({ preventScroll: true }), reduce ? 0 : 700);
});

/* ---------- Services: hovering a name shows its line ---------- */
const desc = $('#svcDesc'), descDefault = desc.textContent;
let descTimer;
function showDesc(li) {
  clearTimeout(descTimer);
  $$('.svc-col li.on').forEach(x => x.classList.remove('on'));
  if (li) { li.classList.add('on'); desc.textContent = li.dataset.d; }
  else descTimer = setTimeout(() => (desc.textContent = descDefault), 200);
}
if (matchMedia('(hover: hover)').matches) {
  $$('.svc-col li').forEach(li => {
    li.addEventListener('mouseenter', () => showDesc(li));
    li.addEventListener('mouseleave', () => showDesc(null));
  });
}

/* ---------- Contact: the email set as display type, fitted to the width ---------- */
function fitMail() {
  const m = $('#mail');
  const box = innerW(m.parentElement);
  m.style.fontSize = '100px';
  const w = Math.max(...$$('span', m).map(s => s.scrollWidth)) || 1;
  m.style.fontSize = Math.floor(100 * box / w * 0.98) + 'px';
}
$('#copyMail').addEventListener('click', async e => {
  const b = e.currentTarget;
  try { await navigator.clipboard.writeText('fizzcreativestudio@gmail.com'); b.textContent = 'Copied'; }
  catch { b.textContent = 'fizzcreativestudio@gmail.com'; }
  setTimeout(() => (b.textContent = 'Copy email'), 2200);
});

/* ---------- Packages preselect the form ---------- */
$$('.ask').forEach(a => a.addEventListener('click', () => { $('#f-pack').value = a.dataset.pack; }));

/* ---------- Brief form (FormSubmit) ---------- */
const FORM_TO = 'https://formsubmit.co/ajax/fizzcreativestudio@gmail.com';
const form = $('#briefForm'), status = $('#f-status');
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (form._honey.value) return;
  const nameEl = $('#f-name'), mailEl = $('#f-email');
  const name = nameEl.value.trim(), email = mailEl.value.trim();
  const badName = !name, badMail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  nameEl.setAttribute('aria-invalid', badName); mailEl.setAttribute('aria-invalid', badMail);
  if (badName || badMail) {
    status.textContent = badName ? 'Please add your name so we know who to reply to.' : 'That email doesn’t look right. Check it and try again.';
    status.classList.add('err');
    (badName ? nameEl : mailEl).focus();
    return;
  }
  const biz = $('#f-biz').value.trim();
  const data = {
    Name: name, Business: biz || '-', email, Phone: $('#f-phone').value.trim() || '-',
    'Business type': $('#f-type').value || '-', Package: $('#f-pack').value || 'Not sure yet',
    Services: $$('input[name="Services"]:checked').map(c => c.value).join(', ') || '-',
    Message: $('#f-msg').value.trim() || '-',
    _subject: `New brief from the website: ${biz || name}`, _template: 'table', _captcha: 'false'
  };
  const btn = $('#f-send');
  btn.disabled = true; status.classList.remove('err'); status.textContent = 'Sending…';
  try {
    const r = await fetch(FORM_TO, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || 'failed');
    form.hidden = true;
    const sent = $('#sent');
    $('#sentP').textContent = `Thanks, ${name.split(' ')[0]}. We’ll reply to ${email} soon.`;
    sent.hidden = false; sent.focus();
  } catch {
    status.innerHTML = 'We couldn’t send the form just now. Please email us at <a href="mailto:fizzcreativestudio@gmail.com">fizzcreativestudio@gmail.com</a>.';
    status.classList.add('err'); btn.disabled = false;
  }
});

/* ---------- Entrances: each section's parts arrive in reading order, once ---------- */
const groups = [
  ['.try-head', '.h2, .try-intro'], ['.try', '.try-controls, .try-name'], ['.kit', 'figure'],
  ['.svc-head', '.h2, .svc-desc'], ['.svc-cols', '.svc-col'],
  ['.who', '.h2, .who-intro'], ['.poster', 'li'],
  ['.proc', '.proc-h'], ['.s1', '.frame, p'], ['.s2', '.frame, p'], ['.s3', '.frame, p'], ['.s4', '.frame, p'],
  ['.pk-side', '.h2, p, .pk-pic'], ['.menu', '.menu-group h3, .item'],
  ['.studio-side', '.studio-h, .studio-story'], ['.person', '.portrait, .person-txt'], ['.studio-people', '.studio-duo'],
  ['.faq', '.faq-row'], ['.brief-side', '.h2, p, .brief-pic'], ['.form', '.field, .form-foot'],
  ['.contact', '.contact-h, .mail, .contact-foot'], ['.foot', '.foot-mark, .foot-row, .foot-legal']
];
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  groups.forEach(([root, kids]) => $$(root).forEach(r => $$(kids, r).forEach((el, i) => {
    if (el.dataset.rv !== undefined) return;
    el.dataset.rv = el.matches('.frame, .portrait, .pk-pic, .brief-pic') ? 'pic' : '';
    el.style.setProperty('--i', Math.min(i, 8));
    io.observe(el);
  })));
}

/* ---------- One moving picture: the illustrated founders drift against the scroll ---------- */
if (!reduce) {
  const movers = $$('.frame img, .portrait img');
  let ticking = false;
  const drift = () => {
    const h = innerHeight;
    for (const img of movers) {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h) continue;
      const p = (r.top + r.height / 2 - h / 2) / h; // -1 … 1 around the centre of the screen
      img.style.transform = (img.classList.contains('alt') ? 'translateX(-50%) ' : '') + `translateY(${(p * 7).toFixed(2)}%)`;
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }, { passive: true });
  drift();
}

/* ---------- Initial draw and resize ---------- */
drawType(); drawName(); fitMail();
let rt;
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { fitName(); fitMail(); }, 120); });
document.fonts && document.fonts.ready.then(() => { fitName(); fitMail(); });
})();
