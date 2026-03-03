(function(){
  const $ = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const toast = $("#toast");

  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.style.display = "block";
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=>toast.style.display="none", 1100);
  }

  // Scroll progress
  const bar = $("#progress");
  function onScroll(){
    if(!bar) return;
    const h = document.documentElement;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    const pct = Math.min(100, Math.max(0, (h.scrollTop / max) * 100));
    bar.style.width = pct.toFixed(2) + "%";
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  // Smooth anchor scroll
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      const el = id && id.length>1 ? document.querySelector(id) : null;
      if(!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null, "", id);
    });
  });

  // Copy helpers
  $$('[data-copy]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      try{
        await navigator.clipboard.writeText(btn.getAttribute('data-copy')||'');
        showToast("Copiat ✅");
      }catch(e){
        showToast("Nu pot copia");
      }
    });
  });

  // Install prompt (PWA)
  let deferred;
  window.addEventListener("beforeinstallprompt", (e)=>{
    e.preventDefault();
    deferred = e;
    const b = $("#installBtn");
    if(b){
      b.style.display = "inline-flex";
      b.addEventListener("click", async ()=>{
        try{
          deferred.prompt();
          await deferred.userChoice;
          deferred = null;
          b.style.display = "none";
        }catch(err){}
      }, {once:true});
    }
  });


// Mobile menu
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");
const closeMenu = ()=>{
  if(mobileMenu) mobileMenu.classList.remove("open");
};
if(menuBtn && mobileMenu){
  menuBtn.addEventListener("click", ()=>{
    mobileMenu.classList.toggle("open");
  });
  mobileMenu.addEventListener("click", (e)=>{
    if(e.target === mobileMenu) closeMenu();
  });
  $$("#mobileMenu a").forEach(a=>a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeMenu(); });
}

  // Service worker
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("/service-worker.js").catch(()=>{});
  }
})();
