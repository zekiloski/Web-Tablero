# Portal de Herramientas Digitales — Oncativo S.A.

Página web estática tipo *dashboard* para mostrar en reuniones las herramientas y aplicaciones
desarrolladas para la empresa. No usa servidor, ni base de datos, ni frameworks: solo HTML, CSS y JavaScript.

Funciona de dos maneras:

- **Online:** subiendo los archivos a Hostinger (carpeta `public_html`).
- **Sin internet:** haciendo **doble clic en `index.html`** desde la PC o un pendrive.

---

## 1. Estructura de carpetas

```
/index.html          → Página principal (no hace falta tocarla)
/css/styles.css      → Diseño y colores
/js/data.js          → ★ CONTENIDO: acá se agregan y editan las herramientas
/js/icons.js         → Íconos (incluidos, funcionan sin internet)
/js/app.js           → Lógica del portal (no hace falta tocarla)
/videos/             → Videos de demostración (.mp4)
/img/                → Logo, portadas y capturas de pantalla
```

> Para el uso diario **solo vas a editar `js/data.js`** y copiar archivos en `/img` y `/videos`.
> Se puede editar con el Bloc de notas, aunque es más cómodo **Visual Studio Code** porque
> marca los errores con colores.

---

## 2. Cómo agregar o editar una herramienta

1. Abrí `js/data.js`.
2. Buscá la lista `const HERRAMIENTAS = [ ... ];`.
3. Para **editar**, cambiá los textos entre comillas.
4. Para **agregar**, poné una coma después de la última `}` de la lista y pegá un bloque nuevo como el de abajo.
5. Guardá el archivo y recargá la página (en el navegador: **Ctrl + F5**).

### Ejemplo para copiar y pegar

```js
  {
    id: "control-calidad",                 // único, sin espacios, tildes ni ñ
    nombre: "Control de Calidad",
    icono: "portapapeles",                 // ver lista de íconos más abajo
    portada: "img/control-calidad.png",
    descripcionCorta: "Registro de controles de calidad de cada lote producido.",
    problemaQueResuelve: "Los controles se anotaban en papel y era difícil encontrar los resultados de un lote.",
    area: "Calidad",
    estado: "desarrollo",                  // "produccion" | "prueba" | "desarrollo"
    fecha: "2026-12-01",                   // AAAA-MM-DD
    linkWeb: "https://...",                // link de la aplicación ("" si todavía no hay)
    video: "videos/control-calidad.mp4",   // archivo local o link de YouTube ("" si no hay)
    capturas: [
      "img/control-calidad-1.png",
      "img/control-calidad-2.png"
    ],
    funcionalidades: [
      {
        titulo: "Carga de mediciones",
        descripcion: "El inspector carga las medidas de cada pieza desde la tablet.",
        observacion: "Mostrar la carga de una medición fuera de tolerancia."
      },
      {
        titulo: "Historial por lote",
        descripcion: "Se puede consultar el resultado de cualquier lote anterior.",
        observacion: ""
      }
    ],
    beneficios: [
      "Trazabilidad completa de cada lote.",
      "Menos papel."
    ],
    observaciones: "Nota general para quien presenta la demo."
  }
```

### Qué hace cada campo

