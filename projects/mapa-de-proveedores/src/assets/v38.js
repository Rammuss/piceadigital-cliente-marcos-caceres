/* V38 — directorio fuera de América alimentado desde JSON, sin representantes inventados. */
'use strict';
(() => {
  const toggle = document.getElementById('extra-network-toggle');
  const body = document.getElementById('extra-network-body');
  const content = document.getElementById('extra-network-results');
  if (!toggle || !body || !content) return;
  let loaded = false;
  const el=(tag,className,text)=>{
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  function render(data){
    content.replaceChildren();
    const confirmed=Array.isArray(data.representantes) ? data.representantes : [];
    const pending=Array.isArray(data.territorios_interes) ? data.territorios_interes : [];
    const regions=new Map();
    // A country interested in a representation is explicitly NOT a confirmed representative.
    pending.forEach(it => {
      if (!it.pais || !it.region) return;
      const key=it.region.trim();
      if (!regions.has(key))regions.set(key,[]);
      regions.get(key).push({pais:it.pais,status:it.estado||'Consultas en curso',confirmed:false});
    });
    confirmed.forEach(it => {
      if (!it.pais || !it.region || !it.nombre) return;
      const key=it.region.trim();
      if (!regions.has(key))regions.set(key,[]);
      // replace an unconfirmed territory interest with actual rep once approved.
      const arr=regions.get(key);
      for(let i=arr.length-1;i>=0;i--){if(!arr[i].confirmed&&arr[i].pais===it.pais)arr.splice(i,1)}
      arr.push({...it,confirmed:true});
    });
    if(!regions.size){content.appendChild(el('p','extra-network-empty','Todavía no hay representantes fuera de América publicados.'));return;}
    const order=['Asia','Europa','África','Oceanía'];
    const sorted=[...regions].sort(([a],[b])=>(order.indexOf(a)<0?99:order.indexOf(a))-(order.indexOf(b)<0?99:order.indexOf(b)) || a.localeCompare(b,'es'));
    let number=0;
    sorted.forEach(([region,entries])=>{
      const sect=el('section','extra-region');
      sect.appendChild(el('h4','extra-region-title',region));
      const list=el('div','extra-country-list');
      entries.forEach(it=>{
        number++;
        const row=el('div','extra-country');
        row.appendChild(el('span','extra-country-index',String(number).padStart(2,'0')));
        const left=el('div');
        left.appendChild(el('div','extra-country-name',it.pais));
        left.appendChild(el('div','extra-country-sub',it.confirmed ? it.nombre : 'Interés recibido'));
        row.appendChild(left);
        const meta=el('div','extra-country-meta');
        if(it.confirmed){
          if(it.email){const a=el('a','',it.email);a.href='mailto:'+it.email;meta.appendChild(a)}
          else if(it.telefono){const a=el('a','',it.telefono);a.href='tel:'+it.telefono.replace(/[^+0-9]/g,'');meta.appendChild(a)}
          else meta.textContent='Representante confirmado';
        } else meta.textContent=it.status;
        row.appendChild(meta);
        list.appendChild(row);
      });
      sect.appendChild(list);content.appendChild(sect);
    });
  }
  async function load(){
    if(loaded)return;
    loaded=true;
    try {
      const res=await fetch('data/representantes-internacionales.json',{cache:'no-store'});
      if(!res.ok)throw new Error('HTTP '+res.status);
      render(await res.json());
    } catch(err) {
      content.replaceChildren(el('p','extra-network-empty','No se pudo cargar el directorio internacional.'));console.warn('Directorio internacional:',err);
      loaded=false;
    }
  }
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')==='true';
    toggle.setAttribute('aria-expanded',String(!open));
    body.hidden=open;
    const label=toggle.querySelector('.extra-network-toggle-label');
    if(label)label.textContent=open?'Ver otras regiones':'Ocultar otras regiones';
    if(!open)load();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && !body.hidden){
      body.hidden=true;
      toggle.setAttribute('aria-expanded','false');
      const label=toggle.querySelector('.extra-network-toggle-label');
      if(label)label.textContent='Ver otras regiones';
      toggle.focus();
    }
  });
})();
