import { json } from './_helpers';
export async function onRequestGet({ env }){ const raw=await env.CONTENT.get('articles'); return json(raw?JSON.parse(raw):[]); }
export async function onRequestPut({ request, env }){ const body=await request.json(); await env.CONTENT.put('articles', JSON.stringify(body)); return json({ok:true}); }
