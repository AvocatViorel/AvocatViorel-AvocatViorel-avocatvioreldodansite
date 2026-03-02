const SITE_JSON = "/content/site.json";

const $ = (id) => document.getElementById(id);

let DATA = null;
let LANG = "ro";

/* ================= LANG ================= */

function getLangText(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[LANG] || val.ro || "";
}

function setLang(lang) {
  LANG = lang;
  localStorage.setItem("lang", lang);
  renderAll();
}

window.setLang = setLang;

/* ================= LOAD ================= */

async function loadData() {
  const r = await fetch(`${SITE_JSON}?v=${Date.now()}`, {
    cache: "no-store"
  });
  DATA = await r.json();
  renderAll();
}

/* ================= HELPERS ================= */

function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function pageBySlug(slug) {
  const map = {
    italia: "/diaspora-italia.html",
    germania: "/diaspora-germania.html",
    franta: "/diaspora-franta.html",
    uk: "/diaspora-uk.html",
    usa: "/diaspora-usa.html",
    moldova: "/diaspora-moldova.html",
  };
  return map[(slug || "").toLowerCase()] || "#";
}

/* ================= RENDER ================= */

function renderHero() {
  const h = DATA.hero?.[LANG] || DATA.hero?.ro || {};

  $("heroKicker").textContent = h.kicker || "";
  $("heroBadge").textContent = h.badge || "";
  $("heroTitle").textContent = h.title || "";
  $("heroSub").textContent = h.subtitle || "";
}

function renderAbout() {
  $("aboutTitle").textContent = getLangText(DATA.about?.title);

  $("aboutText").textContent = getLangText(DATA.about?.text);

  const list = $("aboutBullets");
  clear(list);

  const bullets = DATA.about?.bullets?.[LANG] || [];
  bullets.forEach(b => {
    const li = document.createElement("li");
    li.textContent = b;
    list.appendChild(li);
  });
}

function renderServices() {
  $("servicesTitle").textContent = getLangText(DATA.services?.title);
  $("servicesSub").textContent = getLangText(DATA.services?.subtitle);

  const grid = $("servicesGrid");
  clear(grid);

  (DATA.services?.items || []).forEach(it => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="thumb">
        <img src="${it.image || ""}" alt="">
      </div>
      <div class="pad">
        <h3>${getLangText(it.title)}</h3>
        <p class="muted">${getLangText(it.text)}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

function renderDiaspora() {
  $("diasporaTitle").textContent = getLangText(DATA.diaspora?.title);
  $("diasporaSub").textContent = getLangText(DATA.diaspora?.subtitle);

  const grid = $("diasporaGrid");
  clear(grid);

  (DATA.diaspora?.items || []).forEach(it => {

    const a = document.createElement("a");
    a.className = "card";
    a.href = pageBySlug(it.slug);

    const img =
      it.image ||
      DATA.diaspora?.fallbackImage ||
      "/images/diaspora-default.webp";

    a.innerHTML = `
      <div class="thumb">
        <img src="${img}" alt="">
      </div>
      <div class="pad">
        <h3>${getLangText(it.name)}</h3>
        <p class="muted">${getLangText(it.desc)}</p>
      </div>
    `;

    grid.appendChild(a);
  });
}

function renderGallery() {
  $("galleryTitle").textContent = getLangText(DATA.gallery?.title);
  $("gallerySub").textContent = getLangText(DATA.gallery?.subtitle);

  const grid = $("galleryGrid");
  clear(grid);

  (DATA.gallery?.items || []).forEach(src => {
    const a = document.createElement("a");
    a.href = src;
    a.innerHTML = `<img src="${src}" alt="">`;
    grid.appendChild(a);
  });
}

function renderContact() {
  $("phoneLink").textContent = DATA.contact?.phone || "";
  $("phoneLink").href = `tel:${DATA.contact?.phone || ""}`;

  $("emailLink").textContent = DATA.contact?.email || "";
  $("emailLink").href = `mailto:${DATA.contact?.email || ""}`;

  $("webLink").textContent = DATA.contact?.website || "";
  $("webLink").href = DATA.contact?.website || "#";
}

function renderAll() {
  if (!DATA) return;

  renderHero();
  renderAbout();
  renderServices();
  renderDiaspora();
  renderGallery();
  renderContact();
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {

  LANG = localStorage.getItem("lang") || "ro";

  loadData();

});
