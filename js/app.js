/* =====================================================================
   PORTAL DE HERRAMIENTAS DIGITALES — LÓGICA DEL DASHBOARD
   ---------------------------------------------------------------------
   No hace falta tocar este archivo para cargar o editar herramientas:
   todo el contenido está en js/data.js.

   Índice:
     1. Datos de entrada y utilidades
     2. Logo y menú lateral
     3. Navegación por #hash (router)
     4. Pantalla de Inicio (KPI, filtros, tarjetas)
     5. Vista de detalle
     6. Imágenes y videos faltantes (marcadores)
     7. Galería ampliada (lightbox)
     8. Modo Presentación
     9. Tema, menú, pantalla completa
    10. Eventos (clics y teclado) e inicio
   ===================================================================== */

(function () {
  'use strict';

  /* ===================================================================
     1. DATOS DE ENTRADA Y UTILIDADES
     =================================================================== */

  // Lista de herramientas. Si data.js tiene un error de escritura, queda en null
  // y se muestra un mensaje amigable en lugar de una página en blanco.
  const DATOS = (typeof HERRAMIENTAS !== 'undefined' && Array.isArray(HERRAMIENTAS)) ? HERRAMIENTAS : null;

  // Configuración general (con valores por defecto)
  const CONF = Object.assign({
    empresa: 'Oncativo S.A.',
    titulo: 'Portal de Herramientas Digitales',
    logo: 'img/logo.png',
    bienvenida: ''
  }, (typeof CONFIG !== 'undefined' && CONFIG) || {});

  const SET_ICONOS = (typeof ICONOS !== 'undefined') ? ICONOS : {};

  // Textos de cada estado
  const ESTADOS = {
    produccion: { texto: 'En producción', icono: 'check' },
    prueba:     { texto: 'En prueba',     icono: 'reloj' },
    desarrollo: { texto: 'En desarrollo', icono: 'codigo' }
  };

  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  // Estado de la interfaz (filtros y búsqueda)
  const ui = { estado: 'todos', area: 'todas', busqueda: '' };

  // Atajos para buscar elementos
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

  // Referencias a elementos fijos de la página
  const el = {
    html: document.documentElement,
    marca: $('#marca'),
    nav: $('#nav'),
    vista: $('#vista'),
    titulo: $('#tituloSeccion'),
    buscador: $('#buscador'),
    btnTema: $('#btnTema'),
    btnPantalla: $('#btnPantalla'),
    pres: $('#presentacion'),
    presEscenario: $('#presEscenario'),
    presContador: $('#presContador'),
    presPuntos: $('#presPuntos'),
    presProgreso: $('#presProgreso'),
    presPrev: $('#presPrev'),
    presNext: $('#presNext'),
    lb: $('#lightbox'),
    lbImg: $('#lbImg'),
    lbCap: $('#lbCap')
  };

  // Guardar / leer preferencias del navegador sin romper si está bloqueado
  const LS = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin acceso */ } }
  };

  // Escapa texto para insertarlo de forma segura en HTML
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  // Texto con saltos de línea (\n) convertidos en <br>
  function texto(t) { return esc(t).replace(/\n/g, '<br>'); }

  // ¿El campo tiene contenido?
  function hay(v) { return typeof v === 'string' ? v.trim() !== '' : v != null && v !== false; }
  function hayLista(l) { return Array.isArray(l) && l.length > 0; }

  // Devuelve el SVG de un ícono por su nombre
  function icono(nombre, clase) {
    const dibujo = SET_ICONOS[nombre] || SET_ICONOS.caja || '';
    return '<svg class="ico ' + (clase || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + dibujo + '</svg>';
  }

  function estadoDe(h) { return ESTADOS[h.estado] ? h.estado : 'desarrollo'; }

  function badgeEstado(h, grande) {
    const k = estadoDe(h);
    return '<span class="badge badge--' + k + (grande ? ' badge--lg' : '') + '">' +
      '<span class="badge__dot"></span>' + ESTADOS[k].texto + '</span>';
  }

  // "2025-06-10" → "10 de junio de 2025"   |   "2025-06" → "Junio de 2025"
  function formatearFecha(f) {
    if (!hay(f)) return '';
    const m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(String(f).trim());
    if (!m || !MESES[+m[2] - 1]) return esc(f);
    const mes = MESES[+m[2] - 1];
    return m[3] ? (+m[3]) + ' de ' + mes + ' de ' + m[1]
                : mes.charAt(0).toUpperCase() + mes.slice(1) + ' de ' + m[1];
  }

  // Si el link es de YouTube devuelve el código del video; si no, null
  function idYoutube(url) {
    const m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/.exec(url || '');
    return m ? m[1] : null;
  }

  // Texto en minúsculas y sin tildes (para el buscador)
  function normalizar(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function rutaHerramienta(h) { return '#/herramienta/' + encodeURIComponent(h.id); }

  // Imagen que, si no existe, se reemplaza sola por un marcador (ver sección 6)
  function imagen(src, alt, tipo, nombreIcono, clase) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" ' +
      'data-fallback="' + tipo + '" data-icono="' + esc(nombreIcono || '') + '"' +
      (clase ? ' class="' + clase + '"' : '') + '>';
  }

  // Dibuja los íconos de los elementos fijos del HTML (<span data-icon="...">)
  function pintarIconos(raiz) {
    $$('[data-icon]', raiz).forEach(n => { n.outerHTML = icono(n.dataset.icon); });
  }


  /* ===================================================================
     2. LOGO Y MENÚ LATERAL
     =================================================================== */

  function renderMarca() {
    el.marca.innerHTML =
      (hay(CONF.logo) ? imagen(CONF.logo, CONF.empresa, 'logo', '', 'marca__img') : '') +
      '<span class="marca__simbolo">' + icono('fabrica') + '</span>' +
      '<span class="marca__txt"><strong>' + esc(CONF.empresa) + '</strong><small>Herramientas digitales</small></span>';
    if (!hay(CONF.logo)) el.html.classList.add('sin-logo');
    const pie = $('#pieEmpresa');
    if (pie) pie.textContent = CONF.empresa;
  }

  function itemNav(href, nombreIcono, txt, clave, estado) {
    return '<a class="nav__item" href="' + href + '" data-clave="' + esc(clave) + '" title="' + esc(txt) + '">' +
      icono(nombreIcono) + '<span class="nav__txt">' + esc(txt) + '</span>' +
      (estado ? '<span class="nav__dot nav__dot--' + estado + '" title="' + ESTADOS[estado].texto + '"></span>' : '') +
      '</a>';
  }

  function renderNav() {
    let html = '<div class="nav__grupo">General</div>' + itemNav('#/inicio', 'inicio', 'Inicio', 'inicio');
    html += '<div class="nav__grupo">Herramientas</div>';
    (DATOS || []).forEach(h => {
      html += itemNav(rutaHerramienta(h), h.icono, h.nombre, 'h:' + h.id, estadoDe(h));
    });
    html += '<div class="nav__grupo">Reunión</div>' +
      '<button class="nav__item nav__item--presentar" type="button" data-accion="presentar" title="Modo Presentación">' +
      icono('presentacion') + '<span class="nav__txt">Modo Presentación</span></button>';
    el.nav.innerHTML = html;
  }

  // Resalta la opción del menú que corresponde a la vista actual
  function marcarNav(clave) {
    $$('.nav__item', el.nav).forEach(a => {
      const activo = a.dataset.clave === clave;
      a.classList.toggle('activo', activo);
      if (activo) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }


  /* ===================================================================
     3. NAVEGACIÓN POR #HASH (sin recargar la página)
        #/inicio                  → pantalla de inicio
        #/herramienta/<id>        → detalle de una herramienta
     =================================================================== */

  function router() {
    cerrarMenuMovil();
    if (!DATOS) { mostrarError(); return; }

    let hash = location.hash || '';
    try { hash = decodeURIComponent(hash); } catch (e) { /* hash mal formado: se ignora */ }

    const m = /^#\/herramienta\/(.+)$/.exec(hash);
    if (m) {
      const h = DATOS.find(x => String(x.id) === m[1]);
      if (h) {
        mostrar(renderDetalle(h), h.nombre, 'h:' + h.id, 'detalle', () => prepararDetalle());
        return;
      }
    }
    mostrar(renderInicio(), 'Inicio', 'inicio', 'inicio', () => actualizarInicio());
  }

  // Dibuja una vista con una transición suave
  function mostrar(html, titulo, clave, tipo, despues) {
    el.vista.classList.remove('vista--entrar');
    el.vista.innerHTML = html;
    void el.vista.offsetWidth; // reinicia la animación
    el.vista.classList.add('vista--entrar');
    el.vista.dataset.vista = tipo;
    el.titulo.textContent = titulo;
    document.title = (tipo === 'inicio' ? '' : titulo + ' · ') + CONF.titulo + ' — ' + CONF.empresa;
    marcarNav(clave);
    if (despues) despues();
    window.scrollTo(0, 0);
  }

  function mostrarError() {
    el.titulo.textContent = 'Error';
    el.vista.innerHTML =
      '<div class="vacio vacio--error">' + icono('alerta', 'vacio__ico') +
      '<h2>No se pudieron cargar las herramientas</h2>' +
      '<p>Revisá que el archivo <code>js/data.js</code> exista y no tenga errores de escritura ' +
      '(por ejemplo, una coma o una comilla de más o de menos).</p></div>';
  }


  /* ===================================================================
     4. PANTALLA DE INICIO
     =================================================================== */

  function contar() {
    const c = { total: DATOS.length, produccion: 0, prueba: 0, desarrollo: 0 };
    DATOS.forEach(h => { c[estadoDe(h)]++; });
    return c;
  }

  function areasUnicas() {
    const mapa = {};
    DATOS.forEach(h => { if (hay(h.area)) mapa[h.area] = (mapa[h.area] || 0) + 1; });
    return Object.keys(mapa).sort((a, b) => a.localeCompare(b, 'es')).map(a => ({ nombre: a, n: mapa[a] }));
  }

  function renderInicio() {
    const c = contar();

    const kpi = (clave, titulo, numero, nombreIcono) =>
      '<button class="kpi kpi--' + clave + '" type="button" data-accion="filtro-estado" data-valor="' + clave + '" ' +
      'title="Filtrar: ' + esc(titulo) + '">' +
      '<span class="kpi__ico">' + icono(nombreIcono) + '</span>' +
      '<span class="kpi__datos"><strong class="kpi__num">' + numero + '</strong>' +
      '<span class="kpi__txt">' + esc(titulo) + '</span></span></button>';

    const chip = (accion, valor, txt, n, punto) =>
      '<button class="chip" type="button" data-accion="' + accion + '" data-valor="' + esc(valor) + '">' +
      (punto ? '<span class="chip__dot chip__dot--' + punto + '"></span>' : '') +
      esc(txt) + '<span class="chip__n">' + n + '</span></button>';

    const chipsEstado =
      chip('filtro-estado', 'todos', 'Todos', c.total) +
      chip('filtro-estado', 'produccion', 'En producción', c.produccion, 'produccion') +
      chip('filtro-estado', 'prueba', 'En prueba', c.prueba, 'prueba') +
      chip('filtro-estado', 'desarrollo', 'En desarrollo', c.desarrollo, 'desarrollo');

    const chipsArea = chip('filtro-area', 'todas', 'Todas', c.total) +
      areasUnicas().map(a => chip('filtro-area', a.nombre, a.nombre, a.n)).join('');

    return '' +
      '<section class="bienvenida">' +
        '<div class="bienvenida__txt">' +
          '<p class="bienvenida__pre">' + esc(CONF.empresa) + '</p>' +
          '<h2>' + esc(CONF.titulo) + '</h2>' +
          (hay(CONF.bienvenida) ? '<p>' + texto(CONF.bienvenida) + '</p>' : '') +
        '</div>' +
        '<button class="btn btn--amarillo btn--lg" type="button" data-accion="presentar">' +
          icono('presentacion') + 'Iniciar presentación</button>' +
      '</section>' +

      '<section class="kpis" aria-label="Indicadores">' +
        kpi('todos', 'Herramientas en total', c.total, 'grilla') +
        kpi('produccion', 'En producción', c.produccion, 'check') +
        kpi('prueba', 'En prueba', c.prueba, 'reloj') +
        kpi('desarrollo', 'En desarrollo', c.desarrollo, 'codigo') +
      '</section>' +

      '<section class="filtros" aria-label="Filtros">' +
        '<div class="filtros__grupo"><span class="filtros__label">' + icono('filtro') + 'Estado</span>' +
          '<div class="chips">' + chipsEstado + '</div></div>' +
        '<div class="filtros__grupo"><span class="filtros__label">' + icono('usuarios') + 'Área</span>' +
          '<div class="chips">' + chipsArea + '</div></div>' +
      '</section>' +

      '<div class="resultado" id="resultado"></div>' +
      '<section class="grilla" id="grilla" aria-label="Herramientas"></section>';
  }

  // Herramientas que cumplen los filtros y la búsqueda
  function filtrar() {
    const q = normalizar(ui.busqueda.trim());
    return DATOS.filter(h => {
      if (ui.estado !== 'todos' && estadoDe(h) !== ui.estado) return false;
      if (ui.area !== 'todas' && h.area !== ui.area) return false;
      if (!q) return true;
      const textoHerramienta = [h.nombre, h.descripcionCorta, h.area, h.problemaQueResuelve]
        .concat((h.funcionalidades || []).map(f => f && f.titulo))
        .join(' ');
      return normalizar(textoHerramienta).includes(q);
    });
  }

  function tarjeta(h, i) {
    const portada = hay(h.portada)
      ? imagen(h.portada, h.nombre, 'portada', h.icono)
      : '<div class="ph ph--portada">' + icono(h.icono, 'ph__ico') + '</div>';

    return '' +
      '<a class="card" href="' + rutaHerramienta(h) + '" style="--i:' + i + '">' +
        '<div class="card__portada">' + portada + badgeEstado(h) + '</div>' +
        '<div class="card__cuerpo">' +
          '<div class="card__titulo"><span class="card__ico">' + icono(h.icono) + '</span>' +
            '<h3>' + esc(h.nombre) + '</h3></div>' +
          '<p class="card__desc">' + esc(h.descripcionCorta) + '</p>' +
          '<div class="card__pie">' +
            (hay(h.area) ? '<span class="card__area">' + icono('usuarios') + esc(h.area) + '</span>' : '<span></span>') +
            '<span class="btn btn--suave btn--sm">Ver detalle' + icono('chevronDer') + '</span>' +
          '</div>' +
        '</div>' +
      '</a>';
  }

  // Actualiza tarjetas, filtros y contador sin redibujar toda la pantalla
  function actualizarInicio() {
    const grilla = $('#grilla');
    if (!grilla) return;
    const lista = filtrar();

    grilla.innerHTML = lista.length
      ? lista.map(tarjeta).join('')
      : '<div class="vacio">' + icono('buscar', 'vacio__ico') +
        '<h3>No se encontraron herramientas</h3><p>Probá con otra búsqueda o quitá los filtros.</p>' +
        '<button class="btn btn--fantasma" type="button" data-accion="limpiar">Quitar filtros</button></div>';

    const filtrando = ui.estado !== 'todos' || ui.area !== 'todas' || ui.busqueda.trim() !== '';
    $('#resultado').innerHTML = filtrando
      ? 'Mostrando <strong>' + lista.length + '</strong> de ' + DATOS.length + ' herramientas' +
        ' <button class="link" type="button" data-accion="limpiar">Quitar filtros</button>'
      : '';

    $$('[data-accion="filtro-estado"]', el.vista).forEach(b => b.classList.toggle('activo', b.dataset.valor === ui.estado));
    $$('[data-accion="filtro-area"]', el.vista).forEach(b => b.classList.toggle('activo', b.dataset.valor === ui.area));
  }

  // Aplica un cambio de filtros (si no estamos en el inicio, vuelve al inicio)
  function aplicarFiltros() {
    if (el.vista.dataset.vista === 'inicio') actualizarInicio();
    else location.hash = '#/inicio';
  }


  /* ===================================================================
     5. VISTA DE DETALLE
     =================================================================== */

  function seccion(id, nombreIcono, titulo, contenido) {
    return '<section class="seccion"' + (id ? ' id="' + id + '"' : '') + '>' +
      '<h3 class="seccion__titulo"><span class="seccion__ico">' + icono(nombreIcono) + '</span>' + titulo + '</h3>' +
      contenido + '</section>';
  }

  function htmlVideo(h) {
    const url = String(h.video).trim();
    const yt = idYoutube(url);
    let reproductor;

    if (yt) {
      // Video de YouTube → iframe (necesita internet)
      reproductor =
        '<div class="video-marco">' +
          '<iframe src="https://www.youtube-nocookie.com/embed/' + yt + '?rel=0" title="Video de ' + esc(h.nombre) + '" ' +
          'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" ' +
          'allowfullscreen referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>' +
          (navigator.onLine === false
            ? '<div class="video-aviso">' + icono('alerta') + 'Sin conexión a internet: los videos de YouTube no se pueden reproducir.</div>'
            : '') +
        '</div>' +
        '<div class="video-barra"><span class="video-nota">' + icono('info') + 'Video alojado en YouTube.</span>' +
          '<span class="video-barra__btns">' +
          '<a class="btn btn--fantasma btn--sm" href="https://www.youtube.com/watch?v=' + yt + '" target="_blank" rel="noopener">' +
            icono('externo') + 'Ver en YouTube</a>' +
          '<button class="btn btn--fantasma btn--sm" type="button" data-accion="video-pantalla">' + icono('maximizar') + 'Pantalla completa</button>' +
          '</span></div>';
    } else {
      // Archivo MP4 local → <video>. preload="metadata": no descarga el video hasta presionar play.
      reproductor =
        '<div class="video-marco">' +
          '<video controls preload="metadata" playsinline src="' + esc(url) + '"></video>' +
        '</div>' +
        '<div class="video-barra"><span class="video-nota">' + icono('info') + 'El video se descarga recién al presionar reproducir.</span>' +
          '<button class="btn btn--fantasma btn--sm" type="button" data-accion="video-pantalla">' + icono('maximizar') + 'Ver a pantalla completa</button>' +
        '</div>';
    }
    return '<div class="video-bloque" id="videoBloque" data-archivo="' + esc(url) + '">' + reproductor + '</div>';
  }

  function renderDetalle(h) {
    const i = DATOS.indexOf(h);
    const funcs = (h.funcionalidades || []).filter(f => f && (hay(f.titulo) || hay(f.descripcion)));
    const benef = (h.beneficios || []).filter(hay);
    const capturas = (h.capturas || []).filter(hay);
    let s = '';

    // --- Encabezado ---
    s += '<a class="volver" href="#/inicio">' + icono('flechaIzq') + 'Volver al inicio</a>';
    s += '<header class="hero hero--' + estadoDe(h) + '">' +
      '<div class="hero__ico">' + icono(h.icono) + '</div>' +
      '<div class="hero__info">' +
        '<div class="hero__meta">' + badgeEstado(h, true) +
          (hay(h.area) ? '<span class="meta">' + icono('usuarios') + esc(h.area) + '</span>' : '') +
          (hay(h.fecha) ? '<span class="meta">' + icono('calendario') + formatearFecha(h.fecha) + '</span>' : '') +
        '</div>' +
        '<h2 class="hero__nombre">' + esc(h.nombre) + '</h2>' +
        (hay(h.descripcionCorta) ? '<p class="hero__desc">' + texto(h.descripcionCorta) + '</p>' : '') +
        '<div class="hero__acciones">' +
          (hay(h.video)
            ? '<button class="btn btn--amarillo btn--lg" type="button" data-accion="ir-video">' + icono('play') + 'Ver video</button>' : '') +
          '<button class="btn btn--fantasma btn--lg" type="button" data-accion="presentar" data-desde="' + (i + 1) + '">' +
            icono('presentacion') + 'Presentar</button>' +
        '</div>' +
      '</div>' +
    '</header>';

    // --- Acceso a la aplicación (link). Se muestra siempre: si no hay link, avisa que está pendiente ---
    if (hay(h.linkWeb)) {
      s += '<section class="acceso">' +
        '<span class="acceso__ico">' + icono('externo') + '</span>' +
        '<div class="acceso__info"><span class="acceso__titulo">Acceso a la aplicación</span>' +
          '<a class="acceso__url" href="' + esc(h.linkWeb) + '" target="_blank" rel="noopener">' + esc(h.linkWeb) + '</a></div>' +
        '<div class="acceso__btns">' +
          '<button class="btn btn--fantasma" type="button" data-accion="copiar-link" data-link="' + esc(h.linkWeb) + '">' +
            icono('portapapeles') + '<span>Copiar link</span></button>' +
          '<a class="btn btn--primario" href="' + esc(h.linkWeb) + '" target="_blank" rel="noopener">' +
            icono('externo') + 'Abrir aplicación</a>' +
        '</div></section>';
    } else {
      s += '<section class="acceso acceso--pendiente">' +
        '<span class="acceso__ico">' + icono('externo') + '</span>' +
        '<div class="acceso__info"><span class="acceso__titulo">Acceso a la aplicación</span>' +
          '<span class="acceso__pendiente">Link pendiente. Se carga en <code>js/data.js</code>, campo <code>linkWeb</code>.</span></div>' +
        '</section>';
    }

    // --- ¿Qué problema resuelve? ---
    if (hay(h.problemaQueResuelve)) {
      s += seccion('', 'alerta', '¿Qué problema resuelve?',
        '<div class="panel problema">' + texto(h.problemaQueResuelve) + '</div>');
    }

    // --- Funcionalidades ---
    if (funcs.length) {
      s += seccion('', 'capas', 'Funcionalidades',
        '<div class="funcs">' + funcs.map((f, n) =>
          '<article class="func">' +
            '<div class="func__cab"><span class="func__num">' + (n + 1) + '</span><h4>' + esc(f.titulo) + '</h4></div>' +
            (hay(f.descripcion) ? '<p class="func__desc">' + texto(f.descripcion) + '</p>' : '') +
            (hay(f.observacion)
              ? '<div class="obs">' + icono('foco', 'obs__ico') +
                '<div><span class="obs__titulo">Observación</span><p>' + texto(f.observacion) + '</p></div></div>'
              : '') +
          '</article>').join('') + '</div>');
    }

    // --- Etapas de implementación (opcional) ---
    const etapas = (h.etapas || []).filter(e => e && hay(e.nombre));
    if (etapas.length) {
      s += seccion('', 'calendario', 'Etapas de implementación',
        (hay(h.etapasTitulo) ? '<p class="etapas__intro">' + texto(h.etapasTitulo) + '</p>' : '') +
        '<ol class="etapas">' + etapas.map((e, n) => {
          const k = ESTADOS[e.estado] ? e.estado : 'definir';
          return '<li class="etapa etapa--' + k + '">' +
            '<span class="etapa__num">' + (n + 1) + '</span>' +
            '<div class="etapa__info"><h4>' + esc(e.nombre) + '</h4>' +
              (hay(e.incluye) ? '<p>' + texto(e.incluye) + '</p>' : '') + '</div>' +
            '<span class="badge badge--' + k + '"><span class="badge__dot"></span>' +
              esc(hay(e.estadoTexto) ? e.estadoTexto : (ESTADOS[k] ? ESTADOS[k].texto : 'A definir')) + '</span>' +
          '</li>';
        }).join('') + '</ol>');
    }

    // --- Beneficios ---
    if (benef.length) {
      s += seccion('', 'estrella', 'Beneficios para la empresa',
        '<ul class="beneficios">' + benef.map(b =>
          '<li><span class="beneficios__ico">' + icono('tilde') + '</span>' + texto(b) + '</li>').join('') + '</ul>');
    }

    // --- Video demostrativo ---
    if (hay(h.video)) {
      s += seccion('seccion-video', 'video', 'Video demostrativo', htmlVideo(h));
    }

    // --- Galería de capturas ---
    if (capturas.length) {
      s += seccion('', 'imagen', 'Capturas de pantalla',
        '<div class="capturas">' + capturas.map((src, n) =>
          '<button class="captura" type="button" data-accion="captura" data-indice="' + n + '" ' +
          'data-src="' + esc(src) + '" aria-label="Ampliar captura ' + (n + 1) + '">' +
            imagen(src, 'Captura ' + (n + 1) + ' de ' + h.nombre, 'captura', 'imagen') +
            '<span class="captura__zoom">' + icono('zoom') + '</span>' +
          '</button>').join('') + '</div>');
    }

    // --- Observaciones generales ---
    if (hay(h.observaciones)) {
      s += '<section class="seccion"><div class="obs-general">' +
        '<span class="obs-general__ico">' + icono('info') + '</span>' +
        '<div><h3>Observaciones generales</h3><p>' + texto(h.observaciones) + '</p></div>' +
        '</div></section>';
    }

    // --- Navegación a la herramienta anterior / siguiente ---
    if (DATOS.length > 1) {
      const ant = DATOS[(i - 1 + DATOS.length) % DATOS.length];
      const sig = DATOS[(i + 1) % DATOS.length];
      s += '<nav class="det-nav" aria-label="Otras herramientas">' +
        '<a class="det-nav__link" href="' + rutaHerramienta(ant) + '">' + icono('flechaIzq') +
          '<span><small>Anterior</small>' + esc(ant.nombre) + '</span></a>' +
        '<a class="det-nav__link det-nav__link--sig" href="' + rutaHerramienta(sig) + '">' +
          '<span><small>Siguiente</small>' + esc(sig.nombre) + '</span>' + icono('flechaDer') + '</a>' +
        '</nav>';
    }
    return s;
  }

  // Después de dibujar el detalle: si el video local no existe, mostrar marcador
  function prepararDetalle() {
    const v = $('#videoBloque video', el.vista);
    if (v) v.addEventListener('error', () => videoFaltante($('#videoBloque', el.vista)));
  }

  function videoFaltante(bloque) {
    if (!bloque) return;
    bloque.innerHTML =
      '<div class="ph ph--video">' + icono('video', 'ph__ico') +
        '<strong>Video próximamente</strong>' +
        '<span>Archivo esperado: <code>' + esc(bloque.dataset.archivo) + '</code></span>' +
      '</div>';
  }

  // Copia el link al portapapeles y muestra "¡Copiado!" por un momento
  function copiarLink(boton) {
    const link = boton.dataset.link;
    const listo = () => {
      const txt = $('span', boton);
      txt.textContent = '¡Copiado!';
      boton.classList.add('copiado');
      setTimeout(() => { txt.textContent = 'Copiar link'; boton.classList.remove('copiado'); }, 1800);
    };
    const alternativo = () => {            // Para navegadores sin acceso al portapapeles
      const area = document.createElement('textarea');
      area.value = link;
      area.style.position = 'fixed'; area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); listo(); } catch (e) { window.prompt('Copiá el link:', link); }
      area.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(link).then(listo, alternativo);
    else alternativo();
  }

  function videoPantallaCompleta() {
    const m = $('#videoBloque video, #videoBloque iframe', el.vista);
    if (!m) return;
    if (m.requestFullscreen) m.requestFullscreen().catch(() => {});
    else if (m.webkitEnterFullscreen) m.webkitEnterFullscreen();      // iPhone
    else if (m.webkitRequestFullscreen) m.webkitRequestFullscreen();  // Safari antiguo
  }


  /* ===================================================================
     6. IMÁGENES FALTANTES → MARCADORES ELEGANTES
        Si una imagen con data-fallback no se encuentra, se reemplaza
        por un recuadro con ícono en lugar del clásico ícono roto.
     =================================================================== */

  document.addEventListener('error', function (e) {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.dataset && t.dataset.fallback) imagenFaltante(t);
  }, true);

  function imagenFaltante(img) {
    const tipo = img.dataset.fallback;

    if (tipo === 'logo') {               // Sin logo: se muestra el logo genérico
      el.html.classList.add('sin-logo');
      img.remove();
      return;
    }

    const ph = document.createElement('div');
    if (tipo === 'portada') {
      ph.className = 'ph ph--portada';
      ph.innerHTML = icono(img.dataset.icono || 'caja', 'ph__ico');
    } else {
      ph.className = 'ph ph--captura';
      ph.innerHTML = icono('imagen', 'ph__ico') + '<span>Captura pendiente</span>';
      const boton = img.closest('.captura');
      if (boton) { boton.disabled = true; boton.classList.add('captura--vacia'); }
    }
    img.replaceWith(ph);
  }


  /* ===================================================================
     7. GALERÍA AMPLIADA (LIGHTBOX)
     =================================================================== */

  const lb = { lista: [], pos: 0 };

  function abrirLightbox(indice) {
    // Solo se recorren las capturas que existen
    const botones = $$('.captura:not(.captura--vacia)', el.vista);
    lb.lista = botones.map(b => ({ src: b.dataset.src, alt: ($('img', b) || {}).alt || '' }));
    lb.pos = Math.max(0, botones.findIndex(b => +b.dataset.indice === indice));
    if (!lb.lista.length) return;
    el.lb.hidden = false;
    el.html.classList.add('bloqueado');
    pintarLightbox();
  }

  function pintarLightbox() {
    const item = lb.lista[lb.pos];
    el.lbImg.src = item.src;
    el.lbImg.alt = item.alt;
    el.lbCap.textContent = 'Captura ' + (lb.pos + 1) + ' de ' + lb.lista.length;
    const varias = lb.lista.length > 1;
    $('.lb__prev', el.lb).hidden = !varias;
    $('.lb__next', el.lb).hidden = !varias;
  }

  function moverLightbox(paso) {
    if (lb.lista.length < 2) return;
    lb.pos = (lb.pos + paso + lb.lista.length) % lb.lista.length;
    pintarLightbox();
  }

  function cerrarLightbox() {
    el.lb.hidden = true;
    el.lbImg.removeAttribute('src');
    if (!pres.abierta) el.html.classList.remove('bloqueado');
  }


  /* ===================================================================
     8. MODO PRESENTACIÓN
        Diapositivas: portada → una por herramienta → cierre.
     =================================================================== */

  const pres = { abierta: false, pos: 0, slides: [], pantallaPropia: false };

  function slidePortada() {
    const c = contar();
    const conLogo = hay(CONF.logo) && !el.html.classList.contains('sin-logo');
    const kpi = (txt, n, k) => '<div class="skpi skpi--' + k + '"><strong>' + n + '</strong><span>' + txt + '</span></div>';
    return '<div class="slide slide--portada">' +
      (conLogo
        ? '<img class="slide__logo" src="' + esc(CONF.logo) + '" alt="' + esc(CONF.empresa) + '">'
        : '<div class="slide__simbolo">' + icono('fabrica') + '</div>') +
      '<p class="slide__pre">' + esc(CONF.empresa) + '</p>' +
      '<h1 class="slide__titulo-xl">' + esc(CONF.titulo) + '</h1>' +
      (hay(CONF.bienvenida) ? '<p class="slide__lead">' + texto(CONF.bienvenida) + '</p>' : '') +
      '<div class="slide__kpis">' +
        kpi('Herramientas', c.total, 'todos') + kpi('En producción', c.produccion, 'produccion') +
        kpi('En prueba', c.prueba, 'prueba') + kpi('En desarrollo', c.desarrollo, 'desarrollo') +
      '</div></div>';
  }

  function slideHerramienta(h) {
    const funcs = (h.funcionalidades || []).filter(f => f && hay(f.titulo)).slice(0, 4);
    const benef = (h.beneficios || []).filter(hay).slice(0, 4);
    return '<div class="slide slide--herr">' +
      '<div class="slide__col">' +
        '<div class="slide__cab"><div class="slide__ico">' + icono(h.icono) + '</div>' +
          '<div class="slide__meta">' + badgeEstado(h, true) +
            (hay(h.area) ? '<span class="meta">' + icono('usuarios') + esc(h.area) + '</span>' : '') +
          '</div></div>' +
        '<h2 class="slide__titulo">' + esc(h.nombre) + '</h2>' +
        (hay(h.descripcionCorta) ? '<p class="slide__lead">' + texto(h.descripcionCorta) + '</p>' : '') +
        (hay(h.linkWeb) ? '<p class="slide__link">' + icono('externo') + esc(h.linkWeb) + '</p>' : '') +
        (hay(h.problemaQueResuelve)
          ? '<div class="slide__problema"><h3>' + icono('alerta') + '¿Qué problema resuelve?</h3><p>' +
            texto(h.problemaQueResuelve) + '</p></div>' : '') +
      '</div>' +
      '<div class="slide__col">' +
        (funcs.length
          ? '<h3 class="slide__sub">' + icono('capas') + 'Funcionalidades</h3><ul class="slide__funcs">' +
            funcs.map((f, n) => '<li><span class="slide__num">' + (n + 1) + '</span><div><strong>' + esc(f.titulo) + '</strong>' +
              (hay(f.descripcion) ? '<span>' + texto(f.descripcion) + '</span>' : '') + '</div></li>').join('') + '</ul>'
          : '') +
        (benef.length
          ? '<h3 class="slide__sub">' + icono('estrella') + 'Beneficios</h3><ul class="slide__benef">' +
            benef.map(b => '<li>' + icono('tilde') + '<span>' + texto(b) + '</span></li>').join('') + '</ul>'
          : '') +
      '</div></div>';
  }

  function slideCierre() {
    return '<div class="slide slide--cierre">' +
      '<div class="slide__simbolo">' + icono('chat') + '</div>' +
      '<h1 class="slide__titulo-xl">¿Preguntas?</h1>' +
      '<p class="slide__lead">Gracias por su atención.</p>' +
      '<p class="slide__pre">' + esc(CONF.empresa) + '</p></div>';
  }

  function abrirPresentacion(desde) {
    if (!DATOS) return;
    pres.slides = [slidePortada()].concat(DATOS.map(slideHerramienta), [slideCierre()]);
    el.presPuntos.innerHTML = pres.slides.map((_, n) =>
      '<button class="pres__punto" type="button" data-accion="pres-ir" data-indice="' + n + '" aria-label="Ir a la diapositiva ' + (n + 1) + '"></button>'
    ).join('');

    el.pres.hidden = false;
    el.html.classList.add('bloqueado');
    pres.abierta = true;
    irSlide(Math.max(0, Math.min(desde || 0, pres.slides.length - 1)), 0);
    el.pres.focus();

    // Pasa a pantalla completa (si el navegador lo permite)
    pres.pantallaPropia = false;
    if (pantallaSoportada && !enPantallaCompleta()) {
      pres.pantallaPropia = true;
      pedirPantallaCompleta();
    }
  }

  function cerrarPresentacion() {
    if (!pres.abierta) return;
    pres.abierta = false;
    el.pres.hidden = true;
    el.presEscenario.innerHTML = '';
    el.html.classList.remove('bloqueado');
    if (pres.pantallaPropia && enPantallaCompleta()) salirPantallaCompleta();
    pres.pantallaPropia = false;
  }

  function irSlide(n, direccion) {
    if (n < 0 || n >= pres.slides.length) return;
    pres.pos = n;
    const anim = direccion > 0 ? 'desde-der' : direccion < 0 ? 'desde-izq' : 'aparecer';
    el.presEscenario.innerHTML = '<div class="slide-marco ' + anim + '">' + pres.slides[n] + '</div>';
    el.presEscenario.scrollTop = 0;
    el.presContador.textContent = (n + 1) + ' / ' + pres.slides.length;
    el.presProgreso.style.width = ((n + 1) / pres.slides.length * 100) + '%';
    $$('.pres__punto', el.presPuntos).forEach((p, k) => p.classList.toggle('activo', k === n));
    el.presPrev.disabled = n === 0;
    el.presNext.disabled = n === pres.slides.length - 1;
  }

  function moverSlide(paso) { irSlide(pres.pos + paso, paso); }

  // Deslizar con el dedo en celulares y tablets
  (function () {
    let x0 = null, y0 = null;
    el.pres.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.pres.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) moverSlide(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });
  })();


  /* ===================================================================
     9. TEMA, MENÚ Y PANTALLA COMPLETA
     =================================================================== */

  function pintarBotonTema() {
    const oscuro = el.html.getAttribute('data-theme') === 'dark';
    el.btnTema.innerHTML = icono(oscuro ? 'sol' : 'luna');
    el.btnTema.title = oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    el.btnTema.setAttribute('aria-label', el.btnTema.title);
  }

  function alternarTema() {
    const oscuro = el.html.getAttribute('data-theme') !== 'dark';
    el.html.setAttribute('data-theme', oscuro ? 'dark' : 'light');
    LS.set('portal-tema', oscuro ? 'oscuro' : 'claro');
    pintarBotonTema();
  }

  function alternarColapso() {
    const colapsado = el.html.classList.toggle('sb-colapsado');
    LS.set('portal-sidebar', colapsado ? '1' : '0');
  }

  function alternarMenuMovil() { el.html.classList.toggle('menu-abierto'); }
  function cerrarMenuMovil() { el.html.classList.remove('menu-abierto'); }

  const raiz = document.documentElement;
  const pantallaSoportada = !!(raiz.requestFullscreen || raiz.webkitRequestFullscreen);

  function enPantallaCompleta() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }

  function pedirPantallaCompleta() {
    try {
      const r = raiz.requestFullscreen ? raiz.requestFullscreen() : raiz.webkitRequestFullscreen();
      if (r && r.catch) r.catch(() => { pres.pantallaPropia = false; });
    } catch (e) { pres.pantallaPropia = false; }
  }

  function salirPantallaCompleta() {
    try {
      const r = document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
      if (r && r.catch) r.catch(() => {});
    } catch (e) { /* nada */ }
  }

  function alternarPantallaCompleta() {
    if (enPantallaCompleta()) salirPantallaCompleta(); else pedirPantallaCompleta();
  }

  function alCambiarPantalla() {
    const activa = enPantallaCompleta();
    el.btnPantalla.innerHTML = icono(activa ? 'minimizar' : 'maximizar');
    el.btnPantalla.title = activa ? 'Salir de pantalla completa' : 'Pantalla completa';
    // Si se sale de pantalla completa con Esc durante la presentación, se cierra la presentación
    if (!activa && pres.abierta && pres.pantallaPropia) {
      pres.pantallaPropia = false;
      cerrarPresentacion();
    }
  }
  document.addEventListener('fullscreenchange', alCambiarPantalla);
  document.addEventListener('webkitfullscreenchange', alCambiarPantalla);


  /* ===================================================================
     10. EVENTOS E INICIO
     =================================================================== */

  // Todos los botones usan data-accion="..." y se manejan acá
  document.addEventListener('click', function (e) {
    const b = e.target.closest('[data-accion]');
    if (!b) return;
    switch (b.dataset.accion) {
      case 'presentar':      abrirPresentacion(+b.dataset.desde || 0); break;
      case 'filtro-estado':  ui.estado = b.dataset.valor; aplicarFiltros(); break;
      case 'filtro-area':    ui.area = b.dataset.valor; aplicarFiltros(); break;
      case 'limpiar':
        ui.estado = 'todos'; ui.area = 'todas'; ui.busqueda = ''; el.buscador.value = '';
        aplicarFiltros(); break;
      case 'ir-video': {
        const v = $('#seccion-video');
        if (v) v.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'video-pantalla': videoPantallaCompleta(); break;
      case 'copiar-link':    copiarLink(b); break;
      case 'captura':        abrirLightbox(+b.dataset.indice); break;
      case 'lb-cerrar':      cerrarLightbox(); break;
      case 'lb-prev':        moverLightbox(-1); break;
      case 'lb-next':        moverLightbox(1); break;
      case 'pres-salir':     cerrarPresentacion(); break;
      case 'pres-prev':      moverSlide(-1); break;
      case 'pres-next':      moverSlide(1); break;
      case 'pres-ir':        irSlide(+b.dataset.indice, +b.dataset.indice - pres.pos); break;
      case 'tema':           alternarTema(); break;
      case 'pantalla':       alternarPantallaCompleta(); break;
      case 'colapsar':       alternarColapso(); break;
      case 'menu':           alternarMenuMovil(); break;
      case 'cerrar-menu':    cerrarMenuMovil(); break;
    }
  });

  // Clic en el fondo oscuro del lightbox → cerrar
  el.lb.addEventListener('click', e => {
    if (e.target === el.lb || e.target.classList.contains('lb__figura')) cerrarLightbox();
  });

  // Buscador
  el.buscador.addEventListener('input', () => {
    ui.busqueda = el.buscador.value;
    aplicarFiltros();
  });

  // Teclado
  document.addEventListener('keydown', e => {
    const enCampo = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
    const enBoton = e.target.tagName === 'BUTTON' || e.target.tagName === 'A';

    // Lightbox abierto
    if (!el.lb.hidden) {
      if (e.key === 'Escape') cerrarLightbox();
      else if (e.key === 'ArrowRight') moverLightbox(1);
      else if (e.key === 'ArrowLeft') moverLightbox(-1);
      return;
    }

    // Modo presentación abierto (también funciona con presentadores/clickers USB)
    if (pres.abierta) {
      if ((e.key === ' ' || e.key === 'Enter') && enBoton) return; // lo maneja el botón
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ':
          e.preventDefault(); moverSlide(1); break;
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace':
          e.preventDefault(); moverSlide(-1); break;
        case 'Home': e.preventDefault(); irSlide(0, -1); break;
        case 'End':  e.preventDefault(); irSlide(pres.slides.length - 1, 1); break;
        case 'Escape': cerrarPresentacion(); break;
      }
      return;
    }

    // Atajo "/" para ir al buscador
    if (e.key === '/' && !enCampo) { e.preventDefault(); el.buscador.focus(); return; }

    if (e.key === 'Escape') {
      if (e.target === el.buscador && el.buscador.value) {
        el.buscador.value = ''; ui.busqueda = ''; aplicarFiltros();
      }
      cerrarMenuMovil();
    }
  });

  // Inicio de la aplicación
  function iniciar() {
    pintarIconos(document);
    renderMarca();
    pintarBotonTema();
    if (!pantallaSoportada) el.btnPantalla.hidden = true;
    renderNav();
    window.addEventListener('hashchange', router);
    router();
  }

  iniciar();
})();
