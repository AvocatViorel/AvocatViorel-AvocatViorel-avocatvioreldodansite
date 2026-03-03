export async function onRequestPost({request, env}) {
  const kv = env.CONTENT;
  const body = await request.json().catch(()=>({}));
  if (!body.confirm) return new Response('confirm required', {status:400});
  await kv.delete('site');
  await kv.delete('countries');
  await kv.delete('articles');
  return new Response(JSON.stringify({ok:true}), {headers:{'content-type':'application/json; charset=utf-8'}});
}
