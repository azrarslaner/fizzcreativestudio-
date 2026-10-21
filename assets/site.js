(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Nav gets its hairline once the page moves ---------- */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Try it: one name across sign, feed, website and maps ---------- */
const TYPES = {
  cafe:   { tag: 'coffee & more',   post: 'Grand opening.',         web: 'Book a table.',       cta: 'Reserve',   photo: 'img/photos/barista.jpg', form: 'Café / restaurant' },
  clinic: { tag: 'dental studio',   post: 'Your smile, our care.',  web: 'Book a check-up.',    cta: 'Book now',  photo: 'img/photos/dental.jpg',  form: 'Dental / health clinic' },
  salon:  { tag: 'hair & beauty',   post: 'New season, new look.',  web: 'Book your chair.',    cta: 'Book now',  photo: 'img/photos/salon.jpg',   form: 'Beauty salon / barber' },
  bakery: { tag: 'bakery & pastry', post: 'Fresh out of the oven.', web: 'Order for tomorrow.', cta: 'Order now', photo: 'img/photos/bakery.jpg',  form: 'Bakery' }
};
const kit = $('#kit'), bName = $('#bName');
let type = 'cafe';
const nameOf = () => bName.value.replace(/\s+/g, ' ').trim() || 'Luna';

function drawName() {
  const n = nameOf();
  $$('.nm', kit).forEach(e => (e.textContent = n));
  $('.k-handle', kit).textContent = '@' + n.toLowerCase().replace(/[^a-z0-9çğıöşüëé]+/gi, '');
}
function drawType(animate) {
  const t = TYPES[type];
  $$('[data-k]', kit).forEach(el => {
    const k = el.dataset.k;
    if (k === 'photo') { el.src = t.photo; return; }
    el.textContent = t[k];
    /* a short blur bridges the old words and the new ones */
    if (animate && !reduce && el.animate) el.animate([{ opacity: .4, filter: 'blur(3px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 220, easing: 'cubic-bezier(.23,1,.32,1)' });
  });
}
bName.addEventListener('input', drawName);
$$('#bTypes button').forEach(b => b.addEventListener('click', () => {
  $$('#bTypes button').forEach(x => x.setAttribute('aria-pressed', x === b));
  type = b.dataset.type;
  drawType(true);
}));
$('#bGo').addEventListener('click', () => {
  $('#f-biz').value = nameOf();
  $('#f-type').value = TYPES[type].form;
  const brand = $('input[name="Services"][value="Branding"]');
  if (brand) brand.checked = true;
  $('#brief').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  setTimeout(() => $('#f-name').focus({ preventScroll: true }), reduce ? 0 : 700);
});

/* ---------- On phones the service lists start folded ---------- */
if (matchMedia('(max-width: 760px)').matches) $$('.incl').forEach(d => (d.open = false));

/* ---------- Packages preselect the form ---------- */
$$('.ask').forEach(a => a.addEventListener('click', () => { $('#f-pack').value = a.dataset.pack; }));

/* ---------- Copy email ---------- */
$('#copyMail').addEventListener('click', async e => {
  const b = e.currentTarget;
  try { await navigator.clipboard.writeText('fizzcreativestudio@gmail.com'); b.textContent = 'Copied'; }
  catch { b.textContent = 'Select the address to copy it'; }
  setTimeout(() => (b.textContent = 'Copy email'), 2200);
});

/* ---------- Brief form (FormSubmit). Errors appear only after a send attempt. ---------- */
const FORM_TO = 'https://formsubmit.co/ajax/fizzcreativestudio@gmail.com';
const form = $('#briefForm'), status = $('#f-status');
const nameEl = $('#f-name'), mailEl = $('#f-email');
const okMail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
let tried = false;
function check() {
  const badName = !nameEl.value.trim(), badMail = !okMail(mailEl.value.trim());
  nameEl.setAttribute('aria-invalid', badName); $('#e-name').hidden = !badName;
  mailEl.setAttribute('aria-invalid', badMail); $('#e-email').hidden = !badMail;
  return { badName, badMail };
}
[nameEl, mailEl].forEach(el => el.addEventListener('input', () => { if (tried) check(); }));
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (form._honey.value) return;
  tried = true;
  const { badName, badMail } = check();
  if (badName || badMail) { (badName ? nameEl : mailEl).focus(); return; }
  const name = nameEl.value.trim(), email = mailEl.value.trim(), biz = $('#f-biz').value.trim();
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
    sent.hidden = false; sent.focus();
  } catch {
    status.innerHTML = 'We couldn’t send the form right now. Please email us at <a href="mailto:fizzcreativestudio@gmail.com">fizzcreativestudio@gmail.com</a>.';
    status.classList.add('err'); btn.disabled = false;
  }
});

/* ---------- Entrances: each section's parts arrive in reading order, once ---------- */
const groups = [
  ['.hero', '.display, .lead, .actions, .hero-note, .hero-pic'],
  ['.try-side', '.h2, .try-controls'], ['.kit', '.k'],
  ['.sec-head', '.h2, .intro'], ['.svc', '.pic, .h3, p, .ticks'],
  ['.places', 'li'], ['.who', '.types'],
  ['.proc-top', '.h2, .intro, .proc-pic'], ['.steps', 'li'],
  ['.packs', '.pack'], ['.story-top', '.h2, .story-txt'], ['.people', '.person'],
  ['.brief-side', '.h2, .intro, .brief-note'], ['.brief-main', '.field, .form-foot'],
  ['.contact-in', '.contact-h, .contact-note, .actions, .contact-lines']
];
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  groups.forEach(([root, kids]) => $$(root).forEach(r => $$(kids, r).forEach((el, i) => {
    if (el.dataset.rv !== undefined) return;
    el.dataset.rv = el.matches('.pic') ? 'pic' : '';
    el.style.setProperty('--i', Math.min(i, 6));
    io.observe(el);
  })));
}

drawName(); drawType(false);
})();
