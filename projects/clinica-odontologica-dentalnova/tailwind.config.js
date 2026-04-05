/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "c:/Projects/landing-v1/clients/active/2026-02/cliente-marcos-caceres/src/projects/clinica-odontologica-dentalnova/index.html"
  ],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#6366f1",
        "brand-secondary": "#14b8a6",
        "brand-accent": "#f43f5e",
        "brand-soft": "#f0fdfa",
        "surface": "#ffffff",
        "surface-dim": "#f8fafc",
        "on-surface": "#1e293b",
        "on-surface-variant": "#64748b"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem"
      },
      fontFamily: {
        headline: ["LeagueSpartanLocal", "system-ui", "sans-serif"],
        body: ["ManropeLocal", "system-ui", "sans-serif"],
        label: ["ManropeLocal", "system-ui", "sans-serif"]
      }
    }
  }
};
