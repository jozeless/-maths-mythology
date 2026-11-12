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

Los tests de navegador comprueban los tres héroes, las cuatro regiones, regreso al mapa, cambio de héroe, persistencia tras recargar, ausencia de recursos definitivos, errores de consola, teclado y tamaños 1280×720, 768×1024 y 390×844. Playwright inicia y detiene su propio servidor. La portada y los héroes usan los recursos originales proporcionados; el resto conserva composiciones provisionales en CSS.

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

## GitHub Pages

El workflow `.github/workflows/deploy.yml` instala con `npm ci`, ejecuta las pruebas de lógica, compila con `npm run build` y publica `dist/` mediante las acciones oficiales de GitHub Pages. Se activa con cada push a `main` y también admite ejecución manual mediante `workflow_dispatch`. Los pushes a ramas de trabajo y los pull requests no lo ejecutan.

En GitHub, configurar **Settings → Pages → Build and deployment → Source → GitHub Actions** antes del primer despliegue. El job de publicación usa el entorno `github-pages` y permisos `pages: write` e `id-token: write`; el resto solo necesita lectura del repositorio. Los despliegues se serializan para evitar publicaciones simultáneas.

La configuración de Vite `base: './'` genera rutas relativas compatibles con `https://jozeless.github.io/-maths-mythology/`. Las referencias de recursos usan `import.meta.env.BASE_URL` y las rutas de navegación usan hash, por lo que se mantienen dentro del subdirectorio sin requerir reescrituras del servidor. Se ha comprobado el build servido bajo `/-maths-mythology/`, incluida la navegación y recarga de una región.

## Alcance

Portada → héroes → mapa → cuatro introducciones → mapa. Todas las regiones están abiertas. No incluye ejercicios, puntuación, medallas, narraciones definitivas, Supabase ni personajes caminando.

## Portada animada

La portada usa el WebP existente `public/assets/images/portada-MM-0003-sirenas-clasicas-animada-1600x900.webp` (1600 × 900, 20 fotogramas), referenciado desde `assets.cover`. Se conserva el archivo original sin conversiones. La imagen completa mantiene 16:9, `object-fit: contain` e `image-rendering: pixelated`; el botón EMPEZAR aparece superpuesto en la zona inferior central del camino. Al cargar, se ocultan las decoraciones provisionales y el título HTML queda accesible pero visualmente oculto, ya que está incluido en la ilustración. Si falla la carga, reaparece la presentación provisional.

Las animaciones CSS respetan `prefers-reduced-motion`. El navegador reproduce el WebP animado de forma nativa: un elemento `<img>` no permite pausar sus fotogramas con CSS ni con la API de imágenes. Por tanto, esa preferencia no detiene la animación interna del WebP. Para ofrecer una portada estática a esos usuarios se necesitaría un recurso estático autorizado; esta integración no añade imágenes ni modifica el original.

## Portada inmersiva

La portada ocupa `100dvh` y contiene una escena 16:9 tan grande como permite el viewport. En pantallas de otra proporción quedan bandas oscuras, sin recortar ni estirar el WebP. Solo se muestran la ilustración, EMPEZAR (240 × 72 px en escritorio) y su indicación; en móvil el control se reduce a 190 × 52 px para respetar la composición. El título permanece como encabezado accesible visualmente oculto.

La clase de estado `body.is-cover` oculta exclusivamente en la portada el encabezado y footer. Al salir reaparecen, incluido el control de sonido conservado. No se necesita usar la API Fullscreen ni conceder permisos del navegador.

## Héroes animados

`heroes[].image` referencia directamente los GIF originales de Heracles, Odiseo y Belerofonte en `public/assets/images/`. Los archivos se mantienen con sus nombres originales, bytes y 9 fotogramas; no se convierten ni se modifican. Sus dimensiones reales son 358 × 477 px (Heracles y Odiseo) y 358 × 474 px (Belerofonte). Se presentan completos dentro de un área 3:4 con `object-fit: contain` e `image-rendering: pixelated`.

Las tres tarjetas se alinean horizontalmente en escritorio y tablet; en móvil estrecho pasan a una columna. El nombre dibujado en la ilustración sustituye visualmente al nombre HTML, manteniendo el nombre accesible en el botón. Si un GIF falla, el cargador existente retira la imagen y reaparecen figura y nombre provisionales. Toda la tarjeta continúa siendo seleccionable y conserva los efectos de hover y selección.

Heracles sustituye a Cástor en los datos. Una selección antigua `castor` deja de ser válida y el jugador puede elegir de nuevo; las selecciones de Odiseo y Belerofonte continúan siendo válidas. No cambia la lógica de almacenamiento ni navegación. Como sucede con el WebP, las animaciones internas de GIF en `<img>` no se pueden pausar mediante CSS; se conservan las originales.

## Mapa y medallones definitivos

`assets.map` usa `Mythic Isles_ A Hero’s Journey.png`, cuyo tamaño real es 1672 × 941 px (aproximadamente 16:9). El cargador conserva esa proporción natural, sin recortes ni deformación. El mapa no cambia a 4:3 o 1:1 en tablet/móvil: ilustración y botones comparten siempre el mismo contenedor y coordenadas porcentuales.

`regions[].icon` referencia los PNG originales, sin marcos adicionales ni modificaciones:

- Cíclope: `ChatGPT Image Nov 12, 2026, 12_02_01 PM-1.png` (ojo), posición 26%, 27%.
- Medusa: `ChatGPT Image Nov 12, 2026, 12_13_01 PM.png` (serpiente), posición 78%, 27%.
- Minotauro: `ChatGPT Image Nov 12, 2026, 12_13_23 PM.png` (cuerno), posición 25%, 72%.
- Sirenas: `ChatGPT Image Nov 12, 2026, 12_13_37 PM.png` (ala), posición 77%, 73%.

Los botones tienen nombres accesibles de región, foco visible y áreas táctiles de al menos 44 px. Los medallones crecen ligeramente y muestran un resplandor dorado al pasar el ratón; al pulsar se contraen brevemente. Se respeta la regla global de movimiento reducido. Si falla un recurso, el cargador existente conserva el mapa o símbolo provisional correspondiente.
