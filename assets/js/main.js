const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const typewriterCards = document.querySelectorAll(".typewriter-text");
let suspendTypewriter = false;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const completeTypewriter = () => {
  typewriterCards.forEach((el) => {
    if (el.dataset.typed === "true") return;
    const text = el.dataset.text || el.textContent;
    el.textContent = text;
    el.dataset.typed = "true";
  });
};

typewriterCards.forEach((el) => {
  const text = el.textContent.trim();
  el.dataset.text = text;
  el.textContent = "";
});

if (prefersReducedMotion) {
  completeTypewriter();
} else {
  const typeObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (suspendTypewriter) return;
        const p = entry.target;
        if (p.dataset.typed === "true") return;
        const text = p.dataset.text || "";
        let i = 0;
        p.dataset.typed = "true";
        const step = () => {
          i += 2;
          p.textContent = text.slice(0, i);
          if (i < text.length) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
        obs.unobserve(p);
      });
    },
    { threshold: 0.4 }
  );

  typewriterCards.forEach((el) => typeObserver.observe(el));
}

const track = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

if (track && prevBtn && nextBtn) {
  const scrollAmount = () => {
    const slide = track.querySelector(".demo-slide");
    return slide ? slide.getBoundingClientRect().width + 24 : 600;
  };

  prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
}

const ctaForm = document.querySelector(".cta-form");
if (ctaForm) {
  const status = ctaForm.querySelector(".form-status");
  const targetFrame = document.querySelector(".form-target");
  let pendingTimer = null;

  ctaForm.addEventListener("submit", () => {
    if (status) status.textContent = "Enviando...";
    if (pendingTimer) clearTimeout(pendingTimer);
    pendingTimer = setTimeout(() => {
      if (status && status.textContent === "Enviando...") {
        status.textContent = "Puede tardar unos segundos. Si no llega, escribinos por WhatsApp.";
      }
    }, 6000);
  });

  if (targetFrame) {
    targetFrame.addEventListener("load", () => {
      if (pendingTimer) clearTimeout(pendingTimer);
      if (status) status.textContent = "Gracias, ya recibimos tu consulta.";
      setTimeout(() => ctaForm.reset(), 400);
    });
  }
}

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      btn.textContent = "Copiado";
      setTimeout(() => { btn.textContent = "Copiar"; }, 1500);
    } catch (error) {
      btn.textContent = "Error";
      setTimeout(() => { btn.textContent = "Copiar"; }, 1500);
    }
  });
});

const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const navOverlay = document.querySelector(".nav-overlay");

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target)) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });

  if (navOverlay) {
    navOverlay.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const anchorLinks = document.querySelectorAll('a[href^="#"]');
if (anchorLinks.length) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getOffset = () => {
    const navEl = document.querySelector(".nav");
    return navEl ? navEl.getBoundingClientRect().height : 0;
  };
  const scrollToHash = (hash, behavior = "auto", offsetOverride = null) => {
    const target = document.querySelector(hash);
    if (!target) return false;
    const isHero = hash === "#inicio" || hash === "#top";
    const offset = offsetOverride !== null ? offsetOverride : getOffset();
    const top = isHero ? 0 : target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior });
    return true;
  };
  let scrollTimeouts = [];
  let anchorInProgress = false;
  let anchorInterrupted = false;
  const clearScrollTimeouts = () => {
    scrollTimeouts.forEach((t) => clearTimeout(t));
    scrollTimeouts = [];
  };
  const interruptAnchor = () => {
    if (!anchorInProgress) return;
    anchorInterrupted = true;
    clearScrollTimeouts();
  };

  window.addEventListener("wheel", interruptAnchor, { passive: true });
  window.addEventListener("touchstart", interruptAnchor, { passive: true });
  window.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
    if (keys.includes(event.key)) interruptAnchor();
  });

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      clearScrollTimeouts();
      anchorInProgress = true;
      anchorInterrupted = false;
      suspendTypewriter = true;
      completeTypewriter();
      scrollToHash(hash, prefersReduced ? "auto" : "smooth");
      // Reajuste para evitar cortes por cargas tardías (fonts/imágenes)
      scrollTimeouts.push(setTimeout(() => {
        if (anchorInterrupted) return;
        scrollToHash(hash, "auto");
      }, 450));
      scrollTimeouts.push(setTimeout(() => {
        if (anchorInterrupted) return;
        scrollToHash(hash, "auto");
        suspendTypewriter = false;
        anchorInProgress = false;
      }, 900));
      history.pushState(null, "", hash);
    });
  });

  const initialHash = window.location.hash;
  if (initialHash) {
    const initialOffset = initialHash === "#cta" || initialHash === "#contact" ? 24 : Math.min(getOffset(), 64);
    requestAnimationFrame(() => {
      scrollToHash(initialHash, "auto", initialOffset);
    });
    window.addEventListener("load", () => {
      scrollToHash(initialHash, "auto", initialOffset);
    });
    setTimeout(() => {
      scrollToHash(initialHash, "auto", initialOffset);
    }, 900);
  }
}

const themeToggle = document.querySelector(".theme-toggle");
const THEME_KEY = "picea-theme";

const applyTheme = (mode) => {
  const isLight = mode === "light";
  document.body.classList.toggle("theme-light", isLight);
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    const icon = themeToggle.querySelector("span");
    if (icon) icon.textContent = isLight ? "☀️" : "🌙";
  }
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch (error) {
    // ignore
  }
};

if (themeToggle) {
  let saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch (error) {
    saved = null;
  }
  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    applyTheme("dark");
  }

  themeToggle.addEventListener("click", () => {
    const next = document.body.classList.contains("theme-light") ? "dark" : "light";
    applyTheme(next);
  });
}

const CONSENT_KEY = "picea-cookie-consent";
const banner = document.getElementById("cookie-banner");
const consentButtons = document.querySelectorAll("[data-cookie-action]");

const getConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch (error) {
    return null;
  }
};

const setConsent = (value) => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch (error) {
    // ignore
  }
};

const getTrackingIds = () => {
  const body = document.body;
  if (!body) return { ga4: "", pixel: "" };
  return {
    ga4: (body.dataset.ga4 || "").trim(),
    pixel: (body.dataset.pixel || "").trim(),
  };
};

const loadGA4 = (id) => {
  if (!id || window.gtag) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
};

const loadPixel = (id) => {
  if (!id || window.fbq) return;
  !(function(f,b,e,v,n,t,s){
    if(f.fbq) return; n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq) f._fbq=n; n.push=n; n.loaded=!0; n.version="2.0";
    n.queue=[]; t=b.createElement(e); t.async=!0;
    t.src=v; s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", id);
  window.fbq("track", "PageView");
};

const loadAnalytics = () => {
  const { ga4, pixel } = getTrackingIds();
  loadGA4(ga4);
  loadPixel(pixel);
};

if (banner) {
  const consent = getConsent();
  if (consent === "accept") {
    loadAnalytics();
  } else if (!consent) {
    banner.classList.add("is-visible");
  }

  consentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.cookieAction;
      if (action === "accept") {
        setConsent("accept");
        loadAnalytics();
      } else {
        setConsent("necessary");
      }
      banner.classList.remove("is-visible");
    });
  });
}
