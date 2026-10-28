/* Grupo Listello: mapa + selector regional + fichas copiables (sin base de datos). */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const message = $('message');
  const count = $('count');
  const listCount = $('list-count');
  const list = $('locations');
  const selector = $('region');
  const caption = $('region-caption');
  const detail = $('detail');
  const detailTitle = $('detail-title');
  const detailLocation = $('detail-location');
  const detailFields = $('detail-fields');
  const copyAllButton = $('copy-all');
  const mapLink = $('open-maps');
  const toast = $('toast');
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const copyIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
  function showError(text) { message.innerHTML = `<strong>No se pudo cargar el mapa</strong>${safe(text)}`; message.hidden = false; }
  if (typeof L === 'undefined') { showError('Verificá tu conexión a Internet para cargar Leaflet.'); return; }

  const boundsAmerica = L.latLngBounds([[-58, -119], [58, -32]]);
  const map = L.map('map', {scrollWheelZoom:true, zoomControl:false, minZoom:2, maxZoom:18, worldCopyJump:true});
  L.control.zoom({position:'topright'}).addTo(map);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom:19
  }).addTo(map);
  map.fitBounds(boundsAmerica, {padding:[20,20]});

  const icon = L.divIcon({className:'pin-shell', html:'<span class="pin"></span>',iconSize:[29,29],iconAnchor:[14,14]});
  const iconSelected = L.divIcon({className:'pin-shell selected',html:'<span class="pin"></span>',iconSize:[29,29],iconAnchor:[14,14]});
  const regions = {todos:'Todas las ubicaciones disponibles',norte:'Distribuidores de América del Norte',central:'Distribuidores de América Central',sur:'Distribuidores de América del Sur'};
  const isValid = d => d && d.nombre && d.pais && Number.isFinite(d.lat) && Number.isFinite(d.lng) && Math.abs(d.lat)<=90 && Math.abs(d.lng)<=180;
  const printableKeys = [
    ['nombre','Nombre'],['razon_social','Razón social'],['contacto','Persona de contacto'],
    ['pais','País'],['ciudad','Ciudad'],['direccion','Dirección'],
    ['telefono','Teléfono'],['whatsapp','WhatsApp'],['email','Correo electrónico'],
    ['web','Sitio web'],['horario','Horario de atención']
  ];
  let records = [];
  let visible = new Map();
  let selectedId = null;
  let current = null;
  let toastTimer;
  const layer = L.layerGroup().addTo(map);

  function mapsUrl(d) { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.lat+','+d.lng)}`; }
  function usableUrl(raw) {
    if (!raw) return '';
    try { const url = new URL(/^https?:\/\//i.test(raw) ? raw : 'https://' + raw); return ['http:','https:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  }
  function formatValue(value) { return String(value ?? '').trim(); }
  function printable(d) {
    return printableKeys.filter(([key])=>formatValue(d[key])).map(([key,label])=>`${label}: ${formatValue(d[key])}`).join('\n');
  }
  function announce(text) {
    clearTimeout(toastTimer);
    toast.textContent=text;
    toast.hidden=false;
    toastTimer=setTimeout(()=>{toast.hidden=true;},2200);
  }
  async function copyText(value,successLabel) {
    try {
      if (!value) { announce('No hay datos para copiar'); return; }
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const temp=document.createElement('textarea');
        temp.value=value; temp.setAttribute('readonly','');
        Object.assign(temp.style,{position:'fixed',left:'-9999px',top:'0',opacity:'0'});
        document.body.append(temp); temp.select();
        const ok=document.execCommand('copy'); temp.remove();
        if(!ok) throw new Error('No se pudo copiar');
      }
      announce(successLabel);
    } catch(err) {
      console.error('Error al copiar',err);
      announce('No se pudo copiar. Seleccioná el texto manualmente.');
    }
  }
  function fieldRows(d) {
    const rows = [
      ['razon_social','Razón social'],['contacto','Persona de contacto'],
      ['direccion','Dirección'],['telefono','Teléfono'],['whatsapp','WhatsApp'],
      ['email','Correo electrónico'],['web','Sitio web'],['horario','Horario de atención']
    ];
    detailFields.replaceChildren();
    const show = rows.filter(([key])=>formatValue(d[key]));
    if (!show.length) {
      const text=document.createElement('p');text.className='empty-details';
      text.textContent='Este distribuidor todavía no tiene datos de contacto cargados.';
      detailFields.append(text); return;
    }
    for(const [key,label] of show) {
      const value=formatValue(d[key]);
      const item=document.createElement('div'); item.className='field';
      const meta=document.createElement('div');meta.className='field-meta';
      const labelNode=document.createElement('span');labelNode.className='field-label';labelNode.textContent=label;
      const valueNode=document.createElement('div');valueNode.className='field-value';
      // Texto seleccionable; los enlaces son complementarios al botón de copia.
      valueNode.textContent=value;
      const row=document.createElement('div');row.className='field-row';
      row.append(valueNode);
      const copy=document.createElement('button');copy.type='button'; copy.className='copy-field';
      copy.innerHTML=copyIcon;copy.title=`Copiar ${label.toLowerCase()}`;
      copy.setAttribute('aria-label',`Copiar ${label.toLowerCase()}: ${value}`);
      copy.addEventListener('click',()=>copyText(value,`${label} copiado`));
      row.append(copy);meta.append(labelNode,row);item.append(meta);
      let external='';
      if(key==='email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) external=`mailto:${encodeURIComponent(value)}`;
      else if(key==='telefono') { const phone=value.replace(/[^\d+]/g,''); if(phone.length>=8 && /[1-9]/.test(phone.replace(/^\+?595/,''))) external=`tel:${phone}`; }
      else if(key==='whatsapp') { const phone=value.replace(/\D/g,''); if(phone.length>=8) external=`https://wa.me/${phone}`; }
      else if(key==='web') external=usableUrl(value);
      if(external) {
        const open=document.createElement('a');open.href=external;
        open.className='field-link';open.textContent=key==='email'?'Enviar correo ↗':key==='telefono'?'Llamar ↗':key==='whatsapp'?'Abrir WhatsApp ↗':'Visitar sitio web ↗';
        if(key==='web'||key==='whatsapp'){open.target='_blank';open.rel='noopener noreferrer';}
        item.append(open);
      }
      detailFields.append(item);
    }
  }
  function closeDetail() {
    detail.hidden=true; current=null; selectedId=null;
    for(const marker of visible.values()) marker.setIcon(icon);
    for(const el of list.querySelectorAll('[data-distribuidor]')){
      el.classList.remove('active');el.setAttribute('aria-pressed','false');
    }
  }
  function selectDistributor(id, {fly=false}={}) {
    const d=records.find(item=>item.id===id);
    if(!d || !visible.has(id)) return;
    current=d;selectedId=id;
    for(const [key,marker] of visible) marker.setIcon(key===id?iconSelected:icon);
    for(const el of list.querySelectorAll('[data-distribuidor]')) {
      const active=el.dataset.distribuidor===id;
      el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));
      if(active && fly) el.scrollIntoView({block:'nearest',behavior:'smooth'});
    }
    detailTitle.textContent=d.nombre;
    detailLocation.textContent=[d.ciudad,d.pais].filter(Boolean).join(' · ');
    mapLink.href=mapsUrl(d);
    fieldRows(d);detail.hidden=false;
    const marker=visible.get(id);
    if(fly && marker) {
      const target=marker.getLatLng();
      // En celular, el panel ocupa parte del mapa: evitamos un zoom excesivo.
      map.flyTo(target,Math.max(map.getZoom(),5),{duration:.65});
    }
  }
  function render() {
    const region=selector.value;
    const filtered=records.filter(d=>region==='todos'||d.region===region);
    closeDetail();layer.clearLayers();visible=new Map();list.replaceChildren();
    count.textContent=`${filtered.length} distribuidor${filtered.length===1?'':'es'}`;
    listCount.textContent=String(filtered.length);
    caption.textContent=regions[region] || regions.todos;
    if(!filtered.length) {
      const empty=document.createElement('p');empty.className='empty-list';empty.textContent='Todavía no hay distribuidores cargados en esta región.';
      list.append(empty);map.fitBounds(boundsAmerica,{padding:[20,20]});return;
    }
    for(const d of filtered) {
      const marker=L.marker([d.lat,d.lng],{icon,title:d.nombre}).addTo(layer);
      visible.set(d.id,marker);
      marker.on('click',()=>selectDistributor(d.id));
      const button=document.createElement('button');button.type='button';button.className='location-button';
      button.dataset.distribuidor=d.id;button.setAttribute('aria-pressed','false');
      button.innerHTML=`<span class="location-icon" aria-hidden="true">⌾</span><span class="location-info"><span class="location-name">${safe(d.nombre)}</span><span class="location-place">${safe([d.ciudad,d.pais].filter(Boolean).join(', '))}</span></span><span class="location-arrow" aria-hidden="true">↗</span>`;
      button.setAttribute('aria-label',`Ver ficha de ${d.nombre}`);
      button.addEventListener('click',()=>selectDistributor(d.id,{fly:true}));
      list.append(button);
    }
    if(region==='todos') map.fitBounds(boundsAmerica,{padding:[20,20]});
    else map.fitBounds(L.latLngBounds(filtered.map(d=>[d.lat,d.lng])).pad(.4),{padding:[36,36],maxZoom:5});
  }
  $('close-detail').addEventListener('click',closeDetail);
  document.addEventListener('keydown',event=>{if(event.key==='Escape' && !detail.hidden) closeDetail();});
  copyAllButton.addEventListener('click',()=>{if(current)copyText(printable(current),'Ficha completa copiada');});
  selector.addEventListener('change',render);
  $('reset').addEventListener('click',()=>{selector.value='todos';render();});
  async function load() {
    try {
      const response=await fetch('./data/distribuidores.json',{cache:'no-store'});
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const data=await response.json();
      if(!Array.isArray(data))throw new Error('El JSON debe contener una lista');
      const unique=new Set();
      records=data.filter(isValid).map((d,i)=>({...d,id:String(d.id||`ubicacion-${i}`)})).filter(d=>{
        if(unique.has(d.id))return false;unique.add(d.id);return true;
      }).sort((a,b)=>(a.pais||'').localeCompare(b.pais||'','es')||(a.ciudad||'').localeCompare(b.ciudad||'','es'));
      render();
    }catch(error){
      console.error(error);list.innerHTML='<p class="empty-list">No se pudo cargar el listado.</p>';
      showError('No se pudieron leer los distribuidores. Abrí la página desde un servidor web.');
    }
  }
  load();
})();
