export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // ✅ Admin = fișiere statice, NU route dinamic
  if (path === "/admin" || path.startsWith("/admin/")) {
    return context.next();
  }

  // ... restul codului tău existent
}import {DEFAULT_SITE, DEFAULT_COUNTRIES, DEFAULT_ARTICLES} from './defaults.js';

function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function layout(lang, title, desc, body){
  const langs=['ro','ru','en'].map(l=>`<a class="${l===lang?'active':''}" href="/${l}">${l.toUpperCase()}</a>`).join('');
  return `<!doctype html><html lang="${lang}"><head>
    <meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>${esc(title)}</title><meta name="description" content="${esc(desc)}"/>
    <link rel="stylesheet" href="/assets/styles.css"/>
  </head><body>
    <header class="topbar"><div class="container nav">
      <a class="brand" href="/${lang}">
        <div class="logo">VD</div>
        <div class="brandtext">
          <div class="name">Avocat Viorel Dodan</div>
          <div class="tag">SERVICII JURIDICE • CHIȘINĂU • DIASPORA</div>
        </div>
      </a>
      <nav class="menu">
        <a href="/${lang}#despre">Despre</a>
        <a href="/${lang}#servicii">Servicii</a>
        <a href="/${lang}#onorarii">Onorarii</a>
        <a href="/${lang}#faq">FAQ</a>
        <a href="/${lang}/diaspora">Diaspora</a>
        <a href="/${lang}#galerie">Galerie</a>
        <a href="/${lang}#contact">Contact</a>
      </nav>
      <div class="lang">${langs}</div>
    </div></header>
    ${body}
    <footer class="footer"><div class="container foot">
      <div>© <span class="gold">Avocat Viorel Dodan</span></div><div>Chișinău • Moldova • Diaspora</div>
    </div></footer>
  </body></html>`;
}

function lightboxScript(){
  return `<script>
  const lb=document.createElement('div');lb.className='lightbox';
  lb.innerHTML='<button class="lb-close">×</button><img>';document.body.appendChild(lb);
  const img=lb.querySelector('img');const close=()=>lb.classList.remove('open');
  lb.querySelector('.lb-close').onclick=close;lb.onclick=(e)=>{if(e.target===lb) close();};
  document.querySelectorAll('[data-lb]').forEach(a=>{
    a.addEventListener('click',(e)=>{e.preventDefault();img.src=a.getAttribute('href');lb.classList.add('open');});
  });
  </script>`;
}

