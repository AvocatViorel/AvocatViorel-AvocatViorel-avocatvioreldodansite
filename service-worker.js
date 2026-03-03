const CACHE = "vd-2050-v1";
const CORE = [
  "/ro/","/ru/","/en/",
  "/assets/css/styles.css",
  "/assets/js/site.js",
  "/assets/js/wizard.js",
  "/assets/js/search.js",
  "/assets/img/favicon.svg",
  "/manifest.webmanifest",
  "/offline.html"
];

self.addEventListener("install", (e)=>{
  e.waitUntil((async()=>{
    const c = await caches.open(CACHE);
    await c.addAll(CORE);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e)=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.map(k=>k===CACHE?null:caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener("fetch", (e)=>{
  const req = e.request;
  if (req.method !== "GET") return;
  // Navigation fallback
  if (req.mode === "navigate"){
    e.respondWith((async()=>{
      try{ return await fetch(req); }
      catch(err){ return (await caches.match("/offline.html")) || new Response("Offline",{status:503}); }
    })());
    return;
  }

  e.respondWith((async()=>{
    const cached = await caches.match(req);
    if(cached) return cached;
    try{
      const fresh = await fetch(req);
      const url = new URL(req.url);
      if(url.origin === location.origin){
        const c = await caches.open(CACHE);
        c.put(req, fresh.clone());
      }
      return fresh;
    }catch(err){
      return cached || new Response("Offline", {status: 503});
    }
  })());
});
