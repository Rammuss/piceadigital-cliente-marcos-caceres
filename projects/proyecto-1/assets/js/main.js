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
