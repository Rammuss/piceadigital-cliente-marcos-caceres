# GL&AS × Chiaramonte — V30 / Gestos de mapa en móvil

Sobre V29, mapa SVG de América:

- **Un dedo:** scroll vertical de la web (sin secuestrar el movimiento).
- **Dos dedos:** hacer zoom (pellizcar o separar) y trasladar mapa al arrastrar ambos dedos.
- Zoom alrededor del punto medio de los dedos; transformación SVG real, marcadores siguen activos.
- Se ocultan los controles +/- en móviles; permanecen disponibles en escritorio.
- Indicador de gesto sutil que desaparece al usar el mapa.
- Pin tocado con un dedo abre ficha como antes; gestos sobre el mapa no disparan clics accidentales.

Todos los demás módulos se conservan. Coolify: Dockerfile, puerto 80, sin base de datos ni API key.
