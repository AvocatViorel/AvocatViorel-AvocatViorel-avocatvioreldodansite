const { handle } = require('../_articles_list');
export async function onRequest({ env }){
  const html = await handle({ env, lang: 'ru', path: '/articole' });
  return new Response(html, { headers: { 'content-type':'text/html; charset=utf-8' } });
}
