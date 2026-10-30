/* GL&AS × Chiaramonte V15
   Scroll-pinned hero via CSS sticky. Animation tied to scroll without requiring
   GSAP or any CDN. The whole hero remains visible until the photo has expanded
   into its full viewport, then the next section scrolls in normally.
*/
'use strict';
(() => {
  const hero=document.querySelector('#inicio.hero');
  const stage=hero?.querySelector('.hero-pin-stage');
  const frame=hero?.querySelector('.hero-visual');
  const photo=hero?.querySelector('.hero-expansion-image');
  const caption=photo?.querySelector('.hero-expansion-caption');
  const image=photo?.querySelector('.hero-expansion-photo');
  const endmark=photo?.querySelector('.hero-expansion-endmark');
  const seal=stage?.querySelector('.hero-expansion-seal-holder');
  if(!hero || !stage || !frame || !photo || !matchMedia) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches) return;
  hero.classList.add('has-hero-pin');
  let ticking=false;
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smoother=t=>t*t*(3-2*t);

  function paint(){
    ticking=false;
    const screen=stage.getBoundingClientRect();
    const original=frame.getBoundingClientRect();
    const heroRect=hero.getBoundingClientRect();
    const available=Math.max(1,hero.offsetHeight-stage.offsetHeight);
    const progress=clamp((-heroRect.top)/available);
    // Most of the pin interval is the opening; 15% holds the full image.
    const progressOpen=clamp(progress/.85);
    const t=smoother(progressOpen);
    const left=original.left-screen.left;
    const top=original.top-screen.top;
    const width=original.width;
    const height=original.height;
    if(seal){
      // Floating seal remains outside the photo clipping mask.
      const plaque=seal.firstElementChild;
      const badgeWidth=plaque?.offsetWidth || (innerWidth<=680?143:190);
      const sealLeft=innerWidth<=680 ? left+8 : left+width-badgeWidth*.52;
      const sealTop=innerWidth<=680 ? top+height*.07 : top+height*.095;
      seal.style.left=sealLeft.toFixed(2)+'px';
      seal.style.top=sealTop.toFixed(2)+'px';
    }
    photo.style.left=mix(left,0,t).toFixed(2)+'px';
    photo.style.top=mix(top,0,t).toFixed(2)+'px';
    photo.style.width=mix(width,screen.width,t).toFixed(2)+'px';
    photo.style.height=mix(height,screen.height,t).toFixed(2)+'px';
    const rounding=clamp(1-t);
    const rTop=Math.min(width*.33,195)*rounding;
    const rBottom=Math.min(width*.105,64)*rounding;
    photo.style.borderRadius=`${rTop.toFixed(2)}px ${rTop.toFixed(2)}px ${rBottom.toFixed(2)}px ${rBottom.toFixed(2)}px`;
    photo.style.borderColor=`rgba(225,193,124,${(.38*(1-t)).toFixed(3)})`;
    if(image && innerWidth<=680){
      // Keep the chef centered as the landscape photo expands into a portrait viewport.
      image.style.objectPosition=`${mix(66,70,t).toFixed(2)}% center`;
    } else if(image){image.style.objectPosition=`${mix(67,50,t).toFixed(2)}% center`;}
    // Copy fades *after* the image starts opening, never before.
    const copyAlpha=1-smoother(clamp((progressOpen-.16)/.44));
    const layout=stage.querySelector('.hero-layout');
    const footer=stage.querySelector('.hero-footer');
    const circles=stage.querySelectorAll('.hero-circle');
    if(layout) layout.style.opacity=String(copyAlpha);
    if(footer) footer.style.opacity=String(copyAlpha);
    circles.forEach(c=>c.style.opacity=String(1-smoother(clamp(progressOpen/.7))));
    if(caption){caption.style.opacity=String(1-smoother(clamp((progressOpen-.15)/.48)));}
    if(seal){seal.style.opacity=String(1-smoother(clamp((progressOpen-.30)/.44)));}
    if(endmark){
      const a=smoother(clamp((progressOpen-.75)/.25));
      endmark.style.opacity=String(a);
      endmark.style.transform=`translateY(${mix(15,0,a).toFixed(2)}px)`;
    }
    hero.dataset.revealProgress=progressOpen.toFixed(3);
  }
  function schedule(){if(!ticking){ticking=true;requestAnimationFrame(paint);}}
  // Enable only after the first paint so the fallback portrait never disappears early.
  photo.style.display='block';
  paint();
  hero.classList.add('hero-effect-ready');
  // Start only after the overlay geometry is initialized. CSS controls the
  // same 1.6–2s cadence on every reload, including with cached imagery.
  const launchIntro=() => {
    if ((Number(hero.dataset.revealProgress)||0) > .04) {
      hero.classList.add('hero-intro-skip');
    } else {
      requestAnimationFrame(() => hero.classList.add('hero-intro-play'));
    }
  };
  const cover=photo.querySelector('img');
  if(cover && !cover.complete){
    cover.addEventListener('load',launchIntro,{once:true});
    cover.addEventListener('error',launchIntro,{once:true});
  } else launchIntro();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',schedule,{passive:true});
  document.fonts?.ready.then(schedule);
  window.addEventListener('load',schedule,{once:true});
})();
