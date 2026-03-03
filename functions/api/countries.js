import {DEFAULT_COUNTRIES} from '../defaults.js';
export async function onRequestGet({env}) {
  const kv = env.CONTENT;
  let data = null;
  try { data = await kv.get('countries', {type:'json'}); } catch {}
  if (!Array.isArray(data) || !data.length) data = DEFAULT_COUNTRIES;
  return new Response(JSON.stringify(data), {headers:{'content-type':'application/json; charset=utf-8'}});
}
