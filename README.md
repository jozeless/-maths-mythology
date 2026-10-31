# Maths Mythology

Base de un videojuego educativo de mitología griega para niños de 5 años. HTML, CSS y JavaScript modular con Vite, sin frameworks, servicios externos ni autenticación.

## Desarrollo

Requiere Node.js 22.12+ (validado con Node 24) y npm.

```sh
npm ci
npm run dev
```

```sh
npm test             # Lógica: persistencia, almacenamiento bloqueado y rutas
npm run build       # Genera dist/
npm run preview     # Sirve el resultado de producción
npx playwright install chromium
npm run test:e2e    # Recorridos en navegador
```

Si ya existe Chromium en el sistema, se puede evitar la descarga:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

Los tests de navegador comprueban los tres héroes, las cuatro regiones, regreso al mapa, cambio de héroe, persistencia tras recargar, ausencia de recursos definitivos, errores de consola, teclado y tamaños 1280×720, 768×1024 y 390×844. Playwright inicia y detiene su propio servidor. Los recursos visuales actuales son composiciones provisionales en CSS; no se han utilizado ilustraciones externas.

## Organización

- `src/data.js`: héroes, regiones, coordenadas y referencias de recursos.
- `src/state.js`: selección y validación de rutas, independiente del DOM.
- `src/router.js`: navegación mediante hash, compatible con enlaces directos en GitHub Pages.
- `src/views.js`: pantallas reutilizables y recursos provisionales.
- `src/audio.js`: música opcional, solo después de pulsar el control de sonido.
- `src/main.js`: composición y eventos de la aplicación.
- `src/style.css`: diseño adaptable, pixel art provisional y movimiento reducido.
- `tests/`: pruebas de lógica y recorridos.

La aplicación abre siempre la portada. EMPEZAR muestra los tres héroes; la selección anterior queda marcada. El héroe se guarda con la clave `maths-mythology.hero`. Si el navegador impide usar localStorage, la selección funciona en memoria durante la sesión.

## Incorporar recursos definitivos

Colocar imágenes/GIFs en `public/assets/images/` y MP3 en `public/assets/audio/`. En `src/data.js`, sustituir `null` por rutas como `assets/images/portada.png` o `assets/audio/tema.mp3`, sin `/` inicial:

- `assets.cover`: portada.
- `assets.map`: ilustración del mapa. El contenedor adopta su proporción natural para mantener las zonas alineadas sin recortar ni deformar.
- `assets.music`: música de fondo original MP3. Sin archivo, el control permanece apagado y explica su disponibilidad futura.
- `heroes[].image`: imagen o GIF de cuerpo completo, presentada con `object-fit: contain` en un área aproximada 3:4.
- `regions[].image` o `animation`: ilustración de introducción; la animación tiene prioridad.

Las referencias nulas no generan peticiones. Si un archivo configurado falla, se conserva el recurso visual provisional o se apaga la música; corregir la ruta elimina también el error de red correspondiente del navegador. Los GIFs se reproducen de forma nativa: para respetar movimiento reducido, elegir recursos estáticos o una futura variante estática si fuera necesario. Las animaciones CSS ya respetan `prefers-reduced-motion`.

Cada región tiene coordenadas porcentuales `position: { x, y }` respecto a todo el mapa y campos reservados `music`, `narration`, `story`, `challenges`, `reward` y `progress`. Estos campos no activan mecánicas todavía. Agregar una entrada a `regions` reutiliza mapa, rutas y pantalla provisional. La música actual es global; los recursos por región se integrarán con sus aventuras futuras.

## GitHub Pages (publicación manual)

`npm run build` genera una web estática en `dist/`. La configuración `base: './'` admite el subdirectorio del repositorio y las rutas hash evitan depender de reescrituras del servidor. Para publicar, subir el contenido de `dist/` mediante el proceso aprobado de GitHub Pages, o preparar un workflow oficial de Pages que construya con `npm ci && npm run build` y publique ese directorio. No se ha activado ningún despliegue automático.

## Alcance

Portada → héroes → mapa → cuatro introducciones → mapa. Todas las regiones están abiertas. No incluye ejercicios, puntuación, medallas, narraciones definitivas, Supabase ni personajes caminando.
