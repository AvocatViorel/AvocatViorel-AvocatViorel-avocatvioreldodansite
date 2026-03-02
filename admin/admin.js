const SITE_JSON = "/content/site.json";
const $ = id => document.getElementById(id);

let DATA = null;

async function load() {
  const r = await fetch(SITE_JSON + "?v=" + Date.now());
  DATA = await r.json();

  // CONTACT
  $("phone").value = DATA.contact?.phone || "";
  $("email").value = DATA.contact?.email || "";
  $("website").value = DATA.contact?.website || "";

  // HERO (RO default)
  $("heroKicker").value = DATA.hero?.ro?.kicker || "";
  $("heroBadge").value = DATA.hero?.ro?.badge || "";
  $("heroTitle").value = DATA.hero?.ro?.title || "";
  $("heroSub").value = DATA.hero?.ro?.subtitle || "";

  // ABOUT
  $("aboutTitle").value = DATA.about?.title?.ro || "";
  $("aboutText").value = DATA.about?.text?.ro || "";
  $("aboutBullets").value = (DATA.about?.bullets?.ro || []).join("\n");
  $("aboutNote").value = DATA.about?.note?.ro || "";

  updatePreview();
}

function updatePreview() {

  DATA.contact.phone = $("phone").value;
  DATA.contact.email = $("email").value;
  DATA.contact.website = $("website").value;

  DATA.hero.ro.kicker = $("heroKicker").value;
  DATA.hero.ro.badge = $("heroBadge").value;
  DATA.hero.ro.title = $("heroTitle").value;
  DATA.hero.ro.subtitle = $("heroSub").value;

  DATA.about.title.ro = $("aboutTitle").value;
  DATA.about.text.ro = $("aboutText").value;
  DATA.about.bullets.ro = $("aboutBullets").value.split("\n").filter(Boolean);
  DATA.about.note.ro = $("aboutNote").value;

  $("jsonPreview").value = JSON.stringify(DATA, null, 2);
}

function downloadJson(){
  updatePreview();
  const blob = new Blob([$("jsonPreview").value], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "site.json";
  a.click();
}

document.addEventListener("DOMContentLoaded", ()=>{

  document.querySelectorAll("input,textarea")
    .forEach(el => el.addEventListener("input", updatePreview));

  $("downloadBtn").onclick = downloadJson;
  $("loadBtn").onclick = load;

  load();
});