| Campo | Para qué sirve |
|---|---|
| `id` | Identificador único. Se usa en la dirección de la página (`#/herramienta/control-calidad`). |
| `nombre` | Nombre que se ve en el menú, las tarjetas y el detalle. |
| `icono` | Ícono del menú y de las tarjetas. |
| `portada` | Imagen de la tarjeta. Si no existe, se muestra el ícono sobre un fondo verde. |
| `descripcionCorta` | Resumen de 1 o 2 líneas para la tarjeta. |
| `problemaQueResuelve` | Sección "¿Qué problema resuelve?". |
| `area` | Área que la usa. Las áreas del filtro se generan solas con lo que pongas acá. |
| `estado` | `"produccion"` (verde), `"prueba"` (amarillo) o `"desarrollo"` (azul). |
| `fecha` | Fecha en formato `AAAA-MM-DD`. Se muestra como "10 de junio de 2025". |
| `linkWeb` | Link del botón **Abrir aplicación** (se abre en una pestaña nueva). |
| `video` | Ruta del video local o link de YouTube. |
| `capturas` | Lista de imágenes para la galería. Al hacer clic se ven ampliadas. |
| `funcionalidades` | Lista de `{ titulo, descripcion, observacion }`. La observación es una nota para la demo. |
| `beneficios` | Lista de textos cortos. |
| `observaciones` | Nota general que aparece al final del detalle. |

**Campos vacíos:** si un campo queda vacío (`""` o `[]`), esa sección **se oculta sola**.
La única excepción es el recuadro **"Acceso a la aplicación"**, que siempre se muestra: con `linkWeb: ""`
dice "Link pendiente", y cuando cargás la URL muestra el link con los botones **Copiar link** y **Abrir aplicación**.

**Saltos de línea:** dentro de un texto podés escribir `\n` para pasar a la línea siguiente.

**Comillas:** los textos van entre comillas dobles `"..."`. Si necesitás comillas dentro del texto,
usá comillas simples (`"el botón 'Guardar'"`) o escribí `\"`.

### Íconos disponibles

`herramienta`, `documento`, `email`, `robot`, `calculadora`, `camion`, `caja`, `grafico`,
`fabrica`, `edificio`, `portapapeles`, `baseDatos`, `chat`, `dinero`, `ajustes`, `carpeta`, `escudo`

### Datos generales (logo, empresa, bienvenida)

Al principio de `data.js` está el bloque `CONFIG`:

```js
const CONFIG = {
  empresa: "Oncativo S.A.",
  titulo: "Portal de Herramientas Digitales",
  logo: "img/logo.png",
  bienvenida: "Texto de bienvenida..."
};
```

Para cambiar el logo, copiá tu imagen en `/img` con el nombre `logo.png` (o cambiá la ruta).
Si el archivo no existe, se muestra un logo genérico con el nombre de la empresa.

### Si la página aparece vacía o con un mensaje de error

Casi siempre se debe a un error de escritura en `data.js`: falta una coma entre dos bloques, sobra una
coma o falta cerrar una comilla. Revisá la última parte que modificaste.

---

## 3. Cómo agregar imágenes

1. Copiá la imagen en la carpeta `/img` (PNG o JPG).
2. En `data.js`, poné la ruta en `portada` o en `capturas`, por ejemplo `"img/mantenimiento-1.png"`.

Recomendaciones:

- **Portadas:** formato horizontal (por ejemplo 1200 × 600 px).
- **Capturas:** 1280 a 1920 px de ancho. Conviene comprimirlas con https://squoosh.app para que pesen menos.
- Mientras una imagen no exista, se muestra un marcador prolijo que dice "Captura pendiente".

---

## 4. Cómo agregar un video

1. Copiá el archivo `.mp4` en la carpeta `/videos`, por ejemplo `videos/mantenimiento.mp4`.
2. En `data.js`, escribí la ruta en el campo `video`:

   ```js
   video: "videos/mantenimiento.mp4",
   ```

3. Guardá y recargá la página.

**Videos de YouTube:** también se puede pegar un link de YouTube:

```js
video: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
```

La página detecta sola si es un archivo o un link de YouTube. Tené en cuenta que **YouTube necesita
internet**: para reuniones sin conexión conviene usar el archivo MP4 local.

Mientras el archivo no exista, se muestra un recuadro que dice "Video próximamente".

### Formato de video recomendado

| Opción | Valor recomendado |
|---|---|
| Formato | **MP4** |
| Códec de video | **H.264** (es el que funciona en todos los navegadores) |
| Códec de audio | AAC |
| Resolución | **1280 × 720 (720p)** o **1920 × 1080 (1080p)** |
| Peso | Ideal: menos de 30 MB por video |

