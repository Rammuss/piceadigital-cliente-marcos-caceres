# GL&AS × Chiaramonte — Prototipo Premium V41

## Cambios de esta versión
- Se integraron **las 6 imágenes originales enviadas por Edgardo** (archivos `assets/cliente-diseno-{1..6}.png`).
- Diseños 1 y 2: sección editorial de identidad conjunta al final de «Nuestra filosofía».
- Diseño 3: bordados en «Certificaciones».
- Diseños 4 y 5: calcomanías y categorización en «Certificaciones», antes de la escala interactiva.
- Diseño 6: modelos físicos de reconocimiento, bloque breve antes del directorio del mapa. El panel azul claro `#253f59` y el ajuste **CSS** de brillo hacen que se vea más claro sin modificar el archivo original del cliente.
- El **navbar y el footer** incorporan la firma conjunta del cliente (**diseño 2**) en reemplazo del bloqueo visual anterior de dos logos. El navbar mantiene un acceso separado, explícito, a **GL&AS corporativo** (en móvil dentro del menú) para no confundir los destinos. El diseño 1 también aparece en la presentación institucional.
- Las 6 imágenes se amplían mediante una galería modal accesible.

## Importante
Las imágenes del cliente son composiciones y propuestas de diseño. La integración no implica que las distintas formas físicas sean productos fabricados, disponibles o incluidos con cada certificación. Confirmar con Edgardo antes de publicar una promesa comercial sobre entregables, avales o premios.

## Despliegue
Coolify: Dockerfile, puerto 80. Sin base de datos para directorio; registros en JSON. Dependencias de mapas/GSAP pueden usar CDN; se conserva el fallback del atlas.

---

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


## Ajustes V42
- Se elimina la sección redundante “Una firma, dos trayectorias”.
- La escala de categorías ahora muestra el diseño real de cada insignia en cada punto.
- La sección de materiales gana mayor protagonismo visual con marco más premium y fondo más claro.
- La colección de reconocimientos se separa en 7 cards individuales.
- El cierre visual de logos se limpia: placa blanca más contenida sobre fondo oscuro.


## V43 — Reveal + scroll stack + insignias originales
- Primera galería: reveal horizontal de derecha a izquierda al entrar en pantalla, sincronizado con decodificación de imagen.
- Siete formatos individuales: tarjetas sticky apiladas al desplazarse, sin pin de JavaScript ni bloquear scroll.
- Escala de cinco tenedores y cinco copas: diez archivos nuevos entregados por el cliente, completos y optimizados a WebP.
- La imagen principal y las tarjetas laterales leen los mismos distintivos.
- Navegación, enlaces, mapa, formulario y contenido restante se conservan.


### Cambios V44
- Logo oficial entregado por el cliente (PNG RGBA con transparencia) en navbar de escritorio, navbar móvil y footer.
- Fondo marfil de contraste para mantener legible su tipografía azul; sin rectángulo blanco incrustado en la imagen.
- El logo GL&AS del enlace externo corporativo continúa siendo el de esa web para que el destino siga claramente diferenciado.
- No se modifica el hero ni las animaciones de la V43.


V45: ajuste de card del formato "Cartel colgante" para evitar recorte visual dentro del stack de formatos.

V46: corrección reforzada de la card "Cartel colgante" con área de imagen más alta y alineación superior para verse completa.


## V47 - Corrección definitiva del cartel colgante
La imagen anterior `assets/award-5-colgante.png` estaba recortada por abajo desde su extracción de la lámina original. Se recuperó el cartel completo desde `assets/cliente-diseno-6.png`, se publicó con nombre nuevo (`award-5-colgante-completo-v47.png`) para evitar cache y se actualizó tanto la tarjeta como el visor. Se simplificó CSS retirando los parches V45 y V46 que solamente agrandaban la caja.


### Cambios V49
- Panel de distinciones móvil con altura según contenido, badge ligeramente más compacto y barra inferior sin cortar.
- Nueva hoja assets/v49-mobile-panel.css para invalidar la caché por nombre; etiqueta de versión en index.html.
- Cabeceras no-cache del HTML en Nginx. Consultar NOTAS-DESPLIEGUE-V49.txt si la URL pública sigue antigua.


### V50 — Distinciones físicas a la vista
- Bloque «Distinciones físicas» adelantado inmediatamente después de Ventajas y antes de Certificaciones.
- Acceso directo «Distinciones» en navbar y menú hamburguesa.
- Aviso visible: los costos de fabricación de las distinciones físicas corren por cuenta del interesado.
- Móvil: siete reconocimientos en galería horizontal deslizable con zoom al tocar, en lugar del apilado vertical largo; escritorio conserva scroll stack.
- Actualizados presets y orden de transiciones de sección, y estado activo del navbar.
- Archivo CSS nuevo para evitar caché: assets/v50-distinciones.css?v=50-20261103.


## V51 — Distinciones físicas en móvil
- Galería horizontal con cards minimalistas y un solo borde.
- Eliminadas las restricciones de 270–300 px en el área de imagen: ahora mantiene proporciones sin recorte.
- Siete imágenes regeneradas de la lámina original de reconocimientos con margen real alrededor de cada pieza, incluidos los soportes inferiores.
- Las ampliaciones utilizan los nuevos archivos de imagen.
- Hoja de estilo nueva `assets/v51-distinciones-mobile.css` cargada al final para evitar conflictos de cascada/caché.
- Se conserva la disposición Scroll Stack en PC.
