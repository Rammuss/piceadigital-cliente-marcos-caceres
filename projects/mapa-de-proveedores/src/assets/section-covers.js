/* V8 · Scroll-linked morphing borders with reserved clearance.
   No sticky/pin/scroll snap, no overlap of text or controls. */
'use strict';
(() => {
  const sections = Array.from(document.querySelectorAll('main > section'));
  const first = sections.findIndex(s => s.id === 'ventajas');
  if (first < 1) return;
  const presets = [
    {name:'Ventajas',skin:'cover-parchment',shape:'wave'},
    {name:'Certificaciones',skin:'cover-ivory',shape:'crest'},
    {name:'El proceso',skin:'cover-ink',shape:'terrace'},
    {name:'El chef',skin:'cover-chef',shape:'arch'},
    {name:'Capacitación',skin:'cover-cream',shape:'valley'},
    {name:'Experiencias',skin:'cover-milk',shape:'facets'},
    {name:'Representantes',skin:'cover-slate',shape:'wave2'},
    {name:'Próximo paso',skin:'cover-ink',shape:'softarch'},
    {name:'Contacto',skin:'cover-contact',shape:'arch2'}
  ];
  const clamp = (v,min,max) => Math.min(max,Math.max(min,v));
  const lerp = (a,b,t) => a + (b-a)*t;
  // V10: every silhouette is mirrored exactly around the center of the
  // viewport (x=720/1440). No diagonal ramps, off-center waves or uneven tips.
  // The new section keeps its own reserved clearance as in V8/V9.
  function target(shape,x){
    const t=clamp(x/1440,0,1);
    const dome=Math.sin(Math.PI*t);
    const twin=Math.sin(2*Math.PI*t);
    const radial=Math.abs(2*t-1); // 0 = center, 1 = either edge
    const smooth=v=>v*v*(3-2*v);
    switch(shape){
      case 'wave': // an even, shallow scallop centered in the page
        return 108-48*Math.pow(dome,1.8);
      case 'crest': // tall but balanced rising arch
        return 112-83*Math.pow(dome,1.25);
      case 'terrace': { // equal shoulders and a flat central crown
        const rise=smooth(clamp((1-radial)/.68,0,1));
        return 109-71*rise;
      }
      case 'arch': // broad centered dome
        return 114-100*Math.pow(dome,1.05);
      case 'valley': // symmetric low middle: sides rise evenly
        return 34+77*Math.pow(dome,1.6);
      case 'facets': { // symmetric geometric trapezoid, equal left/right angles
        const rise=smooth(clamp((1-radial)/.72,0,1));
        return 108-76*rise;
      }
      case 'wave2': // two equally spaced side lobes
        return 101-53*Math.pow(twin,2);
      case 'softarch': // discreet arc for quiet sections
        return 101-52*Math.pow(dome,1.7);
      case 'arch2': // rounded centered arch, slightly softer than main arch
        return 101-64*Math.pow(dome,1.3);
      default: return 100-44*Math.pow(dome,1.5);
    }
  }
  function buildPath(shape,p,fill){
    // Morph from a flat lower edge into a custom chapter silhouette. Every
    // scroll tick alters the actual SVG geometry, not just its opacity.
    const segments=64;
    let d='';
    for(let i=0;i<=segments;i++){
      const x=1440*i/segments;
      const y=lerp(136,target(shape,x),p);
      d+=(i?' L':'M')+x.toFixed(1)+' '+y.toFixed(2);
    }
    return fill?d+' L1440 136 L0 136 Z':d;
  }
  const chapters=[];
  sections.slice(first).forEach((section,i) => {
    const config=presets[Math.min(i,presets.length-1)];
    section.classList.add('cover-chapter',config.skin);
    section.style.setProperty('--cover-order',String(20+i));
    const before=sections[first+i-1];
    if(before && !before.querySelector(':scope > .section-transition-clearance')){
      const spacer=document.createElement('div');
      spacer.className='section-transition-clearance';
      spacer.setAttribute('aria-hidden','true');
      before.appendChild(spacer);
    }
    const edge=document.createElement('div');
    edge.className='section-cover-edge';
    edge.setAttribute('aria-hidden','true');
    edge.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 136" preserveAspectRatio="none" role="presentation">
      <path class="cover-surface"/><path class="cover-stroke-soft"/><path class="cover-stroke"/>
    </svg>`;
    section.prepend(edge);
    const nodes=edge.querySelectorAll('path');
    chapters.push({section,edge,config,nodes,last:-1});
  });
  // Size each reserved strip based on the previous section's EXISTING bottom
  // padding. That padding already keeps text away; don't add a second huge gap.
  // Guarantee a safe boundary depth (plus legibility clearance) on any viewport.
  function sizeClearances(){
    const mobile=innerWidth <= 680;
    const tablet=innerWidth <= 980;
    const required=mobile?102:(tablet?132:160);
    const min=mobile?16:(tablet?22:28);
    for(const {section} of chapters){
      const previous=section.previousElementSibling;
      const spacer=previous?.querySelector(':scope > .section-transition-clearance');
      if(!spacer)continue;
      const pad=parseFloat(getComputedStyle(previous).paddingBottom)||0;
      const needed=Math.max(min, required-pad);
      spacer.style.setProperty('--seam-clearance',needed.toFixed(0)+'px');
    }
  }
  sizeClearances();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let running=false;
  function update(){
    running=false;
    const vh=window.innerHeight;
    for(const chapter of chapters){
      const top=chapter.section.getBoundingClientRect().top;
      // Starts before the seam becomes visible and finishes while entering the
      // center of the viewport. Reversible while scrolling upward.
      const raw=clamp((vh*1.03-top)/(vh*.72),0,1);
      const eased=reduced?1:raw*raw*(3-2*raw);
      const quant=Math.round(eased*160)/160;
      if(quant===chapter.last) continue;
      chapter.last=quant;
      const stroke=buildPath(chapter.config.shape,quant,false);
      chapter.nodes[0].setAttribute('d',buildPath(chapter.config.shape,quant,true));
      chapter.nodes[1].setAttribute('d',stroke);
      chapter.nodes[1].setAttribute('transform','translate(0 4)');
      chapter.nodes[2].setAttribute('d',stroke);
      chapter.edge.style.setProperty('--edge-lift',(reduced?0:(1-eased)*17).toFixed(1)+'px');
    }
  }
  function request(){ if(!running){running=true;requestAnimationFrame(update);} }
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',()=>{sizeClearances();request();},{passive:true});
  request();

  // Retain V7's tested copy buttons in desktop contact and mobile burger.
  const toast=document.getElementById('toast');
  let timer;
  function notify(msg){ if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),2200); }
  async function copyValue(value){
    try{
      if(navigator.clipboard?.writeText && isSecureContext){await navigator.clipboard.writeText(value);}
      else{
        const input=document.createElement('textarea');input.value=value;input.setAttribute('readonly','');
        input.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';
        document.body.appendChild(input);input.select();
        const copied=document.execCommand('copy');input.remove();
        if(!copied)throw new Error('Clipboard unavailable');
      }
      notify('Dato copiado');
    }catch(e){notify('No se pudo copiar: seleccioná el dato manualmente');}
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('button[data-copy]');
    if(b){e.preventDefault();copyValue(b.dataset.copy);}
  });
})();