Si un video pesa mucho, se puede convertir gratis con **HandBrake** (https://handbrake.fr):
preset *"Fast 1080p30"* o *"Fast 720p30"* y la opción **"Web Optimized"** activada
(esto hace que empiece a reproducirse antes de terminar de descargarse).

El reproductor usa `preload="metadata"`: el video **no se descarga hasta que se presiona Play**,
así la página carga rápido aunque haya varios videos de 30 MB.

---

## 5. Cómo subir todo a Hostinger (Administrador de archivos)

1. Entrá a **hPanel** de Hostinger → **Sitios web** → elegí el dominio → **Administrador de archivos**
   (*File Manager*).
2. Abrí la carpeta **`public_html`**. Si querés el portal en una subcarpeta (por ejemplo
   `tudominio.com/portal`), creá una carpeta `portal` dentro de `public_html` y trabajá ahí.
3. **Forma más rápida (recomendada):**
   1. En tu PC, seleccioná `index.html`, `README.md` y las carpetas `css`, `js`, `img` y `videos`.
   2. Clic derecho → **Enviar a → Carpeta comprimida (zip)**.
   3. En el Administrador de archivos, botón **Subir** (ícono de flecha hacia arriba) → elegí el `.zip`.
   4. Clic derecho sobre el `.zip` subido → **Extraer** → confirmá la carpeta de destino.
   5. Borrá el `.zip` del servidor.
4. **Forma alternativa:** subí los archivos y carpetas de a uno con el botón **Subir**, respetando la
   misma estructura (`css/`, `js/`, `img/`, `videos/`).
5. Verificá que `index.html` quede **directamente** dentro de `public_html` (o de tu subcarpeta),
   no dentro de otra carpeta extra.
6. Abrí tu dominio en el navegador.

### Para actualizar el contenido más adelante

- Editá `data.js` en tu PC, y en el Administrador de archivos entrá a `public_html/js`, borrá el
  `data.js` viejo y subí el nuevo (o editalo directamente con clic derecho → **Editar**).
- Para un video o una imagen nueva, subila a `public_html/videos` o `public_html/img`.
- Si no ves los cambios, recargá con **Ctrl + F5** (borra la memoria caché del navegador).

### ⚠ Importante: mayúsculas y minúsculas

El servidor de Hostinger **distingue mayúsculas de minúsculas**. `Mantenimiento.PNG` y
`mantenimiento.png` son archivos distintos. En la PC funciona igual, pero en el servidor no.
**Consejo:** usá siempre nombres en minúscula, sin espacios ni tildes (por ejemplo
`nuevos-desarrollos-1.png`).

---

## 6. Uso en la reunión

| Acción | Cómo |
|---|---|
| Ver una herramienta | Clic en el menú lateral o en **Ver detalle** de una tarjeta. |
| Filtrar | Clic en un indicador (KPI) o en los filtros de Estado y Área. |
| Buscar | Escribí en el buscador (atajo: tecla **/**). |
| Pantalla completa | Botón de la barra superior. |
| Modo claro / oscuro | Botón de luna / sol (la elección se recuerda). |
| Achicar el menú | **Colapsar menú**, abajo a la izquierda. |
| **Modo Presentación** | Opción del menú, botón **Iniciar presentación** del inicio o **Presentar** en el detalle. |
| Avanzar / retroceder | Flechas **← →**, **Re Pág / Av Pág** (sirve para presentadores inalámbricos), barra espaciadora, o los botones. En el celular, deslizando el dedo. |
| Salir de la presentación | Tecla **Esc** o botón **Salir**. |

**Sin internet:** todo funciona, salvo los videos de YouTube. La tipografía Inter se reemplaza
automáticamente por la fuente del sistema.
