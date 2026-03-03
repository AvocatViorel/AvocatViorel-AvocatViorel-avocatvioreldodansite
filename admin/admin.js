const $ = (id) => document.getElementById(id);
let LANG = 'ro';

document.querySelectorAll('.tab').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    LANG = b.dataset.lang;
    $('previewBtn').href = `/${LANG}/`;
    loadAll();
  });
});

async function jget(url){
  const r = await fetch(url,{cache:'no-store'});
  const txt = await r.text();
  if(!r.ok) throw new Error(txt || ("HTTP " + r.status));
  return JSON.parse(txt);
}
async function jpost(url, data){
  const r = await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
  const txt = await r.text();
  if(!r.ok) throw new Error(txt || ("HTTP " + r.status));
  return JSON.parse(txt);
}
const pretty = (o) => JSON.stringify(o, null, 2);

function setKvStatus(ok, msg){
  const el = $('kvStatus');
  if(!el) return;
  el.innerHTML = `KV: <strong class="${ok?'ok':'bad'}">${msg}</strong>`;
}

async function loadAll(){
  // KV health check
  try{
    const h = await jget('/api/health');
    setKvStatus(!!h.ok, h.ok ? 'ok' : 'fail');
  }catch(e){
    setKvStatus(false, 'fail');
  }

  const site = await jget('/api/site?lang='+LANG);
  const services = await jget('/api/services');
  const pricing = await jget('/api/pricing');
  const faq = await jget('/api/faq');
  const countries = await jget('/api/countries');
  const articles = await jget('/api/articles');

  $('phone').value = site.contact?.phone || '';
  $('email').value = site.contact?.email || '';
  $('website').value = site.contact?.website || '';
  $('viber').value = site.contact?.viber || '';

  $('heroTitle').value = site.strings?.heroTitle || '';
  $('heroSub').value = site.strings?.heroSub || '';
  $('aboutText').value = site.strings?.aboutText || '';
  $('servicesSub').value = site.strings?.servicesSub || '';
  $('diasporaSub').value = site.strings?.diasporaSub || '';

  $('siteJson').value = pretty(site);
  $('servicesJson').value = pretty(services);
  $('pricingJson').value = pretty(pricing);
  $('faqJson').value = pretty(faq);
  $('countriesJson').value = pretty(countries);
  $('articlesJson').value = pretty(articles);
}

function parseJson(txt){
  try{return JSON.parse(txt);}catch(e){throw new Error('JSON invalid: ' + e.message);}
}

async function saveAll(){
  const site = parseJson($('siteJson').value);
  // keep quick fields in sync
  site.contact = site.contact || {};
  site.contact.phone = $('phone').value.trim();
  site.contact.email = $('email').value.trim();
  site.contact.website = $('website').value.trim();
  site.contact.viber = $('viber').value.trim();
  site.strings = site.strings || {};
  site.strings.heroTitle = $('heroTitle').value;
  site.strings.heroSub = $('heroSub').value;
  site.strings.aboutText = $('aboutText').value;
  site.strings.servicesSub = $('servicesSub').value;
  site.strings.diasporaSub = $('diasporaSub').value;

  await jpost('/api/save',{
    lang: LANG,
    site,
    services: parseJson($('servicesJson').value),
    pricing: parseJson($('pricingJson').value),
    faq: parseJson($('faqJson').value),
    countries: parseJson($('countriesJson').value),
    articles: parseJson($('articlesJson').value),
  });
  alert('Salvat ✅');
}

async function resetAll(){
  await jpost('/api/reset',{confirm:true});
  await loadAll();
  alert('Reset ✅');
}

$('loadBtn').onclick = ()=>loadAll().catch(e=>alert(e.message||String(e)));
$('saveBtn').onclick = ()=>saveAll().catch(e=>alert(e.message||String(e)));
$('resetBtn').onclick = ()=>resetAll().catch(e=>alert(e.message||String(e)));

$('previewBtn').href = `/${LANG}/`;
loadAll().catch(()=>{});
