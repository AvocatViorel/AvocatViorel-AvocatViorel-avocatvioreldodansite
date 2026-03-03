export async function onRequest({request, env, next}) {
  const url = new URL(request.url);
  const path = url.pathname;

  const protect = path.startsWith('/admin') || path === '/api/save' || path === '/api/reset';
  if (!protect) return next();

  const u = env.ADMIN_USER || '';
  const p = env.ADMIN_PASS || '';
  if (!u || !p) return next(); // if not set, allow

  const h = request.headers.get('authorization') || '';
  if (!h.startsWith('Basic ')) return unauthorized();

  const raw = atob(h.slice(6));
  const [uu, pp] = raw.split(':');
  if (uu !== u || pp !== p) return unauthorized();

  return next();
}

function unauthorized() {
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  });
}