function home(lang, site, countries){
  const t = (site.strings && (site.strings[lang]||site.strings.ro)) || DEFAULT_SITE.strings.ro;
  const fee = (site.fees && (site.fees[lang]||site.fees.ro)) || DEFAULT_SITE.fees.ro;
  const faq = (site.faq && (site.faq[lang]||site.faq.ro)) || DEFAULT_SITE.faq.ro;
  const sv  = (site.services && (site.services[lang]||site.services.ro)) || DEFAULT_SITE.services.ro;

  const servicesCards = sv.map(s=>`
    <div class="card"><div class="pad">
      <h3>${esc(s.title)}</h3><p class="muted">${esc(s.text)}</p>
      <div class="cta">
        <a class="btn primary" href="https://wa.me/${site.contact.phone.replace(/\D/g,'')}?text=${encodeURIComponent('Bună ziua! '+s.waText)}">WhatsApp</a>
        <a class="btn" href="#contact">Contact</a>
      </div>
    </div></div>
  `).join('');

  const feeCards = (fee.cards||[]).map(c=>`
    <div class="price">
      <div class="price-title">${esc(c.title)}</div>
      <div class="price-val">${esc(c.value)}</div>
      <div class="price-sub">${esc(c.sub)}</div>
    </div>
  `).join('');

  const faqItems = (faq.items||[]).map(i=>`
    <details class="faq-item"><summary>${esc(i.q)}</summary><div class="faq-body">${esc(i.a)}</div></details>
  `).join('');

  const topCountries = countries.slice(0,12).map(c=>`
    <a class="card" style="overflow:hidden" href="/${lang}/diaspora/${c.slug}">
      <div class="thumb"><img src="${c.image}" alt="${esc(c.name[lang]||c.name.ro)}"></div>
      <div class="pad"><h3 style="margin:0">${esc(c.name[lang]||c.name.ro)}</h3>
        <p class="muted" style="margin:8px 0 0">${esc(c.seo.description[lang]||c.seo.description.ro)}</p>
      </div>
    </a>
  `).join('');

  const gallery = (site.gallery?.items || []).map(src=>`<a href="${src}" data-lb="1"><img src="${src}" alt=""></a>`).join('');

  const body = `
  <section class="hero"><div class="container hero-inner">
    <div class="kicker"><span class="dot"></span><span>${esc(site.hero?.[lang]?.kicker||'Premium')}</span>
      <span class="pill">${esc(site.hero?.[lang]?.badge||'Gold')}</span></div>
    <h1 class="h1">${esc(t.heroTitle)}</h1><p class="sub">${esc(t.heroSub)}</p>
    <div class="cta"><a class="btn primary" href="#contact">Contact rapid</a><a class="btn" href="/${lang}/diaspora">Diaspora (30 țări)</a></div>
  </div></section>

  <section class="section" id="despre"><div class="container">
    <div class="card grid2">
      <div class="pad">
        <h2>Despre</h2>
        <p class="muted">${esc(t.aboutText)}</p>
        <ul class="list">
          <li>Consultanță (online / Chișinău)</li><li>Reprezentare în instanță</li><li>Dosare diaspora: acte + strategie</li>
        </ul>
      </div>
      <div class="media">
        <img src="/images/about.webp" alt="">
        <div class="media-overlay"><div class="media-title">Avocat Viorel Dodan</div><div class="media-sub">Chișinău • Moldova • Diaspora</div></div>
      </div>
    </div>
  </div></section>

  <section class="section" id="servicii"><div class="container">
    <div class="head"><h2>Servicii</h2><p class="muted">${esc(t.servicesSub)}</p></div>
    <div class="cardgrid">${servicesCards}</div>
  </div></section>

  <section class="section" id="onorarii"><div class="container">
    <div class="head"><h2>${esc(fee.title||'Onorarii')}</h2><p class="muted">${esc(fee.text||'')}</p></div>
    <div class="pricing">${feeCards}</div>
  </div></section>

  <section class="section" id="faq"><div class="container">
    <div class="head"><h2>${esc(faq.title||'FAQ')}</h2><p class="muted">${esc(faq.subtitle||'')}</p></div>
    <div class="faq">${faqItems}</div>
  </div></section>

  <section class="section" id="diaspora"><div class="container">
    <div class="head"><h2>Diaspora</h2><p class="muted">${esc(t.diasporaSub)}</p></div>
    <div class="cardgrid">${topCountries}</div>
    <div class="cta" style="margin-top:14px"><a class="btn primary" href="/${lang}/diaspora">Vezi toate țările</a></div>
  </div></section>

  <section class="section" id="galerie"><div class="container">
    <div class="head"><h2>Galerie</h2><p class="muted">Apasă pe poză — se deschide full.</p></div>
    <div class="gallery">${gallery}</div>
  </div></section>

  <section class="section" id="contact"><div class="container">
    <div class="card pad">
      <h2>Contact</h2>
      <div class="contact-grid">
        <div class="contact-item"><div class="contact-title">Telefon / WhatsApp</div><a class="contact-val" href="tel:${site.contact.phone}">${esc(site.contact.phone)}</a></div>
        <div class="contact-item"><div class="contact-title">Email</div><a class="contact-val" href="mailto:${site.contact.email}">${esc(site.contact.email)}</a></div>
        <div class="contact-item"><div class="contact-title">Website</div><a class="contact-val" href="${site.contact.website}">${esc(site.contact.website.replace('https://',''))}</a></div>
        <div class="contact-item"><div class="contact-title">Viber</div><a class="contact-val" href="${site.contact.viber}">Deschide Viber</a></div>
      </div>
    </div>
  </div></section>
  ${lightboxScript()}
  `;
  return layout(lang, t.heroTitle, t.heroSub, body);
}

