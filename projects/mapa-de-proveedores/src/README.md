# GL&AS × Chiaramonte — V25

- Nueva fotografía horizontal del chef aportada por el cliente, en el hero y en el reveal fullscreen.
- Sello original oro/marino recortado y ajustado al círculo, sin margen oscuro perimetral.
- Se conservan todos los módulos y el reveal sincronizado V24.
- Deploy Coolify: Dockerfile; puerto interno 80.

# GLAS × Chiaramonte Premium V24 — Hero con sello aportado + reveal sincronizado

## Cambio principal
Las fotografías del chef y de los casos de experiencia se descubren **automáticamente al llegar a la sección**. El disparador tiene margen inferior negativo (38 % de la altura de pantalla) para retrasar el inicio hasta que las fotografías sean visibles. El efecto dura aproximadamente 1,7 segundos, independientemente de si el usuario sigue bajando. No hace falta controlar la apertura manualmente.

- Foto del chef: reveal de derecha a izquierda.
- Caso 1: reveal de derecha a izquierda.
- Caso 2: reveal de izquierda a derecha.
- Al regresar a la sección, la imagen permanece revelada.
- El hero cinematográfico mantiene su revelado fullscreen vinculado al scroll.
- Se respetan las preferencias del sistema de movimiento reducido.

## Despliegue
Coolify: Dockerfile; puerto interno 80. Sin base de datos.
Datos del directorio: `data/representantes.json` (datos de demostración). El formulario sigue usando `mailto:`; los textos institucionales necesitan aprobación.
