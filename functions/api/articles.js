import {DEFAULT_ARTICLES} from '../_defaults.js';
export async function onRequestGet({env}) {
  const kv = env.CONTENT;
  let data = null;
  try { data = await kv.get('articles', {type:'json'}); } catch {}
  if (!Array.isArray(data) || !data.length) data = DEFAULT_ARTICLES;
  return new Response(JSON.stringify(data), {headers:{'content-type':'application/json; charset=utf-8'}});
}
