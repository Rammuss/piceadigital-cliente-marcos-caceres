# GL&AS × Chiaramonte — V28 · Paneles móviles tipo app

Basado en la V27. El mapa vectorial y sus datos no cambian.

Mejoras: las fichas y la lista se cierran deslizando la barrita/cabecera hacia abajo (92 px o gesto rápido), tocando fuera, con X o con Escape. Se preserva el scroll interior. Las X tienen área táctil 44×44 y SVG centrado. En escritorio continúa el panel lateral de datos.

# GL&AS × Chiaramonte · V27 — Atlas de América + Navbar jerarquizado

El enlace GL&AS está claramente separado del logo Chiaramonte en la cabecera, abre https://glyasfobc.com/ en otra pestaña. En móvil figura en el menú.

Mapa de América: vector SVG local recoloreado y decorado, con filtros Norte/Centro/Sur, marcadores interactivos, zoom, fichas y copia de datos. Las 12 ubicaciones siguen siendo demostraciones ficticias; reemplazar data/representantes.json con los datos confirmados.

Despliegue: Dockerfile, puerto interno 80. No se requiere API key ni base de datos.
