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

  // --- GL&AS V32 — MapLibre GL JS with local Natural Earth GeoJSON (only Americas) ---
  let map=null, svgFallback=null, places=[],shown=[],active=null,markers=new Map(),activeRegion='todos';
  const mapHolder=$('map'),regionSelect=$('region-filter'),detail=$('detail-pane'),backdrop=$('overlay-backdrop');
  const detailHome=detail?.parentNode;
  const mobile=()=>window.matchMedia('(max-width:680px)').matches;
  const fieldNames={tipo:'Rol comercial',razon_social:'Razón social',contacto:'Persona de contacto',telefono:'Teléfono',whatsapp:'WhatsApp',email:'Correo electrónico',direccion:'Dirección',web:'Sitio web',horario:'Horario'};
  const BOUNDS={
    todos:[[-168,-57],[-30,79]],
    norte:[[-170,9],[-49,77]],
    central:[[-113,4],[-57,30]],
    sur:[[-84,-57],[-31,16]]
  };
  const MAX_BOUNDS=[[-180,-61],[-20,84]];
  const defaultPadding=()=>mobile()?{top:75,bottom:88,left:15,right:15}:{top:52,bottom:52,left:45,right:45};
  const closeList=()=>{
    $('locator-list-panel')?.classList.remove('open');
    $('locator-list-panel')?.setAttribute('aria-modal','false');
    $('list-sheet-backdrop')?.classList.remove('is-visible');
    document.body.classList.remove('list-panel-open');
    $('open-list')?.setAttribute('aria-expanded','false');
  };
  const openList=()=>{
    if(!mobile())return;
    $('locator-list-panel')?.classList.add('open');
    $('locator-list-panel')?.setAttribute('aria-modal','true');
    $('list-sheet-backdrop')?.classList.add('is-visible');
    document.body.classList.add('list-panel-open');
    $('open-list')?.setAttribute('aria-expanded','true');
  };
  $('open-list')?.addEventListener('click',openList);
  $('close-list')?.addEventListener('click',closeList);
  $('list-sheet-backdrop')?.addEventListener('click',closeList);
  $('open-list')?.setAttribute('aria-expanded','false');

  const closeDetail=()=>{
    active=null;
    detail?.classList.remove('open');
    if(detailHome&&detail?.parentNode!==detailHome)detailHome.appendChild(detail);
    detail?.setAttribute('aria-hidden','true');
    detail?.setAttribute('aria-modal','false');
    if(backdrop)backdrop.hidden=true;
    document.body.classList.remove('panel-open');
    document.querySelectorAll('.locator-item.active').forEach(el=>el.classList.remove('active'));
    markers.forEach(m=>m.getElement()?.classList.remove('selected'));
    svgFallback?.clearSelected();
  };
  $('detail-close')?.addEventListener('click',closeDetail);
  backdrop?.addEventListener('click',closeDetail);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeList();closeDetail();}});
  window.addEventListener('resize',()=>{
    if(!mobile()){
      closeList();
      if(detail?.classList.contains('open')){
        if(backdrop)backdrop.hidden=true;
        document.body.classList.remove('panel-open');
        detail?.setAttribute('aria-modal','false');
      }
    }
    map?.resize();
  },{passive:true});

  function addField(container,label,value){
    if(value==null||String(value).trim()==='')return;
    const row=document.createElement('div');row.className='detail-field';
    const info=document.createElement('div'),k=document.createElement('label'),v=document.createElement('span');
    k.textContent=label;v.textContent=String(value);info.append(k,v);
    const copy=document.createElement('button');copy.type='button';copy.className='field-copy';
    copy.innerHTML=svgIcon('copy');copy.title='Copiar '+label.toLowerCase();
    copy.setAttribute('aria-label','Copiar '+label.toLowerCase());
    copy.addEventListener('click',()=>copyText(String(value)));
    row.append(info,copy);container.append(row);
  }
  function selectPlace(item,move=true){
    if(!item)return;
    active=item;closeList();
    $('detail-title').textContent=item.nombre;
    $('detail-location').textContent=[item.ciudad,item.pais].filter(Boolean).join(' · ');
    const fields=$('detail-fields');fields.replaceChildren();
    Object.entries(fieldNames).forEach(([key,label])=>addField(fields,label,item[key]));
    addField(fields,'Ciudad',item.ciudad);addField(fields,'País',item.pais);
    if(mobile()&&detail.parentNode!==document.body)document.body.appendChild(detail);
    detail.classList.add('open');detail.setAttribute('aria-hidden','false');
    detail.setAttribute('aria-modal',mobile()?'true':'false');
    if(mobile()){if(backdrop)backdrop.hidden=false;document.body.classList.add('panel-open');}
    document.querySelectorAll('.locator-item').forEach(el=>el.classList.toggle('active',el.dataset.id===item.id));
    markers.forEach((m,id)=>m.getElement().classList.toggle('selected',id===item.id));
    svgFallback?.select(item.id);
    if(move&&map){
      map.easeTo({center:[item.lng,item.lat],zoom:Math.max(3.2,map.getZoom()),duration:850,essential:true});
    } else if(move&&svgFallback){svgFallback.focus(item);}
  }
  $('copy-all')?.addEventListener('click',()=>{
    if(!active)return;
    const lines=['GL&AS × Chiaramonte — Ficha de representante',active.nombre,'Ubicación: '+[active.ciudad,active.pais].filter(Boolean).join(', ')];
    Object.entries(fieldNames).forEach(([key,label])=>{if(active[key])lines.push(label+': '+active[key]);});
    lines.push('Mapa: https://www.openstreetmap.org/?mlat='+active.lat+'&mlon='+active.lng+'#map=11/'+active.lat+'/'+active.lng);
    copyText(lines.join('\n'));
  });

  function renderList(){
    const holder=$('locator-items');if(!holder)return;holder.replaceChildren();
    $('count-label').textContent=`${shown.length} ${shown.length===1?'ubicación':'ubicaciones'}`;
    $('mobile-count').textContent=String(shown.length);
    if(!shown.length){const p=document.createElement('p');p.className='locator-empty';p.textContent='Todavía no hay representantes cargados en esta región.';holder.append(p);return;}
    shown.forEach(item=>{
      const b=document.createElement('button');b.type='button';b.className='locator-item';b.dataset.id=item.id;
      const pin=document.createElement('span');pin.className='item-pin';pin.innerHTML=svgIcon('geo-alt');
      const content=document.createElement('span');content.className='item-content';
      const title=document.createElement('strong');title.textContent=item.nombre;
      const sub=document.createElement('small');sub.textContent=[item.ciudad,item.pais].filter(Boolean).join(', ');
      content.append(title,sub);
      const arrow=document.createElement('span');arrow.className='item-arrow';arrow.innerHTML=svgIcon('arrow-up-right');
      b.append(pin,content,arrow);b.addEventListener('click',()=>selectPlace(item));holder.append(b);
    });
  }
  function markerEl(item){
    const el=document.createElement('button');el.type='button';el.className='atlas-maplibre-pin';
    el.setAttribute('aria-label',`${item.nombre}, ${item.ciudad}, ${item.pais}. Abrir ficha`);
    el.title=[item.nombre,item.ciudad,item.pais].filter(Boolean).join(' · ');
    el.innerHTML='<span aria-hidden="true" class="atlas-pin-core"></span>';
    // Some mobile WebGL engines cancel synthetic clicks when gestures are enabled.
    // Handle a short, single-finger tap directly, without opening during a pinch.
    let touchStart=null;
    let ignoreClickUntil=0;
    el.addEventListener('touchstart',e=>{
      if(e.touches.length!==1){touchStart=null;return;}
      const t=e.touches[0];
      touchStart={id:t.identifier,x:t.clientX,y:t.clientY,time:performance.now(),moved:false};
    },{passive:true});
    el.addEventListener('touchmove',e=>{
      if(!touchStart||e.touches.length!==1){touchStart=null;return;}
      const t=e.touches[0];
      if(Math.hypot(t.clientX-touchStart.x,t.clientY-touchStart.y)>12)touchStart.moved=true;
    },{passive:true});
    el.addEventListener('touchend',e=>{
      const start=touchStart;touchStart=null;
      if(!start||e.touches.length||start.moved)return;
      const t=Array.from(e.changedTouches).find(t=>t.identifier===start.id);
      if(!t||Math.hypot(t.clientX-start.x,t.clientY-start.y)>14||performance.now()-start.time>850)return;
      ignoreClickUntil=performance.now()+900;
      if(e.cancelable)e.preventDefault();
      e.stopPropagation();
      selectPlace(item,false);
    },{passive:false});
    el.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
    el.addEventListener('click',e=>{
      e.stopPropagation();
      if(performance.now()>=ignoreClickUntil)selectPlace(item,false);
    });
    return el;
  }
  function paintMarkers(){
    markers.forEach(m=>m.remove());markers.clear();
    if(svgFallback){svgFallback.setItems(shown);return;}
    if(!map)return;
    shown.forEach(item=>{
      const marker=new maplibregl.Marker({element:markerEl(item),anchor:'center'})
        .setLngLat([item.lng,item.lat]).addTo(map);
      markers.set(item.id,marker);
    });
  }
  function updateRegion(move=true){
    activeRegion=regionSelect?.value||'todos';closeDetail();
    shown=places.filter(p=>activeRegion==='todos'||p.region===activeRegion);
    renderList();paintMarkers();
    if(move&&map)map.fitBounds(BOUNDS[activeRegion],{padding:defaultPadding(),duration:750,essential:true,maxZoom:4.1});
    else if(move&&svgFallback)svgFallback.region(activeRegion);
  }
  regionSelect?.addEventListener('change',()=>updateRegion(true));
  $('map-reset')?.addEventListener('click',()=>{
    if(regionSelect)regionSelect.value='todos';
    updateRegion(false);
    map?.fitBounds(BOUNDS.todos,{padding:defaultPadding(),duration:850,essential:true});
    svgFallback?.reset();
  });
  $('vector-zoom-in')?.addEventListener('click',()=>{if(map)map.zoomIn({duration:350});else svgFallback?.zoom(.72);});
  $('vector-zoom-out')?.addEventListener('click',()=>{if(map)map.zoomOut({duration:350});else svgFallback?.zoom(1.4);});

  function linesGeojson(){
    const feats=[];
    for(let lon=-180;lon<=-20;lon+=20){
      feats.push({type:'Feature',geometry:{type:'LineString',coordinates:Array.from({length:74},(_,i)=>[lon,-60+i*2])},properties:{}});
    }
    for(let lat=-60;lat<=80;lat+=20){
      feats.push({type:'Feature',geometry:{type:'LineString',coordinates:Array.from({length:81},(_,i)=>[-180+i*2,lat])},properties:{}});
    }
    return {type:'FeatureCollection',features:feats};
  }
  function geoStyle(geo){
    return {version:8,name:'Atlas GL&AS · América',sources:{
      paises:{type:'geojson',data:geo},
      cuadricula:{type:'geojson',data:linesGeojson()}
    },layers:[
      {id:'oceano',type:'background',paint:{'background-color':'#173b52'}},
      {id:'cuadricula',type:'line',source:'cuadricula',paint:{'line-color':'#b7c7bc','line-opacity':0.18,'line-width':0.65}},
      {id:'pais-sombra',type:'line',source:'paises',paint:{'line-color':'#081a29','line-opacity':.55,'line-width':3,'line-blur':2}},
      {id:'territorios',type:'fill',source:'paises',paint:{'fill-color':'#eddfbe','fill-opacity':1}},
      {id:'fronteras',type:'line',source:'paises',paint:{'line-color':'#c7a66e','line-opacity':0.9,'line-width':1.15}}
    ]};
  }
  async function fallback(reason){
    // The external MapLibre CDN or WebGL can be disabled by browser protection.
    // Keep all filters, markers, touch gestures, and details working without it.
    console.warn('MapLibre no disponible; activando atlas SVG interactivo local:',reason);
    if(map){try{map.remove()}catch(_){ }map=null;}
    if(!places.length){
      try{const r=await fetch('data/representantes.json',{cache:'no-cache'});
        if(r.ok){const rows=await r.json();places=Array.isArray(rows)?rows:[];}}
      catch(_){/* continue with available list */}
    }
    shown=places.filter(p=>activeRegion==='todos'||p.region===activeRegion);
    try{
      svgFallback=new window.InteractiveAmericasFallback(mapHolder,(item)=>selectPlace(item,false));
      await svgFallback.init();
      renderList();svgFallback.setItems(shown);svgFallback.region(activeRegion);
      const badge=mapHolder.closest('.map-pane')?.querySelector('.map-overlay-top>span');
      if(badge)badge.textContent='◈  AMÉRICA · MAPA INTERACTIVO';
      mapHolder.setAttribute('aria-label','Mapa SVG interactivo de América con representantes. Dos dedos para explorar en móviles.');
    }catch(error){
      console.error('Error en el mapa local:',error);
      mapHolder.innerHTML='<img class="map-static-preview" alt="Mapa de América" src="assets/americas-base.svg"/><div class="v32-fallback-notice">No fue posible abrir el mapa. Consultá los representantes desde la lista.</div>';
      renderList();
    }
  }
  async function initMap(){
    try{
      const [geores,datares]=await Promise.all([
        fetch('data/americas.geojson'),fetch('data/representantes.json',{cache:'no-cache'})
      ]);
      if(!geores.ok||!datares.ok)throw Error('No se pudieron cargar los datos del atlas');
      const [geo,data]=await Promise.all([geores.json(),datares.json()]);
      if(!Array.isArray(data)||geo?.type!=='FeatureCollection')throw Error('Formato de datos inválido');
      places=data.filter(p=>p.nombre&&['norte','central','sur'].includes(p.region)&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&p.lat>=-60&&p.lat<=84&&p.lng>=-180&&p.lng<=-20);
      renderList();
      if(typeof window.maplibregl==='undefined'||!maplibregl.supported?.()){
        fallback('MapLibre o WebGL no está disponible');return;
      }
      map=new maplibregl.Map({
        container:mapHolder,
        style:geoStyle(geo),
        center:[-95,9],zoom:1.2,
        cooperativeGestures:true,
        renderWorldCopies:false,
        maxBounds:MAX_BOUNDS,
        minZoom:0.7,maxZoom:6.5,
        maxPitch:0,
        dragRotate:false,touchPitch:false,pitchWithRotate:false,
        attributionControl:false
      });
      map.on('load',()=>{
        updateRegion(false);
        map.fitBounds(BOUNDS.todos,{padding:defaultPadding(),duration:0});
      });
      map.on('error',e=>{console.error('MapLibre:',e.error||e);});
      map.on('touchstart',e=>{
        if(e.originalEvent?.touches?.length>=2)mapHolder.closest('.map-pane')?.classList.add('has-touch-explored');
      });
      map.addControl(new maplibregl.AttributionControl({compact:true,customAttribution:'Natural Earth (dominio público)'}),'bottom-left');
      const badge=mapHolder.closest('.map-pane')?.querySelector('.map-overlay-top>span');
      if(badge)badge.textContent='◈  AMÉRICA · MAPLIBRE';
    }catch(err){fallback(err.message||String(err));}
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
        gs.from('.atlas-heading h2',{scrollTrigger:{trigger:'.atlas-heading',start:'top 89%',once:true},opacity:0,x:-90,duration:1.1,ease:'power3.out',clearProps:'all'});
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
