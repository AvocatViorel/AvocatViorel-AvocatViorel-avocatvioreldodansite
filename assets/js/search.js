(async function(){
  const box = document.getElementById("searchBox");
  const out = document.getElementById("searchOut");
  const lang = document.documentElement.getAttribute("lang") || "ro";
  if(!box || !out) return;

  let articles = [];
  try{
    const r = await fetch("/api/articles", {cache:"no-store"});
    if(r.ok) articles = await r.json();
  }catch(e){}

  function norm(s){ return (s||"").toLowerCase(); }

  function render(q){
    const qq = norm(q).trim();
    const items = qq ? articles.filter(a=>{
      const t = a.title?.[lang] || a.title?.ro || "";
      const e = a.excerpt?.[lang] || a.excerpt?.ro || "";
      return norm(t).includes(qq) || norm(e).includes(qq) || norm(a.slug).includes(qq);
    }) : articles;

    out.innerHTML = items.slice(0,24).map(a=>{
      const t = a.title?.[lang] || a.title?.ro || "Articol";
      const e = a.excerpt?.[lang] || a.excerpt?.ro || "";
      return `<div class="feature">
        <div class="tag">${a.date||""} • ${(a.readMins||5)} min</div>
        <h3>${escapeHtml(t)}</h3>
        <p class="sub">${escapeHtml(e)}</p>
        <div class="heroActions"><a class="btn secondary" href="/${lang}/articole/${a.slug}/">Citește</a></div>
      </div>`;
    }).join("");
  }

  function escapeHtml(s){
    return String(s||"").replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  let t; const debounce=(fn,ms)=>{ return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args),ms); }; };
  box.addEventListener("input", debounce(()=>render(box.value), 120));
  render("");
})();
