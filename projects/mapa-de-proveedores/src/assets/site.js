'use strict';
(() => {
  const $ = (id) => document.getElementById(id);
  // Local vector icons: no font files or external icon CDNs are required.
  const GLAS_ICONS = {"copy":{"viewBox":"0 0 448 512","paths":["M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"]},"geo-alt":{"viewBox":"0 0 384 512","paths":["M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"]},"arrow-up-right":{"viewBox":"0 0 512 512","paths":["M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"]}};
  function svgIcon(name){const x=GLAS_ICONS[name];return x ? `<svg class="bi bi-${name}" viewBox="${x.viewBox}" aria-hidden="true" focusable="false">${x.paths.map(d=>`<path d="${d}"></path>`).join('')}</svg>` : ''; }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.matchMedia('(max-width: 680px)').matches;
  const menu = $('menu-toggle'), nav = $('main-nav');
  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    menu.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
    nav.classList.toggle('open', !expanded);
  });
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
  }));
  $('year').textContent = String(new Date().getFullYear());

  let toastTimer;
  function toast(message) {
    const el = $('toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2300);
  }
  async function copyText(value) {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) { await navigator.clipboard.writeText(value); copied = true; }
      else {
        const ta = document.createElement('textarea'); ta.value = value; ta.setAttribute('readonly',''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); copied = document.execCommand('copy'); ta.remove();
      }
    } catch (_) { /* copy may be blocked by browser */ }
    toast(copied ? 'Copiado al portapapeles' : 'No se pudo copiar; seleccioná el texto manualmente');
    return copied;
  }
  const form = $('contact-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const message = ['Solicitud web — GL&AS × Chiaramonte','',`Nombre: ${data.nombre}`,`Empresa: ${data.empresa || '—'}`,`País: ${data.pais}`,`Ciudad: ${data.ciudad || '—'}`,`Email: ${data.email}`,`Teléfono: ${data.telefono || '—'}`,`Interés: ${data.interes}`,'',`Mensaje:\n${data.mensaje || '—'}`].join('\n');
    const url = `mailto:edgardo.listello@glyasfobc.com?subject=${encodeURIComponent('Consulta GL&AS × Chiaramonte — ' + data.interes)}&body=${encodeURIComponent(message)}`;
    window.location.href = url;
    toast('Se abrirá tu aplicación de correo para enviar la consulta');
  });


  // --- V3: navigation with reliable internal home action ---
  document.querySelectorAll('a.home-link, a[href="#inicio"]').forEach(a => {
    a.addEventListener('click', (event) => {
      event.preventDefault();
      nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false');
      const root = document.documentElement;
      const previousSnap = root.style.scrollSnapType;
      root.style.scrollSnapType = 'none';
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => { root.style.scrollSnapType = previousSnap; }, 350);
      if(location.protocol !== 'about:') history.replaceState(null, '', location.pathname + location.search);
    });
  });

  // --- American vector map: entirely local, no API keys / no tile CDN ---
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const MAP_W = 1200, MAP_H = 980;
  const FULL = {x:0, y:0, w:MAP_W, h:MAP_H};
  const merc = lat => Math.log(Math.tan(Math.PI/4 + (Math.max(-83,Math.min(83,lat))*Math.PI/180)/2));
  const mercMax=merc(83), mercMin=merc(-58);
  const pt = (lon,lat) => ({x:(lon+171)/149*MAP_W, y:(mercMax-merc(lat))/(mercMax-mercMin)*MAP_H});
  let svg = null, pinLayer = null, places = [], shown = [], active = null, pins = new Map();
  let activeRegion = 'todos';
  let camera = {...FULL}, cameraTween = null;
  const regionSelect = $('region-filter'), detail = $('detail-pane'), backdrop = $('overlay-backdrop');
  const detailHome = detail?.parentNode;
  const fieldNames = {tipo:'Rol comercial',razon_social:'Razón social',contacto:'Persona de contacto',telefono:'Teléfono',whatsapp:'WhatsApp',email:'Correo electrónico',direccion:'Dirección',web:'Sitio web',horario:'Horario'};
  const screenIsMobile = () => matchMedia('(max-width:680px)').matches;

  function openList() {
    $('locator-list-panel')?.classList.add('open');
    $('open-list')?.setAttribute('aria-expanded','true');
  }
  function closeList() {
    $('locator-list-panel')?.classList.remove('open');
    $('open-list')?.setAttribute('aria-expanded','false');
  }
  $('open-list')?.setAttribute('aria-expanded','false');
  $('open-list')?.addEventListener('click',openList);
  $('close-list')?.addEventListener('click',closeList);

  function closeDetail() {
    active = null;
    detail?.classList.remove('open');
    if(detailHome && detail?.parentNode!==detailHome)detailHome.appendChild(detail); detail?.setAttribute('aria-hidden','true');
    if(backdrop) backdrop.hidden=true;
    document.body.classList.remove('panel-open');
    document.querySelectorAll('.locator-item.active').forEach(el=>el.classList.remove('active'));
    pins.forEach(g=>g.classList.remove('selected'));
  }
  $('detail-close')?.addEventListener('click',closeDetail);
  backdrop?.addEventListener('click',closeDetail);
  document.addEventListener('keydown', e=>{if(e.key==='Escape'){closeList();closeDetail();}});

  function addField(container,label,value) {
    if(value==null || String(value).trim()==='') return;
    const row=document.createElement('div');row.className='detail-field';
    const info=document.createElement('div'),k=document.createElement('label'),v=document.createElement('span');
    k.textContent=label;v.textContent=String(value);info.append(k,v);
    const copy=document.createElement('button');copy.type='button';copy.className='field-copy';
    copy.innerHTML=svgIcon("copy");copy.title='Copiar '+label.toLowerCase();
    copy.setAttribute('aria-label','Copiar '+label.toLowerCase());
    copy.addEventListener('click',()=>copyText(String(value)));
    row.append(info,copy);container.append(row);
  }
  function selectPlace(item,move=true) {
    if(!item) return;
    active=item;closeList();
    $('detail-title').textContent=item.nombre;
    $('detail-location').textContent=[item.ciudad,item.pais].filter(Boolean).join(' · ');
    const fields=$('detail-fields');fields.replaceChildren();
    Object.entries(fieldNames).forEach(([key,label])=>addField(fields,label,item[key]));
    addField(fields,'Ciudad',item.ciudad);addField(fields,'País',item.pais);
    if(screenIsMobile() && detail.parentNode!==document.body)document.body.appendChild(detail);
    detail.classList.add('open');detail.setAttribute('aria-hidden','false');
    if(screenIsMobile()){backdrop.hidden=false;document.body.classList.add('panel-open');}
    document.querySelectorAll('.locator-item').forEach(el=>el.classList.toggle('active',el.dataset.id===item.id));
    pins.forEach((g,id)=>g.classList.toggle('selected',id===item.id));
    const node=pins.get(item.id);if(node && pinLayer)pinLayer.appendChild(node);
    if(move && svg){
      const p=pt(item.lng,item.lat),w=screenIsMobile()?420:440,h=w*MAP_H/MAP_W;
      moveCamera({x:p.x-w*(screenIsMobile()?.50:.62),y:p.y-h*.48,w,h});
    }
  }
  $('copy-all')?.addEventListener('click',()=>{
    if(!active)return;
    const lines=['GL&AS × Chiaramonte — Ficha de representante',active.nombre,'Ubicación: '+[active.ciudad,active.pais].filter(Boolean).join(', ')];
    Object.entries(fieldNames).forEach(([key,label])=>{if(active[key])lines.push(label+': '+active[key]);});
    lines.push('Mapa: https://www.openstreetmap.org/?mlat='+active.lat+'&mlon='+active.lng+'#map=11/'+active.lat+'/'+active.lng);
    lines.push('Demostración: datos de ejemplo');copyText(lines.join('\n'));
  });

  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function normalizeView(v){
    let w=clamp(v.w,190,MAP_W),h=w*MAP_H/MAP_W;
    return {x:clamp(v.x,0,MAP_W-w),y:clamp(v.y,0,MAP_H-h),w,h};
  }
  function paintCamera(){if(svg)svg.setAttribute('viewBox',[camera.x,camera.y,camera.w,camera.h].map(x=>x.toFixed(2)).join(' '));}
  function moveCamera(view,animate=true){
    const to=normalizeView(view);
    if(cameraTween){cameraTween.kill?.();cameraTween=null;}
    if(animate && !reducedMotion && window.gsap){cameraTween=gsap.to(camera,{...to,duration:.9,ease:'power3.inOut',onUpdate:paintCamera});}
    else {Object.assign(camera,to);paintCamera();}
  }
  function resetView(){moveCamera(FULL);}
  const REGION_VIEWS={todos:FULL,norte:{x:18,y:5,w:885},central:{x:490,y:445,w:480},sur:{x:605,y:552,w:520}};
  function viewFor(region){const o=REGION_VIEWS[region]||FULL;return { ...o,h:(o.w||1200)*MAP_H/MAP_W };}
  $('map-reset')?.addEventListener('click',()=>{closeDetail();if(regionSelect){regionSelect.value='todos';activeRegion='todos';updateRegion(false);}resetView();});
  function zoom(factor){const w=clamp(camera.w*factor,190,1200);const h=w*MAP_H/MAP_W;moveCamera({x:camera.x+(camera.w-w)/2,y:camera.y+(camera.h-h)/2,w,h});}
  $('vector-zoom-in')?.addEventListener('click',()=>zoom(.72));
  $('vector-zoom-out')?.addEventListener('click',()=>zoom(1.4));

  function buildPin(item){
    const p=pt(item.lng,item.lat),g=document.createElementNS(SVG_NS,'g');g.setAttribute('class','map-pin');
    g.setAttribute('transform',`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    g.setAttribute('tabindex','0');g.setAttribute('role','button');
    g.setAttribute('aria-label',`${item.nombre}, ${item.ciudad}, ${item.pais}. Abrir ficha`);
    const halo=document.createElementNS(SVG_NS,'circle');halo.setAttribute('r','28');halo.setAttribute('class','pin-halo');
    const ring=document.createElementNS(SVG_NS,'circle');ring.setAttribute('r','15');ring.setAttribute('class','pin-ring');
    const core=document.createElementNS(SVG_NS,'circle');core.setAttribute('r','6');core.setAttribute('class','pin-core');
    const title=document.createElementNS(SVG_NS,'title');title.textContent=item.nombre;
    g.append(halo,ring,core,title);
    g.addEventListener('click',e=>{e.stopPropagation();selectPlace(item);});
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectPlace(item);}});
    return g;
  }
  function paintPins(){
    if(!pinLayer) return;
    pinLayer.replaceChildren();pins.clear();
    for(const item of shown){const p=buildPin(item);pins.set(item.id,p);pinLayer.append(p);}
  }
  function renderList(){
    const holder=$('locator-items');holder.replaceChildren();
    $('count-label').textContent=`${shown.length} ${shown.length===1?'ubicación':'ubicaciones'} de demostración`;
    $('mobile-count').textContent=String(shown.length);
    if(!shown.length){const p=document.createElement('p');p.className='locator-empty';p.textContent='Todavía no hay representantes cargados en esta región.';holder.append(p);return;}
    shown.forEach(item=>{
      const b=document.createElement('button');b.type='button';b.className='locator-item';b.dataset.id=item.id;
      const pin=document.createElement('span');pin.className='item-pin';pin.innerHTML=svgIcon("geo-alt");
      const content=document.createElement('span');content.className='item-content';
      const title=document.createElement('strong');title.textContent=item.nombre;
      const sub=document.createElement('small');sub.textContent=[item.ciudad,item.pais].filter(Boolean).join(', ');
      content.append(title,sub);
      const arrow=document.createElement('span');arrow.className='item-arrow';arrow.innerHTML=svgIcon("arrow-up-right");
      b.append(pin,content,arrow);b.addEventListener('click',()=>selectPlace(item));holder.append(b);
    });
  }
  function updateRegion(move=true){
    activeRegion=regionSelect?.value||'todos';closeDetail();
    shown=places.filter(p=>activeRegion==='todos'||p.region===activeRegion);
    renderList();paintPins();
    if(move && svg)moveCamera(viewFor(activeRegion));
  }
  regionSelect?.addEventListener('change',()=>updateRegion(true));

  function addPanZoom(){
    if(!svg)return;
    let drag=null;
    svg.addEventListener('pointerdown',e=>{
      if(e.pointerType==='touch'||e.button!==0||e.target.closest('.map-pin'))return;
      drag={clientX:e.clientX,clientY:e.clientY,view:{...camera}};
      svg.classList.add('is-dragging');svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener('pointermove',e=>{
      if(!drag)return;
      const rect=svg.getBoundingClientRect();
      const scale=Math.max(drag.view.w/rect.width,drag.view.h/rect.height);
      Object.assign(camera,normalizeView({x:drag.view.x-(e.clientX-drag.clientX)*scale,y:drag.view.y-(e.clientY-drag.clientY)*scale,w:drag.view.w}));
      paintCamera();
    });
    const finish=()=>{drag=null;svg.classList.remove('is-dragging');};
    svg.addEventListener('pointerup',finish);svg.addEventListener('pointercancel',finish);
    // Prevent scroll hijacking: zoom by buttons; Ctrl + wheel also supported on desktop.
    svg.addEventListener('wheel',e=>{
      if(!e.ctrlKey)return;e.preventDefault();zoom(e.deltaY>0?1.12:.89);
    },{passive:false});
  }
  async function initMap(){
    try{
      // SVG is shipped with the project. It never requests external tiles.
      const [mapResult,dataResult]=await Promise.all([
        fetch('assets/americas-base.svg'),fetch('data/representantes.json',{cache:'no-cache'})
      ]);
      if(!mapResult.ok||!dataResult.ok)throw Error('No se pudieron abrir los archivos locales');
      const [svgText,source]=await Promise.all([mapResult.text(),dataResult.json()]);
      if(!Array.isArray(source))throw Error('El JSON de representantes no es una lista');
      places=source.filter(p=>p.nombre && ['norte','central','sur'].includes(p.region) && Number.isFinite(p.lat)&&Number.isFinite(p.lng) && p.lat>=-58&&p.lat<=83&&p.lng>=-171&&p.lng<=-22);
      const parsed=new DOMParser().parseFromString(svgText,'image/svg+xml').documentElement;
      if(parsed.tagName.toLowerCase()!=='svg')throw Error('SVG local inválido');
      const holder=$('map');holder.replaceChildren(document.importNode(parsed,true));
      svg=holder.querySelector('svg');svg.id='americas-svg';svg.setAttribute('preserveAspectRatio','xMidYMid meet');
      svg.setAttribute('aria-label','Mapa interactivo vectorial únicamente de América');
      pinLayer=svg.querySelector('#vector-marker-layer');
      paintCamera();updateRegion(false);addPanZoom();
      const badge=holder.closest('.map-pane')?.querySelector('.map-overlay-top>span');
      if(badge)badge.innerHTML='<i></i> AMÉRICA · MAPA VECTORIAL';
    }catch(error){
      console.error('Error de mapa local:',error);
      const h=$('map');h.insertAdjacentHTML('beforeend','<div class="map-error">La imagen base de América está disponible; verificá el servidor local para activar los marcadores.</div>');
      try{const result=await fetch('data/representantes.json');if(result.ok){places=await result.json();updateRegion(false);}}catch(_){/* graceful fallback */}
    }
  }

  // --- premium motion. GSAP is progressive enhancement; the site works without its CDN. ---
  function animateCounters(){
    const counters=[...document.querySelectorAll('[data-count]')];
    const play=el=>{
      if(el.dataset.played)return;el.dataset.played='1';
      const target=Number(el.dataset.count),pad=Number(el.dataset.countPad||0);
      if(reducedMotion){el.textContent=String(target).padStart(pad,'0');return;}
      const start=performance.now(),duration=1250;
      const tick=now=>{
        const t=Math.min(1,(now-start)/duration),e=1-Math.pow(1-t,3);
        el.textContent=String(Math.round(target*e)).padStart(pad,'0');
        if(t<1)requestAnimationFrame(tick);
      };requestAnimationFrame(tick);
    };
    if(!('IntersectionObserver' in window)){counters.forEach(play);return;}
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){play(entry.target);obs.unobserve(entry.target);}
    }),{threshold:.35});counters.forEach(el=>obs.observe(el));
  }
  function animateTimeline(){
    const container=document.querySelector('.chef-points');if(!container)return;
    const steps=[...container.querySelectorAll('.chef-milestone')];
    const set=p=>{
      container.style.setProperty('--timeline-fill',Math.round(p*100)+'%');
      steps.forEach((step,i)=>step.classList.toggle('timeline-active',p>=(i+.15)/steps.length));
    };
    if(reducedMotion){set(1);return;}
    if(window.ScrollTrigger&&window.gsap){
      ScrollTrigger.create({trigger:container,start:'top 75%',end:'bottom 40%',scrub:.35,onUpdate:self=>set(self.progress)});
    }else if('IntersectionObserver' in window){
      const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){set(1);ob.disconnect();}}),{threshold:.25});ob.observe(container);
    }else set(1);
  }
  function initMotion(){
    animateCounters();
    if(reducedMotion){document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in-view'));animateTimeline();return;}
    const gs=window.gsap,st=window.ScrollTrigger;
    if(gs){
      if(st){
        gs.registerPlugin(st);
        gs.utils.toArray('.text-entrance').forEach(el=>{
          gs.from(el,{scrollTrigger:{trigger:el,start:'top 73%',once:true},opacity:0,x:-38,y:12,duration:1.05,ease:'power3.out',clearProps:'all'});
        });
        gs.utils.toArray('.philosophy-card,.adv-card,.training-item,.role-card,.process-step').forEach((el,i)=>{
          gs.from(el,{scrollTrigger:{trigger:el,start:'top 77%',once:true},opacity:0,y:52,rotateX:6,scale:.97,duration:.78,delay:(i%3)*.075,ease:'power3.out',clearProps:'all'});
        });
        // V19: photo reveals are triggered only once at mid-viewport by v19.js.
        gs.from('.map-spotlight h3',{scrollTrigger:{trigger:'.map-spotlight',start:'top 89%',once:true},opacity:0,x:-90,duration:1.1,ease:'power3.out',clearProps:'all'});
        gs.from('.map-topline,.locator',{scrollTrigger:{trigger:'.locator',start:'top 88%',once:true},opacity:0,y:70,duration:1.1,stagger:.12,ease:'power3.out',clearProps:'all'});
      }
    }
    if(!gs||!st){
      // Fallback: intersection motion without hidden content if CDN is inaccessible.
      if('IntersectionObserver' in window){
        const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
          if(entry.isIntersecting){entry.target.classList.add('in-view');io.unobserve(entry.target);}
        }),{rootMargin:'0px 0px -30px 0px',threshold:.05});
        document.querySelectorAll('.reveal,.text-entrance').forEach(el=>io.observe(el));
      }else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view'));
    }
    animateTimeline();
  }

  document.querySelectorAll('[data-interest]').forEach(link=>link.addEventListener('click',()=>{
    const select=document.querySelector('#contact-form select[name="interes"]');
    if(select)select.value=link.dataset.interest;
  }));
  initMap();initMotion();
})();
