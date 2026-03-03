import {DEFAULT_SITE, DEFAULT_COUNTRIES, DEFAULT_ARTICLES} from '../_defaults.js';
export async function onRequestPost({request, env}) {
  const kv = env.CONTENT;
  const body = await request.json();
  const lang = body.lang || 'ro';

  let site = null;
  try { site = await kv.get('site', {type:'json'}); } catch {}
  site = site || DEFAULT_SITE;

  if (body.site?.contact) site.contact = body.site.contact;
  if (body.site?.strings) {
    site.strings = site.strings || {};
    site.strings[lang] = body.site.strings;
  }

  await kv.put('site', JSON.stringify(site));
  if (Array.isArray(body.countries)) await kv.put('countries', JSON.stringify(body.countries));
  if (Array.isArray(body.articles)) await kv.put('articles', JSON.stringify(body.articles));

  return new Response(JSON.stringify({ok:true}), {headers:{'content-type':'application/json; charset=utf-8'}});
}
