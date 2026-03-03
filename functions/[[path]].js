import { DEFAULT_SITE, DEFAULT_SERVICES, DEFAULT_PRICING, DEFAULT_FAQ, DEFAULT_COUNTRIES, DEFAULT_ARTICLES, nowYear } from "./defaults.js";
import { keyFor, kvGetJSON } from "./api/kv.js";

const allowedLangs = ["ro","ru","en"];

function esc(s=""){ return String(s).replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }

async function getContent(env, lang){
  const kv = env.CONTENT;
  const fallbackSite = DEFAULT_SITE[lang] || DEFAULT_SITE.ro;
  if(!kv){
    return { site:fallbackSite, services:DEFAULT_SERVICES, pricing:DEFAULT_PRICING, faq:DEFAULT_FAQ, countries:DEFAULT_COUNTRIES, articles:DEFAULT_ARTICLES };
  }
  const site = (await kvGetJSON(kv, keyFor("site", lang))) || fallbackSite;
  const services = (await kvGetJSON(kv, keyFor("services"))) || DEFAULT_SERVICES;
  const pricing = (await kvGetJSON(kv, keyFor("pricing"))) || DEFAULT_PRICING;
  const faq = (await kvGetJSON(kv, keyFor("faq"))) || DEFAULT_FAQ;
  const countries = (await kvGetJSON(kv, keyFor("countries"))) || DEFAULT_COUNTRIES;
  const articles = (await kvGetJSON(kv, keyFor("articles"))) || DEFAULT_ARTICLES;
  return { site, services, pricing, faq, countries, articles };
}

function navLabel(lang){
  if(lang==="ru") return {services:"Услуги", pricing:"Гонорары", faq:"FAQ", contact:"Контакты", diaspora:"Диаспора", articles:"Статьи"};
  if(lang==="en") return {services:"Services", pricing:"Fees", faq:"FAQ", contact:"Contact", diaspora:"Diaspora", articles:"Articles"};
  return {services:"Servicii", pricing:"Onorarii", faq:"FAQ", contact:"Contact", diaspora:"Diaspora", articles:"Articole"};
}

function schemaOrg(site){
  const c = site.contact || {};
  const s = site.strings || {};
  const year = nowYear();
  const obj = {
    "@context":"https://schema.org",
    "@type":"LegalService",
    "name":"Avocat Viorel Dodan",
    "description": s.heroSub || "Legal services",
    "areaServed":["MD","RO","EU"],
    "url": c.website || "https://avocat.vioreldodan.com",
    "email": c.email || "",
    "telephone": c.phone || "",
    "address": {
      "@type":"PostalAddress",
      "streetAddress": (c.address?.street || "str. Alexandru cel Bun nr 15/2"),
      "postalCode": (c.address?.postalCode || "MD-6801"),
      "addressLocality": (c.address?.city || "Ialoveni"),
      "addressCountry": (c.address?.country || "Republica Moldova")
    },
    "foundingDate": String(year)
  };
  return `<script type=\"application/ld+json\">${JSON.stringify(obj)}</script>`;
}

