const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (nav) {
  const toggleNav = () => {
    nav.classList.toggle("nav-solid", window.scrollY > 10);
  };

  toggleNav();
  window.addEventListener("scroll", toggleNav, { passive: true });
}

if (navToggle && navLinks) {
  const closeNav = () => {
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("is-open")) return;
    if (navLinks.contains(event.target) || navToggle.contains(event.target)) return;
    closeNav();
  });
}

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      btn.textContent = "Copiado";
      setTimeout(() => {
        btn.textContent = "Copiar";
      }, 1500);
    } catch (error) {
      btn.textContent = "Error";
      setTimeout(() => {
        btn.textContent = "Copiar";
      }, 1500);
    }
  });
});

const waTrigger = document.querySelector("[data-wa-trigger]");
const waModal = document.querySelector(".wa-modal");

if (waTrigger && waModal) {
  const setModalState = (isOpen) => {
    waModal.classList.toggle("is-open", isOpen);
    waModal.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      waModal.removeAttribute("inert");
    } else {
      waModal.setAttribute("inert", "");
    }
  };

  setModalState(false);

  waTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    setModalState(true);
  });

  waModal.querySelectorAll(".wa-close, .wa-cancel").forEach((btn) => {
    btn.addEventListener("click", () => setModalState(false));
  });

  waModal.addEventListener("click", (event) => {
    if (event.target === waModal) setModalState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && waModal.classList.contains("is-open")) {
      setModalState(false);
    }
  });
}

const revealItems = document.querySelectorAll(".reveal-up");
if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const processTimeline = document.querySelector(".process-timeline");
if (processTimeline) {
  const processObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          processObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  processObserver.observe(processTimeline);
}

const initInfiniteMarquee = ({
  track,
  itemSelector,
  mobileOnly = false,
  speed = 0.35
}) => {
  if (!track) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 640px)");
  let rafId = null;
  let running = false;
  let dragging = false;
  let x = 0;
  let loopWidth = 0;
  let startX = 0;
  let startOffset = 0;
  let shouldRun = false;

  const normalize = (value) => {
    if (loopWidth <= 0) return 0;
    let normalized = value % loopWidth;
    if (normalized < 0) normalized += loopWidth;
    return normalized;
  };

  const computeWidth = () => {
    const originals = track.querySelectorAll(itemSelector);
    if (!originals.length) {
      loopWidth = 0;
      return;
    }
    const gap = parseFloat(getComputedStyle(track).gap || "0");
    loopWidth = Array.from(originals).reduce((sum, item) => sum + item.offsetWidth, 0) + gap * (originals.length - 1);
  };

  const draw = () => {
    track.style.transform = `translateX(${-normalize(x)}px)`;
  };

  const step = () => {
    if (!running) return;
    if (!dragging) {
      x = normalize(x + speed);
      draw();
    }
    rafId = requestAnimationFrame(step);
  };

  const start = () => {
    if (!shouldRun || loopWidth <= 0 || running) return;
    track.style.animation = "none";
    running = true;
    rafId = requestAnimationFrame(step);
  };

  const stop = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  };

  const refresh = () => {
    stop();
    computeWidth();
    x = normalize(x);
    draw();
    start();
  };

  const syncEnabled = () => {
    const baseEnabled = !prefersReduced.matches && !document.hidden;
    shouldRun = mobileOnly ? baseEnabled && mobileQuery.matches : baseEnabled;
    if (!shouldRun) stop();
    else start();
  };

  const getClientX = (event) => {
    if ("touches" in event && event.touches.length) return event.touches[0].clientX;
    if ("changedTouches" in event && event.changedTouches.length) return event.changedTouches[0].clientX;
    return event.clientX;
  };

  const onDragStart = (event) => {
    if (!shouldRun || loopWidth <= 0) return;
    dragging = true;
    startX = getClientX(event);
    startOffset = x;
    stop();
  };

  const onDragMove = (event) => {
    if (!dragging || loopWidth <= 0) return;
    const dx = getClientX(event) - startX;
    x = normalize(startOffset - dx);
    draw();
    if ("touches" in event) {
      event.preventDefault();
    }
  };

  const onDragEnd = () => {
    if (!dragging) return;
    dragging = false;
    start();
  };

  track.addEventListener("mousedown", onDragStart);
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", onDragEnd);

  track.addEventListener("touchstart", onDragStart, { passive: true });
  track.addEventListener("touchmove", onDragMove, { passive: false });
  track.addEventListener("touchend", onDragEnd, { passive: true });
  track.addEventListener("touchcancel", onDragEnd, { passive: true });

  track.addEventListener("mouseenter", stop);
  track.addEventListener("mouseleave", () => {
    if (!dragging) start();
  });

  window.addEventListener("resize", refresh, { passive: true });
  window.addEventListener("orientationchange", refresh, { passive: true });
  document.addEventListener("visibilitychange", () => {
    syncEnabled();
    if (shouldRun) refresh();
  });
  if (mobileOnly) {
    mobileQuery.addEventListener("change", () => {
      syncEnabled();
      refresh();
    });
  }
  prefersReduced.addEventListener("change", () => {
    syncEnabled();
    refresh();
  });

  syncEnabled();
  refresh();
};

initInfiniteMarquee({
  track: document.querySelector(".benefits-row"),
  itemSelector: ".benefit-item:not(.benefit-dup)",
  mobileOnly: true,
  speed: 0.4
});

initInfiniteMarquee({
  track: document.querySelector(".testimonials-track"),
  itemSelector: ".testimonial-card:not([aria-hidden=\"true\"])",
  speed: 0.25
});