function diasporaList(lang, site, countries){
  const t = (site.strings && (site.strings[lang]||site.strings.ro)) || DEFAULT_SITE.strings.ro;
  const cards = countries.map(c=>`
    <a class="card" style="overflow:hidden" href="/${lang}/diaspora/${c.slug}">
      <div class="thumb"><img src="${c.image}" alt="${esc(c.name[lang]||c.name.ro)}"></div>
      <div class="pad"><h3 style="margin:0">${esc(c.name[lang]||c.name.ro)}</h3>
        <p class="muted" style="margin:8px 0 0">${esc(c.seo.description[lang]||c.seo.description.ro)}</p>
      </div>
    </a>
  `).join('');
  const body = `
  <section class="hero"><div class="container hero-inner">
    <div class="kicker"><span class="dot"></span><span class="pill">Diaspora</span></div>
    <h1 class="h1">Diaspora — 30 țări</h1><p class="sub">${esc(t.diasporaSub)}</p>
    <div class="cta"><a class="btn ghost" href="/${lang}">← Înapoi</a></div>
  </div></section>
  <section class="section"><div class="container"><div class="cardgrid">${cards}</div></div></section>`;
  return layout(lang, `Diaspora — ${t.heroTitle}`, t.diasporaSub, body);
}

function countryPage(lang, site, c){
  const title = c.seo.title[lang] || c.seo.title.ro;
  const desc = c.seo.description[lang] || c.seo.description.ro;
  const nm = c.name[lang] || c.name.ro;
  const body = `
  <section class="hero"><div class="container hero-inner">
    <div class="kicker"><span class="dot"></span><span class="pill">${esc(nm)}</span></div>
    <h1 class="h1">${esc(nm)} — Ghid complet</h1><p class="sub">${esc(desc)}</p>
    <div class="cta"><a class="btn ghost" href="/${lang}/diaspora">← Toate țările</a></div>
  </div></section>
  <section class="section"><div class="container">
    <div class="card pad">
      <div class="media" style="min-height:260px;border-radius:18px;overflow:hidden;border:1px solid var(--line)"><img src="${c.image}" alt="${esc(nm)}"></div>
      <div class="hr"></div>
      ${(c.body && (c.body[lang] || c.body.ro)) || ''}
      <div class="hr"></div>
      <h2>Contact rapid</h2>
      <div class="contact-grid">
        <div class="contact-item"><div class="contact-title">Telefon / WhatsApp</div><a class="contact-val" href="tel:${site.contact.phone}">${esc(site.contact.phone)}</a></div>
        <div class="contact-item"><div class="contact-title">Email</div><a class="contact-val" href="mailto:${site.contact.email}">${esc(site.contact.email)}</a></div>
        <div class="contact-item"><div class="contact-title">Viber</div><a class="contact-val" href="${site.contact.viber}">Deschide Viber</a></div>
        <div class="contact-item"><div class="contact-title">Înapoi</div><a class="contact-val" href="/${lang}">Home</a></div>
      </div>
    </div>
  </div></section>`;
  return layout(lang, title, desc, body);
}

function articlesList(lang, site, articles){
  const cards = articles.map(a=>`
    <a class="card" href="/${lang}/articole/${a.slug}">
      <div class="pad"><h3>${esc(a.title[lang]||a.title.ro)}</h3><p class="muted">${esc(a.summary[lang]||a.summary.ro)}</p></div>
    </a>
  `).join('');
  const body = `
  <section class="hero"><div class="container hero-inner">
    <div class="kicker"><span class="dot"></span><span class="pill">Ghiduri</span></div>
    <h1 class="h1">Articole & ghiduri</h1><p class="sub">Materiale utile pentru diaspora și Moldova.</p>
    <div class="cta"><a class="btn ghost" href="/${lang}">← Înapoi</a></div>
  </div></section>
  <section class="section"><div class="container"><div class="cardgrid">${cards}</div></div></section>`;
  return layout(lang, 'Articole', 'Ghiduri juridice', body);
}