function layout({lang, title, description, site, bodyHtml, extraHead=""}) {
  const nav = navLabel(lang);
  const s = site.strings || {};
  const c = site.contact || {};
  const phone = c.phone || "";
  const email = c.email || "";
  const langUpper = lang.toUpperCase();

  const ogTitle = esc(title);
  const ogDesc = esc(description || "");

  return `<!doctype html>
<html lang="${esc(lang)}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${ogTitle}</title>
  <meta name="description" content="${ogDesc}"/>
  <meta name="theme-color" content="#05070c"/>
  <meta property="og:title" content="${ogTitle}"/>
  <meta property="og:description" content="${ogDesc}"/>
  <meta property="og:type" content="website"/>
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml"/>
  <link rel="manifest" href="/manifest.webmanifest"/>
  <link rel="stylesheet" href="/assets/css/styles.css"/>
  ${schemaOrg(site)}
  ${extraHead}
</head>
<body>
  <a class="skip" href="#main">Sari la conținut</a>
  <div id="progress" class="progress"></div>
  <div id="toast" class="toast"></div>

  <div class="topbar">
    <div class="container">
      <div class="nav">
        <a class="brand" href="/${lang}/">
          <div class="logo" aria-hidden="true"></div>
          <div class="title">
            <b>Avocat Viorel Dodan</b>
            <span>${esc(s.cityLine || "Ialoveni • Moldova")} • ${esc(langUpper)}</span>
          </div>
        </a>
        <div class="navlinks">
          <a href="/${lang}/servicii/">${esc(nav.services)}</a>
          <a href="/${lang}/onorarii/">${esc(nav.pricing)}</a>
          <a href="/${lang}/diaspora/">${esc(nav.diaspora)}</a>
          <a href="/${lang}/articole/">${esc(nav.articles)}</a>
          <a href="/${lang}/faq/">${esc(nav.faq)}</a>
          <a href="/${lang}/contact/">${esc(nav.contact)}</a>
        </div>
        <div class="lang">
          <button class="menuBtn" id="menuBtn" aria-label="Menu" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span class="pill"><strong>${esc(langUpper)}</strong></span>
          <a class="pill" href="/ro/">RO</a>
          <a class="pill" href="/ru/">RU</a>
          <a class="pill" href="/en/">EN</a>
          <a class="btn" href="/${lang}/contact/">${esc(lang==="en"?"Consult":"Consultă-mă")}</a>
        </div>
      </div>
    </div>
  </div>


<div class="mobileMenu" id="mobileMenu" aria-hidden="true">
  <div class="panel" role="dialog" aria-label="Mobile menu">
    <a href="/${lang}/servicii/">${esc(nav.services)} <span>→</span></a>
    <a href="/${lang}/onorarii/">${esc(nav.pricing)} <span>→</span></a>
    <a href="/${lang}/diaspora/">${esc(nav.diaspora)} <span>→</span></a>
    <a href="/${lang}/articole/">${esc(nav.articles)} <span>→</span></a>
    <a href="/${lang}/faq/">${esc(nav.faq)} <span>→</span></a>
    <a href="/${lang}/contact/">${esc(nav.contact)} <span>→</span></a>
    <div class="row">
      <a class="pill" href="/ro/">RO</a>
      <a class="pill" href="/ru/">RU</a>
      <a class="pill" href="/en/">EN</a>
    </div>
  </div>
</div>

  <main id="main" class="safeBottom">
  ${bodyHtml}
  </main>


<nav class="bottomNav" id="bottomNav" aria-label="Navigare rapidă">
  <div class="bar">
    <a href="/${lang}/" aria-label="Home">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>
      <b>Home</b>
    </a>
    <a href="/${lang}/servicii/" aria-label="Servicii">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10M7 12h10M7 17h10"/></svg>
      <b>${esc(nav.services)}</b>
    </a>
    <a href="#" class="cta" id="consultBtn" aria-label="Consultă-mă">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"/><path d="M12 10a2 2 0 1 0 0.001 0z"/></svg>
      <b>${esc(nav.diaspora)}</b>
    </a>
    <a href="/${lang}/articole/" aria-label="Articole">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19a2 2 0 0 0 2 2h12"/><path d="M6 17V5a2 2 0 0 1 2-2h10v14a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2z"/></svg>
      <b>${esc(nav.articles)}</b>
    </a>
    <a href="/${lang}/contact/" aria-label="Contact">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
      <b>${esc(nav.contact)}</b>
    </a>
  </div>
</nav>


<div class="modal" id="consultModal" aria-hidden="true">
  <div class="sheet" role="dialog" aria-label="Consultă-mă rapid">
    <div class="head">
      <div>
        <div class="title">Consultă-mă rapid</div>
        <div class="sub" style="margin-top:2px">Alege canalul. (Ctrl+K deschide acest panou)</div>
      </div>
      <button class="x" id="consultClose" aria-label="Închide" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
      </button>
    </div>
    <div class="grid">
      <a href="tel:+37369968269">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 10.8 19.8 19.8 0 0 1 .08 2.18 2 2 0 0 1 2.06 0h3a2 2 0 0 1 2 1.72c.12.86.33 1.7.62 2.5a2 2 0 0 1-.45 2.11L6.1 7.9a16 16 0 0 0 10 10l1.57-1.13a2 2 0 0 1 2.11-.45c.8.29 1.64.5 2.5.62A2 2 0 0 1 22 16.92z"/></svg>
        <div><b>Telefon</b><span>Apel direct</span></div>
      </a>
      <a href="mailto:viorel.dodan@justice.md?subject=Consultatie%20juridica">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>
        <div><b>Email</b><span>Trimite mesaj</span></div>
      </a>
      <a href="https://wa.me/37369968269" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 0 1-12.8 7.4L3 20l1.2-4.9A8.5 8.5 0 1 1 21 11.5z"/></svg>
        <div><b>WhatsApp</b><span>Chat rapid</span></div>
      </a>
      <a href="viber://chat?number=%2B37369968269">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H7l-4 3 1.2-4.9A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 10.5c1 2 3 4 5 5"/></svg>
        <div><b>Viber</b><span>Deschide chat</span></div>
      </a>
    </div>
    <div class="notice" style="margin:0 14px 14px">
      Tip: ține apăsat pe butonul <b>Consultă-mă</b> ca să activezi <b>one-hand mode</b>.
    </div>
  </div>
</div>

<div class="toast" id="toast" aria-live="polite" aria-atomic="true">
  <div class="t">
    <div>
      <b id="toastTitle">OK</b>
      <small id="toastMsg"></small>
    </div>
    <button id="toastClose" aria-label="Închide" type="button">✕</button>
  </div>
</div>

  <div class="footer">
    <div class="container">
      <div class="footerGrid">
        <div>
          <div class="brand">
            <div class="logo" aria-hidden="true"></div>
            <div class="title">
              <b>${esc(s.brandLine || "Avocat Viorel Dodan")}</b>
              <span>LegalTech 2050 • Confidențialitate • Strategie</span>
            </div>
          </div>
          <div class="kv">
            <span class="pill">Cloudflare Pages</span>
            <span class="pill">KV CONTENT</span>
            <span class="pill">PWA</span>
            <span class="pill">RO/RU/EN</span>
            <span class="pill">No external scripts</span>
          </div>
          <div class="hr"></div>
          <div class="notice">Email: ${esc(email)} • Tel: ${esc(phone)}</div>
          <div class="notice" style="margin-top:8px">${esc(s.footer || ("© "+nowYear()+" Avocat Viorel Dodan."))}</div>
        </div>
        <div>
          <div class="card pad">
            <span class="kicker">${esc(lang==="en"?"Quick actions":"Acțiuni rapide")}</span>
            <p class="lead" style="margin-top:10px">${esc(lang==="en"?"Start with the case scan and get a clean plan.":"Începe cu scanarea cazului și primești un plan curat.")}</p>
            <div class="hr"></div>
            <div class="heroActions">
              <a class="btn secondary" href="/${lang}/#scan">${esc(lang==="en"?"Case scan":"Scanare caz")}</a>
              <a class="btn secondary" id="installBtn" style="display:none">${esc(lang==="en"?"Install app":"Instalează aplicația")}</a>
              <a class="btn ghost" href="/admin/" rel="nofollow">Admin</a>
            </div>
            <p class="notice" style="margin-top:10px">${esc(lang==="en"?"Admin is password-protected (ENV secret).":"Admin este protejat cu parolă (ENV secret).")}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="/assets/js/site.js"></script>
</body>
</html>`;
}

