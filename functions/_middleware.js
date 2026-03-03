export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
    const USER = env.ADMIN_USER || "viorel";
    const PASS = env.ADMIN_PASS;

    if (!PASS) {
      return new Response("Admin disabled (missing ADMIN_PASS).", { status: 403 });
    }

    const auth = request.headers.get("Authorization");
    const valid = "Basic " + btoa(`${USER}:${PASS}`);

    if (auth !== valid) {
      return new Response("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
      });
    }
  }

  return next();
}
