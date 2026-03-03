(function(){
  if (window.__VD_WIZARD_INIT__) return; window.__VD_WIZARD_INIT__ = true;
  const $ = (id)=>document.getElementById(id);
  const wizard = $("wizard");
  if(!wizard) return;

  const state = { country:"", topic:"", urgency:"normal", children:"no", assets:"no" };

  const steps = Array.from(wizard.querySelectorAll("[data-step]"));
  let idx = 0;

  function show(i){
    idx = Math.max(0, Math.min(steps.length-1, i));
    steps.forEach((s,k)=>s.style.display = k===idx ? "block":"none");
    const pct = Math.round(((idx+1)/steps.length)*100);
    const p = $("wizardPct");
    if(p) p.textContent = pct + "%";
  }

  function getRec(){
    const {topic, urgency, children, assets} = state;
    const rec = [];
    if(topic==="divorce"){
      rec.push("1) Stabilim jurisdicția și actele (ID, certificat căsătorie, copii).");
      if(children==="yes") rec.push("2) Strategie pentru custodie și program (probe, comunicare, interes copil).");
      rec.push("3) Dacă e diaspora: procură / apostilă + traduceri.");
    } else if(topic==="inheritance"){
      rec.push("1) Checklist acte: certificat de deces, acte proprietate, grad rudenie.");
      if(assets==="yes") rec.push("2) Inventariere bunuri + evaluare + risc de litigiu.");
      rec.push("3) Termene și opțiuni: notar vs instanță.");
    } else if(topic==="civil"){
      rec.push("1) Clarificăm obiectul: datorie / contract / prejudiciu.");
      rec.push("2) Probe: mesaje, transferuri, martori, înscrisuri.");
      rec.push("3) Strategie: conciliere → cerere → executare.");
    } else if(topic==="support"){
      rec.push("1) Stabilim veniturile și nevoile copilului.");
      rec.push("2) Calcul orientativ + probe (cheltuieli, transferuri).");
      rec.push("3) Procedură: cerere, ordonanță, executare.");
    } else {
      rec.push("Alege un tip de problemă pentru recomandări.");
    }
    if(urgency==="urgent") rec.unshift("⚠️ Urgent: verificăm termene limită și măsuri provizorii.");
    return rec;
  }

  // Bind controls
  wizard.querySelectorAll("[data-set]").forEach(el=>{
    el.addEventListener("change", ()=>{
      const key = el.getAttribute("data-set");
      state[key] = el.value;
    });
  });

  wizard.querySelectorAll("[data-next]").forEach(b=>b.addEventListener("click", ()=>show(idx+1)));
  wizard.querySelectorAll("[data-prev]").forEach(b=>b.addEventListener("click", ()=>show(idx-1)));

  const out = $("wizardOut");
  const gen = $("wizardGen");
  if(gen && out){
    gen.addEventListener("click", ()=>{
      const lines = getRec();
      out.value = lines.map(x=>"• "+x).join("\n");
    });
  }

  // Simple child support calculator (very rough)
  const calcBtn = $("calcBtn");
  if(calcBtn){
    calcBtn.addEventListener("click", ()=>{
      const income = parseFloat(($("income")?.value||"").replace(",",".")) || 0;
      const kids = parseInt($("kids")?.value||"1", 10) || 1;
      // heuristic: 20% for 1, 30% for 2, 35% for 3+
      const pct = kids<=1 ? 0.20 : kids===2 ? 0.30 : 0.35;
      const est = income * pct;
      const res = $("calcOut");
      if(res) res.value = `Estimare orientativă: ~${est.toFixed(2)} (monedă/lună).\nNotă: Calculul real depinde de instanță și probe.`;
    });
  }

  show(0);
})();
