document.addEventListener('DOMContentLoaded',()=>{
  const refreshIcons=()=>{
    if(window.lucide) window.lucide.createIcons({attrs:{'stroke-width':1.8}});
  };
  refreshIcons();

  // ScrollTrigger: entradas escalonadas para cards y badges al llegar a cada bloque.
  const setupScrollAnimations=()=>{
    if(!window.gsap || !window.ScrollTrigger) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.major-section .cards').forEach((grid)=>{
      const items=[...grid.querySelectorAll(':scope > .card')];
      if(!items.length) return;

      gsap.set(items,{
        autoAlpha:0,
        x:(i)=>i%2===0?-38:38,
        y:24,
        scale:.975
      });

      ScrollTrigger.create({
        trigger:grid,
        start:'top 86%',
        once:true,
        onEnter:()=>{
          gsap.to(items,{
            autoAlpha:1,
            x:0,
            y:0,
            scale:1,
            duration:.62,
            stagger:.11,
            ease:'power3.out',
            clearProps:'transform,opacity,visibility'
          });
        }
      });
    });

    const badges=[...document.querySelectorAll('.sector-badges > span')];
    if(badges.length){
      gsap.set(badges,{autoAlpha:0,y:15,scale:.94});
      ScrollTrigger.create({
        trigger:'.sector-badges',
        start:'top 90%',
        once:true,
        onEnter:()=>gsap.to(badges,{
          autoAlpha:1,
          y:0,
          scale:1,
          duration:.42,
          stagger:.055,
          ease:'back.out(1.35)',
          clearProps:'transform,opacity,visibility'
        })
      });
    }

    // En cada sección el planeta reaparece por la izquierda, cruza por detrás
    // del contenido y vuelve a desaparecer por la derecha.
    const cinematicSections=[...document.querySelectorAll('.major-section')];
    cinematicSections.forEach((section,index)=>{
      const planet=document.createElement('img');
      planet.className='section-world';
      planet.src='assets/img/hero-world.webp';
      planet.alt='';
      planet.setAttribute('aria-hidden','true');
      section.prepend(planet);

      const travel=()=>window.innerWidth + Math.max(planet.offsetWidth*.72,480);
      const peakOpacity=window.innerWidth<=680 ? .10 : (window.innerWidth<=1080 ? .13 : .17);

      const tl=gsap.timeline({
        scrollTrigger:{
          trigger:section,
          start:'top 88%',
          end:'bottom 14%',
          scrub:1.15,
          invalidateOnRefresh:true
        }
      });

      gsap.set(planet,{x:0,autoAlpha:0,rotate:-5,scale:.88});
      tl.to(planet,{
        autoAlpha:peakOpacity,
        x:()=>travel()*.22,
        rotate:-2,
        scale:.94,
        duration:.22,
        ease:'none'
      })
      .to(planet,{
        autoAlpha:peakOpacity,
        x:()=>travel()*.62,
        rotate:2,
        scale:1,
        duration:.50,
        ease:'none'
      })
      .to(planet,{
        autoAlpha:0,
        x:()=>travel(),
        rotate:7,
        scale:.94,
        duration:.28,
        ease:'none'
      });
    });
  };

  // Planeta del hero: la posición vertical vive en .hero-world-anchor, el scroll
  // mueve únicamente .hero-world-motion y la flotación vive en la imagen interna.
  // Así no hay dos tweens peleándose por el mismo transform.
  let heroWorldExitTimeline=null;
  let heroWorldExitTrigger=null;
  let heroWorldFloatTween=null;

  const getHeroWorldOpacity=(anchor)=>{
    const raw=getComputedStyle(anchor).getPropertyValue('--hero-world-opacity').trim();
    const value=parseFloat(raw);
    return Number.isFinite(value)?value:.92;
  };

  const setupHeroWorldScroll=(hero,anchor,motion)=>{
    if(!hero || !anchor || !motion || !window.gsap || !window.ScrollTrigger) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    if(heroWorldExitTrigger){
      heroWorldExitTrigger.kill();
      heroWorldExitTrigger=null;
    }
    if(heroWorldExitTimeline){
      heroWorldExitTimeline.kill();
      heroWorldExitTimeline=null;
    }

    const baseOpacity=getHeroWorldOpacity(anchor);
    const exitDistance=()=>Math.max(window.innerWidth*.46,460);

    // Siempre reconstruye exactamente la posición visual inicial.
    gsap.set(motion,{x:0,autoAlpha:baseOpacity,scale:1,rotate:0});

    heroWorldExitTimeline=gsap.timeline({paused:true});
    // Primer 14% del recorrido: el planeta permanece quieto. Evita que desaparezca
    // con el primer toque de rueda del mouse.
    heroWorldExitTimeline
      .to(motion,{x:0,autoAlpha:baseOpacity,scale:1,rotate:0,duration:.18,ease:'none'})
      .to(motion,{
        x:()=>exitDistance(),
        autoAlpha:0,
        scale:.96,
        rotate:4,
        duration:.82,
        ease:'none'
      });

    heroWorldExitTrigger=ScrollTrigger.create({
      id:'hero-world-exit',
      trigger:hero,
      start:'top top',
      end:'bottom top',
      animation:heroWorldExitTimeline,
      scrub:true,
      invalidateOnRefresh:true,
      onRefresh:(self)=>{
        // En scroll 0, fuerza de nuevo el estado exacto del diseño original.
        if(self.progress<=.001){
          gsap.set(motion,{x:0,autoAlpha:baseOpacity,scale:1,rotate:0});
        }
      },
      onUpdate:(self)=>{
        if(self.progress<=.001){
          gsap.set(motion,{x:0,autoAlpha:baseOpacity,scale:1,rotate:0});
        }
      }
    });

    ScrollTrigger.refresh();
    ScrollTrigger.update();
  };

  // Navbar transparente sobre el hero; toma fondo solo después de iniciar el scroll.
  const header=document.querySelector('.site-header');
  if(header){
    const syncHeader=()=>header.classList.toggle('scrolled',window.scrollY>24);
    syncHeader();
    window.addEventListener('scroll',syncHeader,{passive:true});
  }

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  const toggle=document.querySelector('.menu-toggle');
  const mobile=document.querySelector('[data-mobile-nav]');
  if(toggle&&mobile){
    const setMenuIcon=(open)=>{
      toggle.innerHTML=`<i data-lucide="${open?'x':'menu'}" aria-hidden="true"></i>`;
      toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
      refreshIcons();
    };
    toggle.addEventListener('click',()=>{
      const open=mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
      setMenuIcon(open);
    });
    mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      mobile.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      setMenuIcon(false);
    }));
  }

  const select=document.querySelector('select[name="area"]');
  document.querySelectorAll('[data-area]').forEach(btn=>btn.addEventListener('click',()=>{
    if(select) select.value=btn.dataset.area;
  }));

  // Secciones posteriores al hero.
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting)e.target.classList.add('visible');
  }),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  const sections=[...document.querySelectorAll('main section[id]')];
  const nav=[...document.querySelectorAll('.desktop-nav a')];
  const scrollSpy=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        nav.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
      }
    });
  },{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(s=>scrollSpy.observe(s));

  const contactForm=document.querySelector('#contacto .form');
  if(contactForm){
    contactForm.addEventListener('submit',e=>{
      e.preventDefault();
    });
  }

  function splitHeroTitle(){
    const title=document.querySelector('.hero-title');
    if(!title || title.dataset.split==='true') return [];
    const text=title.textContent;
    title.textContent='';
    [...text].forEach((ch,index)=>{
      const span=document.createElement('span');
      span.className='char';
      span.dataset.index=String(index);
      span.textContent=ch===' ' ? '\u00A0' : ch;
      title.appendChild(span);
    });
    title.dataset.split='true';
    return [...title.querySelectorAll('.char')];
  }

  function showWithoutAnimation(){
    document.documentElement.classList.remove('animations-pending');
    document.querySelectorAll('.hero-title .char,.logo-stage,.hero-kicker,.hero-lead,.service-card,.scroll-hint,.hero-world-motion,.hero-world,.brand,.partner-link,.menu-toggle').forEach(el=>{
      el.style.opacity='';
      el.style.visibility='';
      el.style.transform='';
    });
  }

  function runHeroIntro(){
    const hero=document.querySelector('.hero-home');
    if(!hero) return showWithoutAnimation();

    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced || !window.gsap) return showWithoutAnimation();

    const title=document.querySelector('.hero-title');
    const chars=splitHeroTitle();
    const worldAnchor=document.querySelector('.hero-world-anchor');
    const worldMotion=document.querySelector('.hero-world-motion');
    const world=document.querySelector('.hero-world');
    const logo=document.querySelector('.logo-stage');
    const kicker=document.querySelector('.hero-kicker');
    const lead=document.querySelector('.hero-lead');
    const cards=[...document.querySelectorAll('.hero-home .service-card')];
    const hint=document.querySelector('.hero-home .scroll-hint');
    const brand=document.querySelector('.site-header .brand');
    const partner=document.querySelector('.site-header .partner-link');
    const menuBtn=document.querySelector('.site-header .menu-toggle');

    // El título completo queda oculto por CSS hasta que ya fue dividido en letras.
    gsap.set(title,{autoAlpha:1});

    const tl=gsap.timeline({
      defaults:{ease:'power3.out'},
      onComplete:()=>{
        document.documentElement.classList.remove('animations-pending');
        hero.classList.remove('animating');
        gsap.set([title,brand,partner,menuBtn,worldMotion,logo,...chars,kicker,lead,...cards,hint].filter(Boolean),{clearProps:'visibility'});

        if(world && worldAnchor && worldMotion){
          if(heroWorldFloatTween) heroWorldFloatTween.kill();
          heroWorldFloatTween=gsap.to(world,{
            y:10,
            duration:4.8,
            repeat:-1,
            yoyo:true,
            ease:'sine.inOut'
          });
          setupHeroWorldScroll(hero,worldAnchor,worldMotion);
        }
      }
    });

    // Estado de arranque fuerte: cada bloque viene de un costado diferente.
    gsap.set(brand,{autoAlpha:0,x:-52});
    gsap.set(partner,{autoAlpha:0,x:52});
    if(menuBtn) gsap.set(menuBtn,{autoAlpha:0,x:34});
    const worldBaseOpacity=worldAnchor?getHeroWorldOpacity(worldAnchor):.92;
    gsap.set(worldMotion,{autoAlpha:0,x:360,scale:.9,rotate:-7,transformOrigin:'55% 50%'});
    if(world) gsap.set(world,{y:0});
    gsap.set(chars,{autoAlpha:0,x:(i)=>i<chars.length/2?-70:70,y:10,rotate:(i)=>i<chars.length/2?-2:2});
    gsap.set(logo,{autoAlpha:0,x:85,scale:.95});
    gsap.set(kicker,{autoAlpha:0,x:-90});
    gsap.set(lead,{autoAlpha:0,x:90});
    cards.forEach((card,i)=>gsap.set(card,{autoAlpha:0,x:i<3?-70:70,y:14,scale:.97}));
    gsap.set(hint,{autoAlpha:0,y:20});

    hero.classList.add('animating');

    tl.to(brand,{autoAlpha:1,x:0,duration:.62},0)
      .to(partner,{autoAlpha:1,x:0,duration:.62},0.08)
      .to(menuBtn,{autoAlpha:1,x:0,duration:.55},0.12)
      .to(worldMotion,{autoAlpha:worldBaseOpacity,x:0,scale:1,rotate:0,duration:1.3,ease:'power4.out'},0.05)
      .to(chars,{autoAlpha:1,x:0,y:0,rotate:0,duration:.72,stagger:.045},0.34)
      .to(logo,{autoAlpha:1,x:0,scale:1,duration:.82},0.52)
      .to(kicker,{autoAlpha:1,x:0,duration:.68},0.78)
      .to(lead,{autoAlpha:1,x:0,duration:.68},0.92)
      .to(cards,{autoAlpha:1,x:0,y:0,scale:1,duration:.52,stagger:.11},1.02)
      .to(hint,{autoAlpha:1,y:0,duration:.48},1.62);
  }

  // Espera a que imágenes, fuentes y CDN estén realmente disponibles para que la entrada se vea.
  if(document.readyState==='complete'){
    requestAnimationFrame(()=>requestAnimationFrame(runHeroIntro));
  }else{
    window.addEventListener('load',()=>requestAnimationFrame(()=>requestAnimationFrame(runHeroIntro)),{once:true});
  }

  // Animaciones de contenido al hacer scroll.
  setupScrollAnimations();

  // Fallback de seguridad: jamás dejar contenido oculto si el CDN falla.
  setTimeout(()=>{
    if(document.documentElement.classList.contains('animations-pending') && !window.gsap){
      showWithoutAnimation();
    }
  },2500);
});

