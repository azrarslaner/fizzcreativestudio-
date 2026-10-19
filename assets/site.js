(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Nav gets its hairline once the page moves ---------- */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Packages preselect the form ---------- */
$$('.ask').forEach(a => a.addEventListener('click', () => { $('#f-pack').value = a.dataset.pack; }));

/* ---------- Copy email ---------- */
$('#copyMail').addEventListener('click', async e => {
  const b = e.currentTarget;
  try { await navigator.clipboard.writeText('fizzcreativestudio@gmail.com'); b.textContent = 'Copied'; }
  catch { b.textContent = 'Select the address to copy it'; }
  setTimeout(() => (b.textContent = 'Copy email'), 2200);
});

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
    status.textContent = 'Please add your name and a valid email.';
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
    sent.hidden = false; sent.focus();
  } catch {
    status.innerHTML = 'We couldn’t send the form right now. Please email us at <a href="mailto:fizzcreativestudio@gmail.com">fizzcreativestudio@gmail.com</a>.';
    status.classList.add('err'); btn.disabled = false;
  }
});

/* ---------- Entrances: each section's parts arrive in reading order, once ---------- */
const groups = [
  ['.hero', '.display, .lead, .actions, .hero-note, .hero-pic'],
  ['.sec-head', '.h2, .intro'], ['.svc', '.pic, .h3, p, .ticks'],
  ['.places', 'li'], ['.who', '.types'],
  ['.proc', '.proc-pic, .h2, .intro, .steps li'], ['main', '.band'],
  ['.packs', '.pack'], ['.story-top', '.h2, .story-txt'], ['.people', '.person'],
  ['.brief-side', '.h2, .intro'], ['.brief-main', '.field, .form-foot'],
  ['.contact-in', '.display, .contact-note, .actions, .contact-lines']
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
})();