function articlePage(lang, site, a){
  const title = a.title[lang]||a.title.ro;
  const desc = a.summary[lang]||a.summary.ro;
  const body = `
  <section class="hero"><div class="container hero-inner">
    <div class="kicker"><span class="dot"></span><span class="pill">Ghid</span></div>
    <h1 class="h1">${esc(title)}</h1><p class="sub">${esc(desc)}</p>
    <div class="cta"><a class="btn ghost" href="/${lang}/articole">← Toate articolele</a></div>
  </div></section>
  <section class="section"><div class="container"><div class="card pad">
    ${(a.body && (a.body[lang]||a.body.ro))||''}
  </div></div></section>`;
  return layout(lang, title, desc, body);
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

 // ✅ Let static assets pass through (CSS/JS/Images/Admin)
if (
  path.startsWith('/assets/') ||
  path.startsWith('/images/') ||
  path === '/admin' ||           // ✅ ADAUGĂ ASTA
  path.startsWith('/admin/') ||  // ✅ rămâne
  path === '/favicon.ico' ||
  path === '/robots.txt' ||
  path === '/sitemap.xml' ||
  /\.(css|js|png|jpg|jpeg|webp|svg|ico|txt|map)$/i.test(path)
) {
  return context.next();
}

  // redirect / -> /ro
  if (path === '/') return Response.redirect(url.origin + '/ro', 302);

  const m = path.match(/^\/(ro|ru|en)(\/.*)?$/);
  if (!m) return new Response('Not found', {status:404});
  const lang = m[1];
  const rest = m[2] || '';

  const kv = env.CONTENT;
  let site=null, countries=null, articles=null;
  try{ site = await kv.get('site', {type:'json'});}catch{}
  try{ countries = await kv.get('countries', {type:'json'});}catch{}
  try{ articles = await kv.get('articles', {type:'json'});}catch{}
  site = site || DEFAULT_SITE;
  countries = Array.isArray(countries)&&countries.length ? countries : DEFAULT_COUNTRIES;
  articles = Array.isArray(articles)&&articles.length ? articles : DEFAULT_ARTICLES;

  // routes
  if (rest === '' || rest === '/') {
    return new Response(home(lang, site, countries), {headers:{'content-type':'text/html; charset=utf-8'}});
  }
  if (rest === '/diaspora' || rest === '/diaspora/') {
    return new Response(diasporaList(lang, site, countries), {headers:{'content-type':'text/html; charset=utf-8'}});
  }
  const cm = rest.match(/^\/diaspora\/([a-z0-9\-]+)\/?$/);
  if (cm) {
    const slug = cm[1];
    const c = countries.find(x=>x.slug===slug);
    if (!c) return new Response('Not found', {status:404});
    return new Response(countryPage(lang, site, c), {headers:{'content-type':'text/html; charset=utf-8'}});
  }
  if (rest === '/articole' || rest === '/articole/') {
    return new Response(articlesList(lang, site, articles), {headers:{'content-type':'text/html; charset=utf-8'}});
  }
  const am = rest.match(/^\/articole\/([a-z0-9\-]+)\/?$/);
  if (am) {
    const a = articles.find(x=>x.slug===am[1]);
    if (!a) return new Response('Not found', {status:404});
    return new Response(articlePage(lang, site, a), {headers:{'content-type':'text/html; charset=utf-8'}});
  }

  return new Response('Not found', {status:404});
}
const allowedLangs = ['ro', 'ru', 'en'];

if (segments.length > 0 && !allowedLangs.includes(segments[0])) {
  return new Response("Not found", { status: 404 });
}