// V31 — copiar teléfono desde la sección de contacto.
document.addEventListener('DOMContentLoaded',()=>{
  const copyButton=document.querySelector('[data-copy-phone]');
  if(!copyButton) return;

  const feedback=copyButton.closest('.contact-info-content')?.querySelector('.copy-feedback');
  const phone=copyButton.dataset.copyPhone || '+595994257076';

  const setCopiedState=()=>{
    copyButton.innerHTML='<i data-lucide="check" aria-hidden="true"></i>';
    copyButton.setAttribute('aria-label','Número copiado');
    if(feedback) feedback.textContent='Número copiado';
    if(window.lucide) window.lucide.createIcons({attrs:{'stroke-width':1.8}});
    window.setTimeout(()=>{
      copyButton.innerHTML='<i data-lucide="copy" aria-hidden="true"></i>';
      copyButton.setAttribute('aria-label','Copiar número de teléfono');
      if(feedback) feedback.textContent='';
      if(window.lucide) window.lucide.createIcons({attrs:{'stroke-width':1.8}});
    },1800);
  };

  copyButton.addEventListener('click',async()=>{
    try{
      await navigator.clipboard.writeText(phone);
      setCopiedState();
    }catch(err){
      const input=document.createElement('input');
      input.value=phone;
      input.style.position='fixed';
      input.style.opacity='0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      setCopiedState();
    }
  });
});
