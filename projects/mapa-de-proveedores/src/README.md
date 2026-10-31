# GL&AS × Chiaramonte — V39 · Logos juntos en navbar de escritorio

- **Escritorio:** GL&AS aparece primero (izquierda) y Chiaramonte después en el mismo extremo del navbar, con altura equivalente. Cada marca conserva su enlace independiente: GL&AS abre https://glyasfobc.com/ en otra pestaña; Chiaramonte vuelve al inicio de esta web.
- Se quitó el acceso duplicado de GL&AS que anteriormente aparecía al extremo derecho del navbar.
- **Mobile y tablet con menú hamburguesa (hasta 1160px):** se mantiene el diseño anterior: solo Chiaramonte en la barra, y GL&AS en el menú desplegable.
- Se ajustó también ligeramente la escala de los logos del hero **solo en escritorio**.
- Se conservaron el directorio internacional, mapa, fichas y las demás secciones de V38.

# GL&AS × Chiaramonte — V38 · Identidad de marcas + directorio internacional

## Implementado
- Hero: GL&AS a la izquierda y Chiaramonte a la derecha, ambos con visibilidad y altura equivalentes, enlaces independientes. GL&AS abre `https://glyasfobc.com/` en otra pestaña.
- Directorio desplegable **Fuera de América**, al final del atlas americano, sin ampliar mapa ni mezclar representantes de distintas regiones.
- Datos editables en `data/representantes-internacionales.json`. Tailandia figura solamente como país con consultas en curso, **no** como representante confirmado.
- La edición mensual de representantes americanos permanece en `data/representantes.json`.

### Cómo agregar representantes fuera de América
Editar el arreglo `representantes` en `data/representantes-internacionales.json`. Ejemplo de estructura (NO son datos reales):
```json
{"nombre":"Nombre autorizado", "pais":"Tailandia", "region":"Asia", "email":"direccion@empresa.com", "telefono":"+66 ..."}
```
Una vez confirmado un representante del país, el sistema sustituirá automáticamente la fila de interés por su contacto publicado. No incluir datos de contacto hasta ser confirmados.

### Pendiente de información del cliente
- Servicio nuevo que irá antes del mapa: el cliente aún no envió la descripción/diseño.
- Botones con fallas de transición: faltan botones específicos y condiciones de reproducción.
- Correos corporativos: dominio y direcciones a definir. No se han configurado buzones.

## Nota editorial
Las menciones a distinciones y acreditaciones del chef deben verificarse documentalmente antes de publicar el sitio.

# Chiaramonte — V37 · Limpieza de notas visibles

Se retiraron avisos secundarios de prototipo, demostración, aprobación, referencias documentales y fichas en distintas secciones. No se tocaron los marcadores, navegación, mapas, paneles, formularios ni la clasificación privada. En el directorio los registros todavía llevan nombre «Representante de ejemplo» para no presentarlos como contactos reales.

**Revisión editorial interna antes de publicar:** los nombres, reconocimientos (incluida la mención a Michelin), validaciones y casos comerciales proceden de documentación facilitada para el prototipo y deben revisarse con el cliente. Los 12 representantes y sus ubicaciones son ficticios. Esto NO se muestra como aviso visual en la web.

**Despliegue Coolify:** Dockerfile, puerto interno 80, sin base de datos.

---

# V36 — Contactos del menú móvil integrados

Cambios: eliminadas las tarjetas claras del bloque Contacto directo dentro del menú móvil. Contactos sobre fondo oscuro con separadores dorados, valores legibles y botones táctiles para correo, teléfono, WhatsApp y copia. Se conserva el resto de la V35.

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


## V40 — Eliminar logos duplicados del hero

- Retiradas las dos imágenes corporativas que se repetían sobre el título del hero.
- Se mantienen GL&AS y Chiaramonte en la navegación de escritorio, en su orden y con sus enlaces independientes.
- Se conserva el menú móvil y las marcas asociadas en ese menú, sin modificar otras secciones.
- Espaciado del hero ajustado para escritorio y teléfono; se preserva el scroll fullscreen.
