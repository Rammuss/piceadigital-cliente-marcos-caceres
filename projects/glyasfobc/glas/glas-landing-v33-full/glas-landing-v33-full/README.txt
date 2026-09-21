GL&AS Landing V3

Estructura:
- index.html
- assets/css/style.css
- assets/js/main.js
- assets/img/logo-main.png
- assets/img/sello-color.png

Iconos:
- Lucide Icons cargado por CDN desde unpkg.com.
- No hace falta descargar archivos de iconos.
- Para ver los iconos, el navegador necesita conexión a Internet.

Abrir index.html directamente en el navegador.

V27: corregido el planeta del hero. El ScrollTrigger de salida se inicializa después de la intro GSAP y usa fromTo con estado inicial explícito, por lo que al volver al inicio el planeta reaparece correctamente.
