import {DEFAULT_SITE} from '../_defaults.js';
export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'ro';
  const kv = env.CONTENT;
  let site = null;
  try { site = await kv.get('site', {type:'json'}); } catch {}
  site = site || DEFAULT_SITE;
  return new Response(JSON.stringify({
    contact: site.contact,
    strings: (site.strings && (site.strings[lang] || site.strings.ro)) || DEFAULT_SITE.strings.ro,
    hero: site.hero || DEFAULT_SITE.hero,
    services: site.services || DEFAULT_SITE.services,
    fees: site.fees || DEFAULT_SITE.fees,
    faq: site.faq || DEFAULT_SITE.faq,
    gallery: site.gallery || DEFAULT_SITE.gallery,
  }), {headers:{'content-type':'application/json; charset=utf-8'}});
}
