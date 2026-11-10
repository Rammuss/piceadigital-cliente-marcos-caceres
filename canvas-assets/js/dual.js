/* Picea Digital — selector de vistas. El lienzo permanece aislado. */
(()=>{
 'use strict';
 const app=document.querySelector('.app');
 const canvas=document.getElementById('canvas');
 const classic=document.getElementById('classic-view');
 const chooser=document.getElementById('mode-chooser');
 const chooserClose=document.getElementById('chooser-close');
 const bottomMode=document.getElementById('mobile-bottom-mode');
 const sidebarCopy=document.querySelector('.sidebar-copy');
 const lastFeature=document.querySelector('.sidebar-content .feature:last-child');
 const titleStrong=document.querySelector('.top-title strong');
 const options=[...document.querySelectorAll('[data-view-choice]')];
 const KEY='picea_portfolio_view_preference_v3';
 let current='classic';
 let previousFocus=null;
 function store(mode){try{localStorage.setItem(KEY,mode);}catch(_){}}
 function saved(){try{return localStorage.getItem(KEY);}catch(_){return null;}}
 function closeChooser(){if(chooser.hidden)return;chooser.hidden=true; if(previousFocus&&previousFocus.isConnected){previousFocus.focus({preventScroll:true});}previousFocus=null;}
 function setMode(mode,{remember=true,focus=false}={}){
   if(mode!=='classic'&&mode!=='canvas')return;
   current=mode;
   app.dataset.view=mode;
   if(sidebarCopy)sidebarCopy.textContent=mode==='canvas'?'Arrastrá el plano y usá el zoom para ver los proyectos.':'Algunas páginas web que desarrollamos para negocios y empresas.';
   if(titleStrong)titleStrong.textContent=mode==='canvas'?'Portafolio':'Portafolio';
   if(lastFeature){const title=lastFeature.querySelector('b'),subtitle=lastFeature.querySelector('small');if(title)title.textContent=mode==='canvas'?'Exploración libre':'Dos formas de explorar';if(subtitle)subtitle.textContent=mode==='canvas'?'Arrastrá y hacé zoom':'Clásica o lienzo interactivo';}
   const onCanvas=mode==='canvas';
   canvas.hidden=!onCanvas;canvas.setAttribute('aria-hidden',String(!onCanvas));
   classic.hidden=onCanvas;classic.setAttribute('aria-hidden',String(onCanvas));
   document.querySelector('.skip').href=onCanvas?'#canvas':'#classic-view';
   document.querySelectorAll('.view-switch [data-view-choice]').forEach(b=>{
     const active=b.dataset.viewChoice===mode;
     b.classList.toggle('is-active',active);
     b.setAttribute('aria-pressed',String(active));
   });
   if(bottomMode){
     bottomMode.setAttribute('aria-label',onCanvas?'Cambiar a vista clásica':'Cambiar a vista de lienzo');
     bottomMode.querySelector('span').textContent=onCanvas?'Vista clásica':'Ver lienzo';
   }
   if(remember)store(mode);
   if(onCanvas)document.dispatchEvent(new Event('picea:canvas-shown'));
   if(focus)(onCanvas?canvas:classic).focus({preventScroll:true});
   closeChooser();
 }
 options.forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.viewChoice)));
 bottomMode?.addEventListener('click',()=>setMode(current==='classic'?'canvas':'classic'));
 document.querySelectorAll('[data-open-project]').forEach(button=>button.addEventListener('click',()=>{
   const id=button.dataset.openProject;
   window.PiceaProjects?.openDetail(id);
 }));
 chooserClose?.addEventListener('click',()=>{store('classic');closeChooser();});
 chooser?.querySelector('.mode-chooser-shade')?.addEventListener('click',()=>{store('classic');closeChooser();});
 document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!chooser.hidden){store('classic');closeChooser();return;}
    if(e.key==='Tab'&&!chooser.hidden){
      const buttons=[...chooser.querySelectorAll('button')];
      const first=buttons[0],last=buttons[buttons.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
 });
 const pref=saved();
 // Visitors with a previous preference go directly to that view.
 if(pref==='classic'||pref==='canvas')setMode(pref,{remember:false});
 else{setMode('classic',{remember:false});previousFocus=document.activeElement;chooser.hidden=false;requestAnimationFrame(()=>chooserClose.focus({preventScroll:true}));}
})();
