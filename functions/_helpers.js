export function json(obj, status=200){
  return new Response(JSON.stringify(obj, null, 2), { status, headers: { "content-type":"application/json; charset=utf-8" }});
}