function homePage({lang, site, services, pricing, faq, countries}){
  const s = site.strings || {};
  const c = site.contact || {};
  const phone = (c.phone||"").replace(/\D/g,"");
  const hero = `
  <div class="hero">
    <div class="container">
      <div class="heroGrid">
        <div class="card pad">
          <span class="kicker">${esc(s.heroKicker||"")}</span>
          <h1>${esc(s.heroTitle||"")}</h1>
          <p class="lead">${esc(s.heroSub||"")}</p>
          <div class="heroActions">
            <a class="btn" href="#scan">${esc(s.ctaPrimary||"")}</a>
            <a class="btn secondary" href="https://wa.me/${esc(phone)}" rel="noreferrer">${esc(s.ctaSecondary||"WhatsApp")}</a>
            <span class="badge">PWA</span>
            <span class="badge">Wizard</span>
            <span class="badge">Search</span>
          </div>
        </div>
        <div class="grid2" style="grid-template-columns:1fr; gap:12px">
          <div class="stat"><b>${esc(lang==="en"?"Strategy":"Strategie")}</b><span>${esc(lang==="en"?"Clear plan, evidence, steps.":"Plan clar, probe, pași.")}</span></div>
          <div class="stat"><b>${esc(lang==="en"?"Speed":"Viteză")}</b><span>${esc(lang==="en"?"Fast decisions, clean execution.":"Decizii rapide, execuție curată.")}</span></div>
          <div class="stat"><b>${esc(lang==="en"?"Safety":"Siguranță")}</b><span>${esc(lang==="en"?"No external scripts, hardened headers.":"Fără scripturi externe, headers securizate.")}</span></div>
        </div>
      </div>
    </div>
  </div>`;

  const scan = `
  <div class="section" id="scan">
    <div class="container">
      <div class="card pad">
        <span class="kicker">${esc(lang==="en"?"Case scan":"Scanare caz")}</span>
        <h2 style="margin-top:10px">${esc(lang==="en"?"Get a plan in 60 seconds":"Primești un plan în 60 secunde")}</h2>
        <p class="sub">${esc(lang==="en"?"Answer a few questions. The site generates a clean recommendation and checklist.":"Răspunzi la câteva întrebări. Site-ul generează recomandări și checklist.")}</p>

        <div id="wizard">
          <div class="notice">Progress: <b id="wizardPct">0%</b></div>
          <div class="hr"></div>

          <div data-step="1">
            <div class="grid2">
              <div>
                <label>${esc(lang==="en"?"Country":"Țara")}</label>
                <select data-set="country">
                  <option value="">—</option>
                  ${countries.slice(0,12).map(ct=>`<option value="${esc(ct.slug)}">${esc(ct.name?.[lang]||ct.name?.ro||ct.slug)}</option>`).join("")}
                </select>
              </div>
              <div>
                <label>${esc(lang==="en"?"Urgency":"Urgență")}</label>
                <select data-set="urgency">
                  <option value="normal">${esc(lang==="en"?"Normal":"Normal")}</option>
                  <option value="urgent">${esc(lang==="en"?"Urgent":"Urgent")}</option>
                </select>
              </div>
            </div>
            <div class="heroActions" style="margin-top:14px">
              <button class="btn" data-next>Next</button>
            </div>
          </div>

          <div data-step="2" style="display:none">
            <label>${esc(lang==="en"?"Topic":"Tema")}</label>
            <select data-set="topic">
              <option value="">—</option>
              <option value="divorce">${esc(lang==="en"?"Divorce & children":"Divorț & copii")}</option>
              <option value="support">${esc(lang==="en"?"Child support":"Pensie alimentară")}</option>
              <option value="inheritance">${esc(lang==="en"?"Inheritance":"Succesiune")}</option>
              <option value="civil">${esc(lang==="en"?"Civil dispute":"Litigiu civil")}</option>
            </select>
            <div class="heroActions" style="margin-top:14px">
              <button class="btn secondary" data-prev>Back</button>
              <button class="btn" data-next>Next</button>
            </div>
          </div>

          <div data-step="3" style="display:none">
            <div class="grid2">
              <div>
                <label>${esc(lang==="en"?"Children involved?":"Sunt copii implicați?")}</label>
                <select data-set="children">
                  <option value="no">${esc(lang==="en"?"No":"Nu")}</option>
                  <option value="yes">${esc(lang==="en"?"Yes":"Da")}</option>
                </select>
              </div>
              <div>
                <label>${esc(lang==="en"?"Shared assets?":"Sunt bunuri comune?")}</label>
                <select data-set="assets">
                  <option value="no">${esc(lang==="en"?"No":"Nu")}</option>
                  <option value="yes">${esc(lang==="en"?"Yes":"Da")}</option>
                </select>
              </div>
            </div>

            <div class="heroActions" style="margin-top:14px">
              <button class="btn secondary" data-prev>Back</button>
              <button class="btn" id="wizardGen">Generate</button>
            </div>

            <label style="margin-top:14px">${esc(lang==="en"?"Recommendation":"Recomandare")}</label>
            <textarea id="wizardOut" readonly placeholder="—"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  const svc = `
  <div class="section">
    <div class="container">
      <h2>${esc(s.servicesTitle||"")}</h2>
      <p class="sub">${esc(s.servicesSub||"")}</p>
      <div class="grid3">
        ${services.map(x=>{
          const t = x.title?.[lang]||x.title?.ro||"";
          const d = x.desc?.[lang]||x.desc?.ro||"";
          return `<div class="feature">
            <div class="tag">${esc(x.icon)} • ${esc(t)}</div>
            <h3>${esc(t)}</h3>
            <p class="sub">${esc(d)}</p>
            <div class="hr"></div>
            <div class="notice">${esc((x.steps?.[lang]||x.steps?.ro||[]).join(" → "))}</div>
            <div class="heroActions" style="margin-top:12px">
              <a class="btn secondary" href="/${lang}/servicii/">${esc(lang==="en"?"Details":"Detalii")}</a>
            </div>
          </div>`;
        }).join("")}
      </div>
    </div>
  </div>`;

  const prices = `
  <div class="section">
    <div class="container">
      <h2>${esc(s.pricingTitle||"")}</h2>
      <p class="sub">${esc(s.pricingSub||"")}</p>
      <div class="grid3">
        ${pricing.map(p=>{
          const t = p.title?.[lang]||p.title?.ro||"";
          const items = p.items?.[lang]||p.items?.ro||[];
          return `<div class="price">
            <span class="badge">${esc(p.tier)}</span>
            <h3 style="margin-top:10px">${esc(t)}</h3>
            <div class="amt">${esc(p.price)}</div>
            <ul class="sub">${items.map(i=>`<li>${esc(i)}</li>`).join("")}</ul>
          </div>`;
        }).join("")}
      </div>
    </div>
  </div>`;

  const calc = `
  <div class="section">
    <div class="container">
      <div class="card pad">
        <span class="kicker">${esc(lang==="en"?"Calculator":"Calculator")}</span>
        <h2 style="margin-top:10px">${esc(lang==="en"?"Child support estimator":"Estimare pensie alimentară")}</h2>
        <p class="sub">${esc(lang==="en"?"A rough estimator for orientation only.":"Calculator orientativ, nu înlocuiește instanța.")}</p>
        <div class="grid2">
          <div>
            <label>${esc(lang==="en"?"Monthly income":"Venit lunar")}</label>
            <input id="income" placeholder="ex: 1200" inputmode="decimal"/>
          </div>
          <div>
            <label>${esc(lang==="en"?"Number of children":"Număr copii")}</label>
            <select id="kids">
              <option value="1">1</option><option value="2">2</option><option value="3">3+</option>
            </select>
          </div>
        </div>
        <div class="heroActions" style="margin-top:12px">
          <button class="btn" id="calcBtn">${esc(lang==="en"?"Calculate":"Calculează")}</button>
        </div>
        <label style="margin-top:12px">${esc(lang==="en"?"Result":"Rezultat")}</label>
        <textarea id="calcOut" readonly></textarea>
      </div>
    </div>
  </div>`;

  const faqs = `
  <div class="section">
    <div class="container">
      <h2>${esc(s.faqTitle||"")}</h2>
      <p class="sub">${esc(s.faqSub||"")}</p>
      <div class="grid2">
        <div class="feature">
          ${faq.map(x=>`<details>
            <summary><b>${esc(x.q?.[lang]||x.q?.ro||"")}</b></summary>
            <p>${esc(x.a?.[lang]||x.a?.ro||"")}</p>
          </details>`).join("")}
        </div>
        <div class="feature">
          <div class="tag">${esc(lang==="en"?"Diaspora preview":"Preview diaspora")}</div>
          <h3>${esc(lang==="en"?"Country-specific guides":"Ghiduri pe țări")}</h3>
          <p class="sub">${esc(lang==="en"?"Click a country and get steps.":"Alegi o țară și primești pași.")}</p>
          <div class="hr"></div>
          <div class="list">
            ${(countries.slice(0,6)).map(ct=>`<div class="li"><span class="dot"></span><div><b>${esc(ct.name?.[lang]||ct.name?.ro||ct.slug)}</b><span>${esc((ct.bullets?.[lang]||ct.bullets?.ro||[]).join(" • "))}</span></div></div>`).join("")}
          </div>
          <div class="heroActions" style="margin-top:12px">
            <a class="btn secondary" href="/${lang}/diaspora/">${esc(lang==="en"?"Open diaspora":"Deschide diaspora")}</a>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  const contact = `
  <div class="section">
    <div class="container">
      <div class="card pad">
        <span class="kicker">${esc(s.contactTitle||"")}</span>
        <h2 style="margin-top:10px">${esc(lang==="en"?"Write now":"Scrie acum")}</h2>
        <p class="sub">${esc(s.contactSub||"")}</p>
        <div class="heroActions">
          <a class="btn" href="/${lang}/contact/">${esc(lang==="en"?"Open contact page":"Deschide pagina Contact")}</a>
          <button class="btn secondary" data-copy="${esc(site.contact?.email||"")}">${esc(lang==="en"?"Copy email":"Copiază email")}</button>
          <button class="btn secondary" data-copy="${esc(site.contact?.phone||"")}">${esc(lang==="en"?"Copy phone":"Copiază telefon")}</button>
        </div>
      </div>
    </div>
  </div>`;

  const body = hero + scan + svc + prices + calc + faqs + contact;
  return layout({lang, title: s.brandLine || "Avocat Viorel Dodan", description: s.heroSub || "", site, bodyHtml: body, extraHead:`<meta name="robots" content="index,follow"/>`});
}

