import { renderDiasporaList } from "../_render_diaspora_list";
export async function onRequest({ env }){ return new Response(await renderDiasporaList(env,"ru"), { headers: { "content-type":"text/html; charset=utf-8" } }); }
