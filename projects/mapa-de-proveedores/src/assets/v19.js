/* V19 — Section-aware navigation and on-arrival image reveal.
   No CDN required; old GSAP image animations were removed to avoid duplicate triggers. */
'use strict';
(() => {
  const nav=document.querySelector('#main-nav');
  const links=[...(nav?.querySelectorAll('a[data-nav-link]')||[])];
  const sections=[...document.querySelectorAll('main > section[id]')];
  const mapToNav={
    'inicio':'inicio','propuesta-en-cifras':'inicio',
    'filosofia':'ventajas','ventajas':'ventajas',
    'certificaciones':'certificaciones','proceso':'certificaciones',
    'chef':'chef','capacitacion':'capacitacion',
    'experiencia':'capacitacion','representantes':'representantes',
    'contacto':'contacto'
  };
  const hero=document.querySelector('#inicio');
  const navShell=document.querySelector('.nav-shell');
  const cta=document.querySelector('.nav-cta');
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  let raf=0;
  function updateActive(){
    raf=0;
    const readY=innerHeight*.43;
    let chosen='inicio';
    for(const el of sections){
      if(el.getBoundingClientRect().top <= readY){
        chosen=mapToNav[el.id]||chosen;
      }
    }
    for(const link of links){
      const active=link.dataset.navLink===chosen;
      link.classList.toggle('nav-active',active);
      if(active)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    }
    cta?.classList.toggle('is-active',chosen==='contacto');
    if(navShell){
      const maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      navShell.style.setProperty('--scroll-progress',clamp(scrollY/maxScroll,0,1).toFixed(4));
      navShell.classList.toggle('nav-scrolled',scrollY>50);
    }
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(updateActive);}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('hashchange',schedule,{passive:true});
  document.fonts?.ready.then(schedule);
  updateActive();

  // Photo reveals now belong exclusively to v21.js (scroll-controlled).
})();
