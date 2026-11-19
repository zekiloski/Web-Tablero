/* =====================================================================
   ÍCONOS SVG DEL PORTAL
   ---------------------------------------------------------------------
   Están incluidos acá para que funcionen SIN INTERNET.
   En data.js, el campo "icono" de cada herramienta usa uno de estos
   nombres (por ejemplo: "herramienta", "email", "robot").

   Para agregar un ícono nuevo: sumar una línea con el formato
       nombre: '<path d="..."/>',
   usando dibujos de 24x24 de trazo (estilo "outline").
   ===================================================================== */

const ICONOS = {
  /* ---------- Íconos para herramientas (usables en data.js) ---------- */
  herramienta: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  documento:   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6M9 15h6"/>',
  email:       '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  robot:       '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/><path d="M9 13v2M15 13v2M1 14h2M21 14h2"/>',
  calculadora: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/>',
  camion:      '<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  caja:        '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  grafico:     '<path d="M3 3v18h18"/><path d="M7 16v-5M12 16V8M17 16v-8"/>',
  fabrica:     '<path d="M2 20V8l6 4V8l6 4V4h8v16z"/><path d="M2 20h20M17 16h1M12 16h1M7 16h1"/>',
  edificio:    '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  portapapeles:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  baseDatos:   '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
  chat:        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  dinero:      '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  ajustes:     '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  carpeta:     '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  escudo:      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',

  /* ---------- Íconos de la interfaz ---------- */
  inicio:      '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  presentacion:'<path d="M2 3h20"/><path d="M4 3v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3"/><path d="m7 21 5-5 5 5"/>',
  buscar:      '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  zoom:        '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>',
  maximizar:   '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  minimizar:   '<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>',
  sol:         '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  luna:        '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  menu:        '<path d="M4 6h16M4 12h16M4 18h16"/>',
  panel:       '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 10l-2 2 2 2"/>',
  chevronIzq:  '<path d="m15 18-6-6 6-6"/>',
  chevronDer:  '<path d="m9 18 6-6-6-6"/>',
  flechaIzq:   '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  flechaDer:   '<path d="M5 12h14M12 5l7 7-7 7"/>',
  cerrar:      '<path d="M18 6 6 18M6 6l12 12"/>',
  externo:     '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  play:        '<path d="m6 3 14 9-14 9z"/>',
  video:       '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  imagen:      '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  calendario:  '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  usuarios:    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  check:       '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  tilde:       '<path d="M20 6 9 17l-5-5"/>',
  reloj:       '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  codigo:      '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  grilla:      '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  foco:        '<path d="M9 18h6M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
  info:        '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  alerta:      '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
  capas:       '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  estrella:    '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  filtro:      '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>'
};
