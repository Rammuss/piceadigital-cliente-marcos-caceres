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

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      suspendTypewriter = true;
      completeTypewriter();
      const top = target.getBoundingClientRect().top + window.pageYOffset - getOffset();
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
      // Reajuste para evitar cortes por cargas tardías (fonts/imágenes)
      setTimeout(() => {
        const newTop = target.getBoundingClientRect().top + window.pageYOffset - getOffset();
        window.scrollTo({ top: newTop, behavior: "auto" });
      }, 450);
      setTimeout(() => {
        const finalTop = target.getBoundingClientRect().top + window.pageYOffset - getOffset();
        window.scrollTo({ top: finalTop, behavior: "auto" });
        suspendTypewriter = false;
      }, 900);
      history.pushState(null, "", hash);
    });
  });
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
