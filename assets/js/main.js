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
