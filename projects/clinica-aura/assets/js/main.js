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
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("is-open")) return;
    if (navLinks.contains(event.target) || navToggle.contains(event.target)) return;
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
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

const waTrigger = document.querySelector("[data-wa-trigger]");
const waModal = document.querySelector(".wa-modal");

if (waTrigger && waModal) {
  const closeModal = () => waModal.classList.remove("is-open");
  waTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    waModal.classList.add("is-open");
  });
  waModal.querySelectorAll(".wa-close").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });
  waModal.querySelectorAll(".wa-cancel").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });
  waModal.addEventListener("click", (event) => {
    if (event.target === waModal) closeModal();
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

const benefitsRow = document.querySelector(".benefits-row");
if (benefitsRow) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mediaQuery = window.matchMedia("(max-width: 640px)");
  let rafId = null;
  let running = false;
  let x = 0;
  let width = 0;
  let isDragging = false;
  let startX = 0;
  let startOffset = 0;

  const startMarquee = () => {
    if (prefersReduced || !mediaQuery.matches) return;
    const originals = benefitsRow.querySelectorAll(".benefit-item:not(.benefit-dup)");
    if (!originals.length) return;

    const gap = parseFloat(getComputedStyle(benefitsRow).gap || "0");
    width = Array.from(originals).reduce((sum, item) => sum + item.offsetWidth, 0) + gap * (originals.length - 1);
    const speed = 0.4;

    const step = () => {
      if (!running) return;
      if (!isDragging) {
        x += speed;
        if (x >= width) x = 0;
        benefitsRow.style.transform = `translateX(${-x}px)`;
      }
      rafId = requestAnimationFrame(step);
    };

    benefitsRow.style.animation = "none";
    cancelAnimationFrame(rafId);
    running = true;
    rafId = requestAnimationFrame(step);
  };

  const stopMarquee = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  };

  const refresh = () => {
    stopMarquee();
    startMarquee();
  };

  if (!prefersReduced) {
    startMarquee();
    mediaQuery.addEventListener("change", refresh);
    window.addEventListener("orientationchange", refresh);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopMarquee();
      else refresh();
    });

    const onDragStart = (clientX) => {
      isDragging = true;
      startX = clientX;
      startOffset = x;
      stopMarquee();
    };

    const onDragMove = (clientX) => {
      if (!isDragging) return;
      const dx = clientX - startX;
      let next = startOffset - dx;
      if (next < 0) next += width;
      if (next >= width) next -= width;
      x = next;
      benefitsRow.style.transform = `translateX(${-x}px)`;
    };

    const onDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      running = true;
      rafId = requestAnimationFrame(() => startMarquee());
    };

    benefitsRow.addEventListener("touchstart", (e) => {
      if (!mediaQuery.matches) return;
      onDragStart(e.touches[0].clientX);
    }, { passive: true });

    benefitsRow.addEventListener("touchmove", (e) => {
      if (!mediaQuery.matches) return;
      onDragMove(e.touches[0].clientX);
    }, { passive: true });

    benefitsRow.addEventListener("touchend", () => {
      if (!mediaQuery.matches) return;
      onDragEnd();
    }, { passive: true });
  }
}

const testimonialsTrack = document.querySelector(".testimonials-track");
if (testimonialsTrack) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let rafId = null;
  let running = false;
  let x = 0;
  let width = 0;
  let isDragging = false;
  let startX = 0;
  let startOffset = 0;

  const startMarquee = () => {
    if (prefersReduced) return;
    const originals = testimonialsTrack.querySelectorAll(".testimonial-card:not([aria-hidden=\"true\"])");
    if (!originals.length) return;

    const gap = parseFloat(getComputedStyle(testimonialsTrack).gap || "0");
    width = Array.from(originals).reduce((sum, item) => sum + item.offsetWidth, 0) + gap * (originals.length - 1);

    const speed = 0.25;
    const step = () => {
      if (!running) return;
      if (!isDragging) {
        x += speed;
        if (x >= width) x = 0;
        testimonialsTrack.style.transform = `translateX(${-x}px)`;
      }
      rafId = requestAnimationFrame(step);
    };

    testimonialsTrack.style.animation = "none";
    cancelAnimationFrame(rafId);
    running = true;
    rafId = requestAnimationFrame(step);
  };

  const stopMarquee = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  };

  const refresh = () => {
    stopMarquee();
    startMarquee();
  };

  if (!prefersReduced) {
    startMarquee();
    window.addEventListener("orientationchange", refresh);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopMarquee();
      else refresh();
    });

    const onDragStart = (clientX) => {
      isDragging = true;
      startX = clientX;
      startOffset = x;
      stopMarquee();
    };

    const onDragMove = (clientX) => {
      if (!isDragging) return;
      const dx = clientX - startX;
      let next = startOffset - dx;
      if (next < 0) next += width;
      if (next >= width) next -= width;
      x = next;
      testimonialsTrack.style.transform = `translateX(${-x}px)`;
    };

    const onDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      running = true;
      rafId = requestAnimationFrame(() => startMarquee());
    };

    testimonialsTrack.addEventListener("touchstart", (e) => {
      onDragStart(e.touches[0].clientX);
    }, { passive: true });

    testimonialsTrack.addEventListener("touchmove", (e) => {
      onDragMove(e.touches[0].clientX);
    }, { passive: true });

    testimonialsTrack.addEventListener("touchend", () => {
      onDragEnd();
    }, { passive: true });
  }
}
