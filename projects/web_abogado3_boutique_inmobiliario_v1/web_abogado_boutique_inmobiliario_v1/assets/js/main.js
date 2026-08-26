document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add("visible"));
  }
});
