/* Picea Digital — Lienzo plano explorable, JS independiente, sin librerías. */
(() => {
 'use strict';
 const stage=document.querySelector('#canvas');
 const world=document.querySelector('#world');
 const cards=[...document.querySelectorAll('.canvas-card')];
 const projects=JSON.parse(document.querySelector('#project-data').textContent);
 const byId=new Map(projects.map(p=>[p.id,p]));
 const zoomLabel=document.querySelector('#zoom-label');
 const mobileLabel=document.querySelector('#mobile-zoom');
 const mini=document.querySelector('#mini-world');
 const miniViewport=document.querySelector('#mini-viewport');
 const detail=document.querySelector('#detail-panel');
 const backdrop=document.querySelector('#detail-backdrop');
 const detailImg=document.querySelector('#detail-img');
 const screenSwitches=[...document.querySelectorAll('[data-screen]')];
 const W=2100,H=1060;
 const MIN=.14,MAX=2.65;
 let scale=.75,x=0,y=0,initialized=false,raf=0,animation=null,selected=null,screenMode='desktop';
 let lastW=0,lastH=0;
 const pointers=new Map();
 let single=null,pinch=null;
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const size=()=>({w:stage.clientWidth,h:stage.clientHeight});
 const local=(cx,cy)=>{const r=stage.getBoundingClientRect();return {x:cx-r.left,y:cy-r.top};};
 const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 function updateMini(){
   const {w,h}=size();
   const vx=-x/scale,vy=-y/scale;
   miniViewport.style.left=`${vx/W*100}%`;
   miniViewport.style.top=`${vy/H*100}%`;
   miniViewport.style.width=`${w/scale/W*100}%`;
   miniViewport.style.height=`${h/scale/H*100}%`;
 }
 function draw(){
   raf=0;
   world.style.transform=`translate3d(${x}px, ${y}px, 0) scale(${scale})`;
   const dot=28*scale;
   stage.style.backgroundSize=`${dot}px ${dot}px`;
   stage.style.backgroundPosition=`${x}px ${y}px`;
   const label=`${Math.round(scale*100)}%`;
   zoomLabel.textContent=label;
   mobileLabel.textContent=label;
   updateMini();
 }
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(draw);};
 const cancelAnim=()=>{if(animation){cancelAnimationFrame(animation);animation=null;}};
 function camera(nx,ny,ns){x=nx;y=ny;scale=clamp(ns,MIN,MAX);schedule();}
 function animateTo(nx,ny,ns){
   cancelAnim();
   ns=clamp(ns,MIN,MAX);
   const start={x,y,scale};
   const began=performance.now();
   const tick=(now)=>{
      const t=clamp((now-began)/380,0,1);
      const eased=1-Math.pow(1-t,3);
      camera(start.x+(nx-start.x)*eased,start.y+(ny-start.y)*eased,start.scale+(ns-start.scale)*eased);
      if(t<1)animation=requestAnimationFrame(tick);else animation=null;
   };
   animation=requestAnimationFrame(tick);
 }
 function zoomAt(ns,cx,cy,smooth=false){
   const p=local(cx,cy);
   const wx=(p.x-x)/scale,wy=(p.y-y)/scale;
   ns=clamp(ns,MIN,MAX);
   const nx=p.x-wx*ns,ny=p.y-wy*ns;
   if(smooth)animateTo(nx,ny,ns);else camera(nx,ny,ns);
 }
 function fitAll(smooth=true){
   const {w,h}=size();
   const pad=screenIsMobile()?30:76;
   const ns=clamp(Math.min((w-pad*2)/2075,(h-pad*2)/950),MIN,1.2);
   const nx=(w-2075*ns)/2-13*ns;
   const ny=(h-950*ns)/2-55*ns;
   if(smooth)animateTo(nx,ny,ns);else camera(nx,ny,ns);
 }
 const screenIsMobile=()=>window.matchMedia('(max-width:820px)').matches;
 function initial(){
    const {w,h}=size();
    if(screenIsMobile()){
      scale=clamp((w-32)/460,.55,.88);
      x=w/2-(80+230)*scale;
      y=64-92*scale;
    }else{
      scale=clamp(Math.min(.84,w/1350,h/820),.54,.94);
      x=w/2-680*scale;
      y=h/2-490*scale;
    }
    initialized=true;lastW=w;lastH=h;schedule();
 }
 function centerProject(id,zoom){
   const p=byId.get(id);if(!p)return;
   const {w,h}=size();const ns=clamp(zoom||scale,MIN,MAX);
   animateTo(w/2-(p.x+230)*ns,h/2-(p.y+178)*ns,ns);
 }
 function updateSelected(){
   cards.forEach(card=>card.classList.toggle('is-selected',card.dataset.id===selected));
 }
 function setScreen(mode){
   screenMode=mode;
   const p=byId.get(selected);if(!p)return;
   detailImg.src=`canvas-assets/img/${p.id}-${mode}.webp`;
   detailImg.alt=`Captura ${mode==='desktop'?'de escritorio':'móvil'} del proyecto ${p.title}`;
   detail.querySelector('.detail-image').classList.toggle('is-mobile',mode==='mobile');
   screenSwitches.forEach(btn=>{const active=btn.dataset.screen===mode;btn.classList.toggle('selected',active);btn.setAttribute('aria-pressed',String(active));});
 }
 function openDetail(id){
   const p=byId.get(id);if(!p)return;
   selected=p.id;updateSelected();
   document.querySelector('#detail-num').textContent=`${p.code} / 07 — PROYECTO REAL`;
   document.querySelector('#detail-title').textContent=p.title;
   document.querySelector('#detail-desc').textContent=p.note;
   document.querySelector('#detail-cat').textContent=p.cat;
   document.querySelector('#detail-tag').textContent=p.tag;
   document.querySelector('#detail-link').href=p.url;
   setScreen(screenIsMobile()?'mobile':'desktop');
   backdrop.hidden=false;
   detail.inert=false;
   detail.setAttribute('aria-hidden','false');
   detail.classList.add('open');
   document.querySelector('#close-detail').focus({preventScroll:true});
 }
 function closeDetail(){
   if(!selected)return;
   selected=null;updateSelected();
   detail.classList.remove('open');
   detail.setAttribute('aria-hidden','true');
   detail.inert=true;backdrop.hidden=true;
   stage.focus({preventScroll:true});
 }
 document.querySelector('#close-detail').addEventListener('click',closeDetail);
 backdrop.addEventListener('click',closeDetail);
 screenSwitches.forEach(btn=>btn.addEventListener('click',()=>setScreen(btn.dataset.screen)));
 document.querySelector('#fit-btn').addEventListener('click',()=>fitAll(true));
 document.querySelector('#map-fit').addEventListener('click',()=>fitAll(true));
 document.querySelector('#mobile-fit').addEventListener('click',()=>fitAll(true));
 const zoomStep=(direction)=>{const r=stage.getBoundingClientRect();zoomAt(scale*(direction>0?1.24:1/1.24),r.left+r.width/2,r.top+r.height/2,true);};
 document.querySelector('#zoom-in').addEventListener('click',()=>zoomStep(1));
 document.querySelector('#zoom-out').addEventListener('click',()=>zoomStep(-1));
 document.querySelector('#mobile-plus').addEventListener('click',()=>zoomStep(1));
 document.querySelector('#mobile-minus').addEventListener('click',()=>zoomStep(-1));
 const fullscreenBtn=document.querySelector('#fullscreen-btn');
 fullscreenBtn.addEventListener('click',async()=>{
    try {if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch(_){/* browser may disallow fullscreen */}
 });
 stage.addEventListener('wheel',(e)=>{
   if(selected||e.target.closest('.map-box, .mobile-tools'))return;
   e.preventDefault();cancelAnim();
   const multiplier=e.deltaMode===1?17:e.deltaMode===2?120:1;
   zoomAt(scale*Math.exp(-e.deltaY*multiplier*.0015),e.clientX,e.clientY);
 },{passive:false});
 function beginPinch(){
    if(pointers.size<2)return;
    const pts=[...pointers.values()].slice(0,2),center={x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2};
    const l=local(center.x,center.y);
    pinch={initialDist:Math.max(1,dist(pts[0],pts[1])),initialScale:scale,wx:(l.x-x)/scale,wy:(l.y-y)/scale};
    single=null;stage.classList.add('is-dragging');
 }
 stage.addEventListener('pointerdown',e=>{
   if(e.target.closest('.map-box, .mobile-tools, .hint-bar'))return;
   if(e.button!==0 && e.pointerType==='mouse')return;
   cancelAnim();
   pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pointers.size===1){
     single={startX:e.clientX,startY:e.clientY,originX:x,originY:y,drag:false,id:e.target.closest('.canvas-card')?.dataset.id||null};
   }else beginPinch();
   try{stage.setPointerCapture(e.pointerId)}catch(_){}
 });
 stage.addEventListener('pointermove',e=>{
   if(!pointers.has(e.pointerId))return;
   pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pointers.size>=2){
     if(!pinch)beginPinch();
     const pts=[...pointers.values()].slice(0,2);
     const center={x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2};
     const l=local(center.x,center.y);
     const ns=clamp(pinch.initialScale*(dist(pts[0],pts[1])/pinch.initialDist),MIN,MAX);
     camera(l.x-pinch.wx*ns,l.y-pinch.wy*ns,ns);
   }else if(single){
     const dx=e.clientX-single.startX,dy=e.clientY-single.startY;
     if(Math.hypot(dx,dy)>6)single.drag=true;
     if(single.drag){stage.classList.add('is-dragging');camera(single.originX+dx,single.originY+dy,scale);}
   }
 });
 function endPointer(e){
   if(!pointers.has(e.pointerId))return;
   const wasSingle=pointers.size===1;
   const clicked=wasSingle&&single&&!single.drag&&single.id&&e.type==='pointerup';
   const id=clicked?single.id:null;
   pointers.delete(e.pointerId);
   try{if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId)}catch(_){}
   if(pointers.size===1){
      const p=[...pointers.values()][0];
      single={startX:p.x,startY:p.y,originX:x,originY:y,drag:true,id:null};pinch=null;
   }else if(!pointers.size){single=null;pinch=null;stage.classList.remove('is-dragging');}
   if(id)openDetail(id);
 }
 stage.addEventListener('pointerup',endPointer);
 stage.addEventListener('pointercancel',endPointer);
 stage.addEventListener('lostpointercapture',e=>{if(pointers.has(e.pointerId))endPointer(e)});
 cards.forEach(card=>card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(card.dataset.id);}}));
 // Mouse/touch on a minimap location moves the main viewport there.
 mini.addEventListener('click',e=>{
   if(e.target.closest('button[data-jump]')){
     centerProject(e.target.closest('button[data-jump]').dataset.jump,Math.max(scale,.68));return;
   }
   const r=mini.getBoundingClientRect(),wx=clamp((e.clientX-r.left)/r.width,0,1)*W,wy=clamp((e.clientY-r.top)/r.height,0,1)*H;
   const {w,h}=size();animateTo(w/2-wx*scale,h/2-wy*scale,scale);
 });
 document.addEventListener('keydown',e=>{
   if(e.key==='Escape'){closeDetail();return;}
   if(selected||e.target.closest('button,a,input,textarea'))return;
   const step=e.shiftKey?170:80;
   if(e.key==='ArrowLeft'){e.preventDefault();cancelAnim();camera(x+step,y,scale)}
   if(e.key==='ArrowRight'){e.preventDefault();cancelAnim();camera(x-step,y,scale)}
   if(e.key==='ArrowUp'){e.preventDefault();cancelAnim();camera(x,y+step,scale)}
   if(e.key==='ArrowDown'){e.preventDefault();cancelAnim();camera(x,y-step,scale)}
   if(e.key==='+'||e.key==='='){e.preventDefault();zoomStep(1)}
   if(e.key==='-'||e.key==='_'){e.preventDefault();zoomStep(-1)}
   if(e.key==='0'){e.preventDefault();fitAll(true)}
 });
 const onResize=()=>{
    if(!initialized){initial();return;}
    const {w,h}=size();
    if(lastW===w&&lastH===h)return;
    cancelAnim();
    const wx=(lastW/2-x)/scale,wy=(lastH/2-y)/scale;
    camera(w/2-wx*scale,h/2-wy*scale,scale);
    lastW=w;lastH=h;
 };
 new ResizeObserver(onResize).observe(stage);
 // Position minimap buttons in percentage coordinates, no CSS division compatibility issues.
 document.querySelectorAll('.mini-card').forEach(el=>{
    const p=byId.get(el.dataset.jump);
    el.style.left=`${p.x/W*100}%`;el.style.top=`${p.y/H*100}%`;
    el.style.width=`${460/W*100}%`;el.style.height=`${353/H*100}%`;
 });
 initial();
})();
