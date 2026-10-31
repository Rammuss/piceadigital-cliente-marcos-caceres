/* V33: Atlas SVG interactivo, sin WebGL, CDN ni API. Respaldo de MapLibre. */
'use strict';
(() => {
 const NS='http://www.w3.org/2000/svg';
 const W=1200,H=980;
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const merc=lat=>Math.log(Math.tan(Math.PI/4+clamp(lat,-83,83)*Math.PI/360));
 const pt=(lon,lat)=>({x:(lon+171)/149*W,y:(merc(83)-merc(lat))/(merc(83)-merc(-58))*H});
 const VIEWS={todos:{x:0,y:0,w:1200},norte:{x:18,y:5,w:885},central:{x:490,y:445,w:480},sur:{x:605,y:552,w:520}};
 class LocalAmericasMap{
   constructor(holder,onSelect){this.holder=holder;this.onSelect=onSelect;this.items=[];this.pins=new Map();this.view={x:0,y:0,w:W,h:H};this.svg=null;this.layer=null;this.gesture=null;this.mouse=null;this.oneFingerLast=null;this.blockClickUntil=0;this.tapCandidate=null;this.itemById=new Map();}
   async init(){
     const response=await fetch('assets/americas-base.svg',{cache:'force-cache'});
     if(!response.ok)throw Error('No se pudo abrir el mapa vectorial incluido en el ZIP');
     const text=await response.text();
     const parsed=new DOMParser().parseFromString(text,'image/svg+xml').documentElement;
     if(parsed.localName!=='svg')throw Error('Formato SVG inválido');
     this.holder.replaceChildren(document.importNode(parsed,true));
     this.svg=this.holder.querySelector('svg');this.layer=this.svg.querySelector('#vector-marker-layer');
     if(!this.layer){this.layer=document.createElementNS(NS,'g');this.layer.setAttribute('id','vector-marker-layer');this.svg.append(this.layer);}
     this.svg.setAttribute('preserveAspectRatio','xMidYMid meet');
     this.svg.setAttribute('aria-label','Mapa interactivo de América. Dos dedos para mover y ampliar.');
     this.holder.classList.add('v33-svg-active');
     this.paint();this.installGestures();
   }
   normal(v){const w=clamp(v.w,190,W),h=w*H/W;return{x:clamp(v.x,0,W-w),y:clamp(v.y,0,H-h),w,h};}
   paint(){const v=this.view;this.svg?.setAttribute('viewBox',`${v.x.toFixed(2)} ${v.y.toFixed(2)} ${v.w.toFixed(2)} ${v.h.toFixed(2)}`);}
   move(v){this.view=this.normal(v);this.paint();}
   reset(){this.move({x:0,y:0,w:W});}
   region(region){this.move(VIEWS[region]||VIEWS.todos);}
   zoom(factor,point){const v=this.view,w=clamp(v.w*factor,190,W),h=w*H/W;
     const a=point||{x:v.x+v.w/2,y:v.y+v.h/2};
     this.move({x:a.x-(a.x-v.x)*w/v.w,y:a.y-(a.y-v.y)*h/v.h,w});
   }
   focus(item){const p=pt(item.lng,item.lat),w=400,h=w*H/W;this.move({x:p.x-w*.50,y:p.y-h*.48,w});}
   clearSelected(){this.pins.forEach(el=>el.classList.remove('selected'));}
   select(id){this.pins.forEach((el,key)=>el.classList.toggle('selected',key===id));}
   setItems(items){this.items=items;this.itemById=new Map(items.map(item=>[item.id,item]));this.pins.clear();this.layer.replaceChildren();
     for(const item of items){const p=pt(item.lng,item.lat),el=document.createElementNS(NS,'g');
       el.setAttribute('class','map-pin');el.setAttribute('data-pin-id',item.id);el.setAttribute('transform',`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
       el.setAttribute('tabindex','0');el.setAttribute('role','button');
       el.setAttribute('aria-label',`${item.nombre}. Abrir ficha`);
       for(const [r,cls] of [[49,'pin-touch-zone'],[28,'pin-halo'],[15,'pin-ring'],[6,'pin-core']]){
         const c=document.createElementNS(NS,'circle');c.setAttribute('r',r);c.setAttribute('class',cls);el.append(c);
       }
       const t=document.createElementNS(NS,'title');t.textContent=item.nombre;el.append(t);
       el.addEventListener('click',e=>{e.stopPropagation();if(performance.now()<this.blockClickUntil)return;this.onSelect(item);});
       el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();this.onSelect(item);}});
       this.layer.append(el);this.pins.set(item.id,el);
     }
   }
   pointFromScreen(x,y){
     if(!this.svg)return {x:this.view.x+this.view.w/2,y:this.view.y+this.view.h/2};
     const matrix=this.svg.getScreenCTM();
     if(matrix){const p=this.svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(matrix.inverse());}
     return{x:this.view.x+this.view.w/2,y:this.view.y+this.view.h/2};
   }
   beginPinch(touches){const a=touches[0],b=touches[1];const cx=(a.clientX+b.clientX)/2,cy=(a.clientY+b.clientY)/2;
     this.gesture={dist:Math.max(1,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)),w:this.view.w,anchor:this.pointFromScreen(cx,cy)};
     this.oneFingerLast=null;this.holder.closest('.map-pane')?.classList.add('has-touch-explored');
   }
   pinch(touches){if(!this.gesture)this.beginPinch(touches);
     const a=touches[0],b=touches[1],cx=(a.clientX+b.clientX)/2,cy=(a.clientY+b.clientY)/2;
     const w=clamp(this.gesture.w*this.gesture.dist/Math.max(1,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)),190,W);
     const h=w*H/W,r=this.svg.getBoundingClientRect(),sc=Math.min(r.width/w,r.height/h);
     if(!sc)return;
     const lx=r.left+(r.width-w*sc)/2,ly=r.top+(r.height-h*sc)/2;
     this.move({x:this.gesture.anchor.x-(cx-lx)/sc,y:this.gesture.anchor.y-(cy-ly)/sc,w});
   }
   installGestures(){const el=this.svg;
     // Normal mouse drag on desktop, but keep taps on markers interactive.
     el.addEventListener('pointerdown',e=>{
       if(e.pointerType==='touch'||e.button!==0||e.target.closest('.map-pin'))return;
       this.mouse={x:e.clientX,y:e.clientY,view:{...this.view}};
       el.setPointerCapture(e.pointerId);
     });
     el.addEventListener('pointermove',e=>{
       if(!this.mouse)return;
       const r=el.getBoundingClientRect(),v=this.mouse.view;
       const scale=Math.max(v.w/r.width,v.h/r.height);
       this.move({x:v.x-(e.clientX-this.mouse.x)*scale,y:v.y-(e.clientY-this.mouse.y)*scale,w:v.w});
     });
     el.addEventListener('pointerup',()=>{this.mouse=null;});
     el.addEventListener('pointercancel',()=>{this.mouse=null;});
     el.addEventListener('wheel',e=>{
       if(!e.ctrlKey)return; e.preventDefault();this.zoom(e.deltaY>0?1.12:.89,this.pointFromScreen(e.clientX,e.clientY));
     },{passive:false});
     // Mobile Safari: preventing touchstart prevents the browser from synthesizing
     // a click. Detect a short touch on SVG pins explicitly instead of relying
     // on that synthesized click. Do not treat a swipe or a pinch as a tap.
     el.addEventListener('touchstart',e=>{
       if(e.touches.length>=2){
         this.tapCandidate=null;
         this.beginPinch(e.touches);
         this.blockClickUntil=performance.now()+550;
       } else if(e.touches.length===1&&!this.gesture){
         const finger=e.touches[0];
         this.oneFingerLast=finger.clientY;
         const pin=e.target.closest?.('.map-pin');
         this.tapCandidate=pin ? {
           id:pin.dataset.pinId, identifier:finger.identifier,
           x:finger.clientX,y:finger.clientY,
           started:performance.now(), moved:false
         } : null;
       }
       if(e.cancelable)e.preventDefault();
     },{passive:false,capture:true});
     el.addEventListener('touchmove',e=>{
       if(e.touches.length>=2){
         this.tapCandidate=null;
         this.pinch(e.touches);
         this.blockClickUntil=performance.now()+550;
       } else if(e.touches.length===1&&!this.gesture&&this.oneFingerLast!==null){
         const finger=e.touches[0];
         if(this.tapCandidate){
           const distance=Math.hypot(finger.clientX-this.tapCandidate.x,finger.clientY-this.tapCandidate.y);
           if(distance>12)this.tapCandidate.moved=true;
         }
         const dy=this.oneFingerLast-finger.clientY;
         this.oneFingerLast=finger.clientY;
         if(Math.abs(dy)>0)(document.scrollingElement||document.documentElement).scrollTop+=dy;
         if(Math.abs(dy)>6)this.blockClickUntil=performance.now()+200;
       }
       if(e.cancelable)e.preventDefault();
     },{passive:false,capture:true});
     const end=e=>{
       if(e.type==='touchend' && this.tapCandidate && !this.gesture){
         const t=Array.from(e.changedTouches).find(t=>t.identifier===this.tapCandidate.identifier);
         const candidate=this.tapCandidate;
         if(t){
           const distance=Math.hypot(t.clientX-candidate.x,t.clientY-candidate.y);
           // A generous but bounded touch target; prevent accidental open while scrolling.
           if(!candidate.moved && distance<=14 && performance.now()-candidate.started<=850){
             const item=this.itemById.get(candidate.id);
             if(item){
               this.blockClickUntil=performance.now()+850;
               if(e.cancelable)e.preventDefault();
               this.onSelect(item);
             }
           }
         }
       }
       this.tapCandidate=null;
       if(e.touches.length===0){this.gesture=null;this.oneFingerLast=null;}
       else if(e.touches.length===1&&this.gesture){this.oneFingerLast=null;}
     };
     el.addEventListener('touchend',end,{passive:false,capture:true});
     el.addEventListener('touchcancel',end,{passive:false,capture:true});
   }
 }
 window.InteractiveAmericasFallback=LocalAmericasMap;
})();
