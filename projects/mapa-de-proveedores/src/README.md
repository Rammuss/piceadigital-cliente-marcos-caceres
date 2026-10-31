# Chiaramonte V34 — Selección táctil de marcadores

Correcciones: apertura directa de fichas por toque sobre pines del mapa SVG en móviles; evita duplicados y falsos toques durante pinch o desplazamiento; área táctil ampliada; mantiene gestos de dos dedos y scroll de página.

El proyecto incluye Dockerfile, nginx y los datos de demostración. Coolify: puerto interno 80.

# GL&AS × Chiaramonte — V33 · Mapa interactivo robusto

La V32 mostraba un aviso sin mapa cuando MapLibre no cargaba (CDN bloqueado por el navegador o WebGL deshabilitado). Esta versión mantiene el intento de MapLibre GL JS 6.7.0 y **activa automáticamente un atlas SVG interactivo local** en caso de fallo, en vez de dejar un mapa estático.

El modo SVG funciona sin CDN y mantiene marcadores, fichas, copia de datos, filtro por regiones, zoom, desplazamiento con mouse, gestos de dos dedos en móvil y desplazamiento de página con un dedo. El color y los contornos se conservan.

- Datos: `data/representantes.json` (12 ejemplos ficticios).  
- MapLibre, cuando esté disponible, usa `data/americas.geojson`.  
- Respaldo independiente: `assets/americas-base.svg` y `assets/v33-svg-map.js`.  
- Coolify: Dockerfile, puerto interno 80. Sin base de datos.

**Verificación:** Para usar este modo local no es necesario quitar protección de Brave. Si se desea MapLibre específicamente, hay que permitir la CDN y WebGL. Los gestos reales de iOS deben comprobarse en un iPhone físico.