function simplePage({lang, site, title, kicker, body}){
  return layout({lang, title, description: title, site, bodyHtml: `
  <div class="section">
    <div class="container">
      <div class="card pad">
        <span class="kicker">${esc(kicker||"")}</span>
        <h1 style="margin:12px 0 6px">${esc(title)}</h1>
        ${body}
      </div>
    </div>
  </div>`});
}

function servicesPage({lang, site, services}){
  const nav = navLabel(lang);
  const body = `
    <p class="sub">${esc(site.strings?.servicesSub||"")}</p>
    <div class="grid3">
      ${services.map(x=>{
        const t = x.title?.[lang]||x.title?.ro||"";
        const d = x.desc?.[lang]||x.desc?.ro||"";
        const steps = x.steps?.[lang]||x.steps?.ro||[];
        return `<div class="feature">
          <div class="tag">${esc(x.icon)} • ${esc(t)}</div>
          <h3>${esc(t)}</h3>
          <p class="sub">${esc(d)}</p>
          <div class="hr"></div>
          <ul class="sub">${steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ul>
        </div>`;
      }).join("")}
    </div>
    <div class="hr"></div>
    <div class="heroActions">
      <a class="btn" href="/${lang}/#scan">${esc(lang==="en"?"Start case scan":"Începe scanarea cazului")}</a>
      <a class="btn secondary" href="/${lang}/contact/">${esc(nav.contact)}</a>
    </div>`;
  return simplePage({lang, site, title: nav.services, kicker:"Services 2050", body});
}

function pricingPage({lang, site, pricing}){
  const nav = navLabel(lang);
  const body = `
    <p class="sub">${esc(site.strings?.pricingSub||"")}</p>
    <div class="grid3">
      ${pricing.map(p=>{
        const t = p.title?.[lang]||p.title?.ro||"";
        const items = p.items?.[lang]||p.items?.ro||[];
        return `<div class="price">
          <span class="badge">${esc(p.tier)}</span>
          <h3 style="margin-top:10px">${esc(t)}</h3>
          <div class="amt">${esc(p.price)}</div>
          <ul class="sub">${items.map(i=>`<li>${esc(i)}</li>`).join("")}</ul>
        </div>`;
      }).join("")}
    </div>
    <div class="hr"></div>
    <p class="notice">${esc(lang==="en"?"Prices are indicative; final quote depends on complexity.":"Preț orientativ; oferta finală depinde de complexitate.")}</p>
    <div class="heroActions">
      <a class="btn" href="/${lang}/contact/">${esc(nav.contact)}</a>
      <a class="btn secondary" href="/${lang}/#scan">${esc(lang==="en"?"Case scan":"Scanare caz")}</a>
    </div>`;
  return simplePage({lang, site, title: nav.pricing, kicker:"Transparent fees", body});
}

function faqPage({lang, site, faq}){
  const nav = navLabel(lang);
  const body = `
    <p class="sub">${esc(site.strings?.faqSub||"")}</p>
    <div class="feature">
      ${faq.map(x=>`<details>
        <summary><b>${esc(x.q?.[lang]||x.q?.ro||"")}</b></summary>
        <p>${esc(x.a?.[lang]||x.a?.ro||"")}</p>
      </details>`).join("")}
    </div>
    <div class="hr"></div>
    <div class="heroActions">
      <a class="btn" href="/${lang}/contact/">${esc(nav.contact)}</a>
      <a class="btn secondary" href="/${lang}/articole/">${esc(nav.articles)}</a>
    </div>`;
  return simplePage({lang, site, title: nav.faq, kicker:"FAQ", body});
}

function contactPage({lang, site}){
  const nav = navLabel(lang);
  const c = site.contact || {};
  const phone = c.phone || "";
  const email = c.email || "";
  const website = c.website || "";
  const viber = c.viber || "";
  const body = `
    <p class="sub">${esc(site.strings?.contactSub||"")}</p>
    <div class="grid2">
      <div class="feature">
        <div class="tag">${esc(lang==="en"?"Direct":"Direct")}</div>
        <div class="list">
          <div class="li"><span class="dot"></span><div><b>${esc(lang==="en"?"Phone":"Telefon")}</b><span>${esc(phone)}</span></div></div>
          <div class="li copy" role="button" tabindex="0" data-copy="${esc(email)}"><span class="dot"></span><div><b>Email</b><span>${esc(email)} • atinge pentru copiere</span></div></div>
          <div class="li"><span class="dot"></span><div><b>Website</b><span>${esc(website)}</span></div></div>
          <div class="li"><span class="dot"></span><div><b>WhatsApp/Viber</b><span>${esc(viber)}</span></div></div>
          <div class="li"><span class="dot"></span><div><b>Adresă</b><span>${esc((c.address?.country||"Republica Moldova") + ", " + (c.address?.city||"Ialoveni") + ", " + (c.address?.street||"str. Alexandru cel Bun nr 15/2") + ", " + (c.address?.postalCode||"MD-6801"))}</span></div></div>
        </div>
        <div class="heroActions" style="margin-top:12px">
          <a class="btn" href="mailto:${esc(email)}">Email</a>
          <a class="btn secondary" href="tel:${esc(phone.replace(/\s/g,''))}">${esc(lang==="en"?"Call":"Sună")}</a>
          <button class="btn secondary" data-copy="${esc(email)}">${esc(lang==="en"?"Copy":"Copiază")}</button>
        </div>
      </div>
      <div class="feature">
        <div class="tag">${esc(lang==="en"?"Quick message template":"Șablon mesaj")}</div>
        <label>${esc(lang==="en"?"Copy this template":"Copiază șablonul")}</label>
        <textarea readonly id="tmpl">Țara: ...
Tema: ...
Urgent: da/nu
Descriere (3 rânduri): ...
Acte (PDF): ...</textarea>
        <div class="heroActions" style="margin-top:12px">
          <button class="btn" data-copy="Țara: ...
Tema: ...
Urgent: da/nu
Descriere (3 rânduri): ...
Acte (PDF): ...">${esc(lang==="en"?"Copy template":"Copiază șablon")}</button>
          <a class="btn secondary" href="/${lang}/#scan">${esc(lang==="en"?"Case scan":"Scanare caz")}</a>
        </div>
        <p class="notice" style="margin-top:10px">${esc(lang==="en"?"For privacy, avoid sending sensitive data via public Wi‑Fi.":"Pentru confidențialitate, evită date sensibile pe Wi‑Fi public.")}</p>
      </div>
    </div>`;
  return simplePage({lang, site, title: nav.contact, kicker:"Contact 2050", body});
}

function diasporaPage({lang, site, countries}){
  const nav = navLabel(lang);
  const body = `
    <p class="sub">${esc(site.strings?.diasporaSub||"")}</p>
    <div class="grid3">
      ${countries.map(ct=>{
        const nm = ct.name?.[lang]||ct.name?.ro||ct.slug;
        const bullets = ct.bullets?.[lang]||ct.bullets?.ro||[];
        return `<div class="feature">
          <div class="tag">${esc(nm)}</div>
          <img src="${esc(ct.image)}" alt="${esc(nm)}" loading="lazy" decoding="async" style="border-radius:18px; border:1px solid rgba(255,255,255,.10); margin:10px 0"/>
          <p class="sub">${bullets.map(b=>"• "+esc(b)).join("<br/>")}</p>
          <div class="heroActions" style="margin-top:12px">
            <a class="btn secondary" href="/${lang}/contact/">${esc(lang==="en"?"Ask about this country":"Întreabă despre țara asta")}</a>
          </div>
        </div>`;
      }).join("")}
    </div>`;
  return simplePage({lang, site, title: nav.diaspora, kicker:"Diaspora map", body});
}

function articlesIndex({lang, site}){
  const nav = navLabel(lang);
  const body = `
    <p class="sub">${esc(site.strings?.articlesSub||"")}</p>
    <label>${esc(lang==="en"?"Search":"Caută")}</label>
    <input id="searchBox" placeholder="${esc(lang==="en"?"Type keywords…":"Scrie cuvinte…")}"/>
    <div class="hr"></div>
    <div id="searchOut" class="grid3"></div>
    <script src="/assets/js/search.js"></script>`;
  return simplePage({lang, site, title: nav.articles, kicker:"Knowledge base", body});
}

function articlePage({lang, site, article}){
  const tt = article.title?.[lang]||article.title?.ro||"Articol";
  const desc = article.excerpt?.[lang]||article.excerpt?.ro||"";
  const raw = article.content?.[lang]||article.content?.ro||"";
  const html = esc(raw)
    .replace(/^###\s(.+)$/gm, "<h3>$1</h3>")
    .replace(/^\-\s(.+)$/gm, "<li>$1</li>")
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br/>");
  return layout({lang, title: tt, description: desc, site, bodyHtml: `
    <div class="section">
      <div class="container">
        <div class="card pad">
          <span class="kicker">${esc(article.date||"")} • ${esc((article.readMins||5)+" min")}</span>
          <h1 style="margin:12px 0 6px">${esc(tt)}</h1>
          <p class="lead">${esc(desc)}</p>
          <div class="heroActions">
            <a class="btn secondary" href="/${lang}/articole/">${esc(lang==="en"?"Back":"Înapoi")}</a>
            <a class="btn" href="/${lang}/contact/">${esc(lang==="en"?"Consult":"Consultă-mă")}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="card pad">
          <p>${html}</p>
        </div>
      </div>
    </div>`});
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // ✅ Allow static/system/API/admin
  if (
    path.startsWith("/assets/") ||
    path.startsWith("/images/") ||
    path === "/admin" || path.startsWith("/admin/") ||
    path === "/api" || path.startsWith("/api/") ||
    path === "/favicon.ico" ||
    path === "/robots.txt" ||
    path === "/sitemap.xml" ||
    path === "/manifest.webmanifest" ||
    path === "/service-worker.js" ||
    /\.(css|js|png|jpg|jpeg|webp|svg|ico|txt|map|webmanifest)$/i.test(path)
  ) {
    return context.next();
  }

  if (path === "/") {
    return Response.redirect(url.origin + "/ro/", 302);
  }

  const segments = path.split("/").filter(Boolean);
  const lang = (segments[0] || "ro").toLowerCase();
  if (!allowedLangs.includes(lang)) return new Response("Not found", { status: 404 });
  const rest = segments.slice(1);

  const { site, services, pricing, faq, countries, articles } = await getContent(context.env, lang);

  // Home
  if (rest.length === 0) {
    const html = homePage({lang, site, services, pricing, faq, countries});
    return new Response(html, { headers: { "content-type":"text/html; charset=utf-8" } });
  }

  // Pages
  if (rest[0] === "servicii") {
    const html = servicesPage({lang, site, services});
    return new Response(html, { headers: { "content-type":"text/html; charset=utf-8" } });
  }
  if (rest[0] === "onorarii") {
    const html = pricingPage({lang, site, pricing});
    return new Response(html, { headers: { "content-type":"text/html; charset=utf-8" } });
  }
  if (rest[0] === "faq") {
    const html = faqPage({lang, site, faq});
    return new Response(html, { headers: { "content-type":"text/html; charset=utf-8" } });
  }
  if (rest[0] === "contact") {
    const html = contactPage({lang, site});
    return new Response(html, { headers: { "content-type":"text/html; charset=utf-8" } });
  }
  if (rest[0] === "diaspora") {
    const html = diasporaPage({lang, site, countries});
    return new Response(html, { headers: { "content-type":"text/html; charset=utf-8" } });
  }
  if (rest[0] === "articole") {
    if (rest.length === 1) {
      const html = articlesIndex({lang, site});
      return new Response(html, { headers: { "content-type":"text/html; charset=utf-8" } });
    }
    const slug = rest[1];
    const art = articles.find(a=>a.slug === slug);
    if(!art) return new Response("Not found", { status: 404 });
    const html = articlePage({lang, site, article: art});
    return new Response(html, { headers: { "content-type":"text/html; charset=utf-8" } });
  }

  return new Response("Not found", { status: 404 });
}
