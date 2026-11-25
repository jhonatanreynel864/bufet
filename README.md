# BUFET of Artists — sitio web

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni compilación) listo para publicar en **Vercel**.

## Páginas

| Archivo | Página |
|---|---|
| `index.html` | Inicio (héroe, Explora por categoría, Artistas destacados, Próximos eventos) |
| `arte.html`, `cultura.html`, `diseno.html`, `musica.html`, `audiovisual.html` | Secciones con filtros y 4 obras cada una |
| `artistas.html` | Artistas destacados con filtros y botón "Ver más" |
| `eventos.html` | Calendario de eventos con filtros y reserva por WhatsApp |
| `sobre-nosotros.html` | Descripción + líneas de contacto |
| `contacto.html` | Descripción, formulario (abre WhatsApp) y líneas de contacto |
| `preguntas-frecuentes.html` | Preguntas frecuentes |
| `404.html` | Página no encontrada (Vercel la usa automáticamente) |

## Publicar en Vercel

**Opción A: desde GitHub (recomendada)**
1. Sube esta carpeta a un repositorio de GitHub.
2. En vercel.com → *Add New… → Project* → importa el repositorio.
3. *Framework Preset*: **Other**. No hace falta comando de build ni carpeta de salida.
4. Presiona **Deploy**.

**Opción B: con la terminal**
```bash
npx vercel
```
```bash
npx vercel --prod
```

`vercel.json` activa URLs limpias (`/arte` en lugar de `/arte.html`) y caché para las imágenes.

## Qué editar

- **Instagram y WhatsApp principal**: al inicio de `assets/js/main.js` (`INSTAGRAM`, `WHATSAPP`) y en los enlaces del pie de página de cada página.
- **Números de contacto**: bloque "Líneas de contacto" en `sobre-nosotros.html` y `contacto.html`.
- **Eventos**: tarjetas en `eventos.html` (cada una tiene `data-date="AAAA-MM-DD"`; las fechas pasadas se marcan solas como "Finalizado") y la tarjeta de "Próximos eventos" en `index.html`.
- **Colores y tipografía**: variables al inicio de `assets/css/styles.css`.
- El año del pie de página se actualiza automáticamente.
