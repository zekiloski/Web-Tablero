/* =====================================================================
   PORTAL DE HERRAMIENTAS DIGITALES — ONCATIVO S.A.
   ---------------------------------------------------------------------
   ★ ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE EDITAR PARA CAMBIAR CONTENIDO ★

   Reglas básicas para no romper nada:
   - Los textos van siempre entre comillas dobles: "así".
   - Si un texto necesita comillas adentro, usá comillas simples: "el 'botón' verde".
   - Cada herramienta es un bloque { ... } y entre bloques va una coma.
   - Si un campo queda vacío ("" o []), esa sección se OCULTA sola en la página.
   - Para un salto de línea dentro de un texto, escribí \n

   Valores posibles de "estado":
       "produccion"  → etiqueta verde    "En producción"
       "prueba"      → etiqueta amarilla "En prueba"
       "desarrollo"  → etiqueta azul     "En desarrollo"

   Íconos disponibles para el campo "icono" (ver js/icons.js):
       herramienta, documento, email, robot, calculadora, camion, caja,
       grafico, fabrica, edificio, portapapeles, baseDatos, chat, dinero,
       ajustes, carpeta, escudo
   ===================================================================== */


/* ---------------------------------------------------------------------
   CONFIGURACIÓN GENERAL DEL PORTAL
   --------------------------------------------------------------------- */
const CONFIG = {
  // Nombre de la empresa (aparece en el menú, la presentación y el pie)
  empresa: "Oncativo S.A.",

  // Título del portal
  titulo: "Portal de Herramientas Digitales",

  // Logo: copiá el archivo en /img y poné acá su nombre.
  // Si el archivo no existe, se muestra un logo genérico con el nombre de la empresa.
  logo: "img/logo.png",

  // Mensaje de bienvenida de la pantalla de inicio
  bienvenida: "Estas son las herramientas digitales que desarrollamos para ordenar el trabajo, ahorrar tiempo y tener mejor información en cada área de la empresa."
};


/* ---------------------------------------------------------------------
   LISTA DE HERRAMIENTAS
   El orden en que aparecen acá es el orden en el menú, en las tarjetas
   y en el Modo Presentación.
   --------------------------------------------------------------------- */
const HERRAMIENTAS = [

  /* ===================== 1. MANTENIMIENTOAPP ===================== */
  {
    // Identificador único: sin espacios, sin tildes, sin ñ (se usa en la dirección de la página)
    id: "mantenimiento",

    // Nombre visible de la herramienta
    nombre: "MantenimientoApp",

    // Ícono del menú y de las tarjetas (ver lista arriba)
    icono: "herramienta",

    // Imagen de portada de la tarjeta (si no existe, se muestra el ícono sobre un fondo de color)
    portada: "img/mantenimiento.png",

    // Resumen de 1 o 2 líneas para la tarjeta del inicio
    descripcionCorta: "Gestión del mantenimiento de las máquinas de planta: fallas, reparaciones y servicios preventivos, desde el celular.",

    // Explicación sencilla del problema, pensada para personas no técnicas
    problemaQueResuelve: "Antes, las fallas y los trabajos de mantenimiento se anotaban en papel o en planillas sueltas. Se perdía el historial de cada máquina, era difícil saber qué estaba pendiente y no había datos para planificar los servicios preventivos.",

    // Área de la empresa que la usa (también se usa para el filtro del inicio)
    area: "Mantenimiento",

    // Estado: "produccion" | "prueba" | "desarrollo"
    estado: "produccion",

    // Fecha de puesta en marcha o de la última versión (formato AAAA-MM-DD)
    fecha: "2025-06-10",

    // Link a la aplicación (botón "Abrir aplicación"). Vacío = el botón no se muestra
    linkWeb: "https://hotpink-deer-791199.hostingersite.com/",

    // Video demostrativo: ruta local ("videos/archivo.mp4") o link de YouTube. Vacío = se oculta
    video: "videos/mantenimiento.mp4",

    // Capturas de pantalla para la galería (se pueden agregar las que quieras)
    capturas: [
      "img/mantenimiento-1.jpeg",
      "img/mantenimiento-2.jpeg",
      "img/mantenimiento-3.jpeg"
    ],

    // Funcionalidades: cada una se ve como una mini-tarjeta.
    // "observacion" es una nota para explicar durante la demo (si queda vacía, no se muestra)
    funcionalidades: [
      {
        titulo: "Carga de fallas desde el celular",
        descripcion: "El operario informa una falla de la máquina en segundos, con una descripción y una foto, sin moverse de su puesto.",
        observacion: "Mostrar en vivo cómo se carga una falla desde el teléfono."
      },
      {
        titulo: "Historial por máquina",
        descripcion: "Cada máquina tiene su ficha con todas las reparaciones realizadas, quién las hizo y qué repuestos se usaron.",
        observacion: "Abrir la ficha de una máquina que todos conozcan para que se entienda el ejemplo."
      },
      {
        titulo: "Mantenimiento preventivo",
        descripcion: "Avisa cuándo corresponde hacer un service programado, antes de que la máquina se rompa.",
        observacion: "Remarcar que esto reduce las paradas no planificadas."
      },
      {
        titulo: "Indicadores de paradas",
        descripcion: "Muestra cuántas horas estuvo parada cada máquina y por qué motivo, para tomar decisiones con datos.",
        observacion: ""
      }
    ],

    // Beneficios para la empresa (una línea cada uno)
    beneficios: [
      "Menos horas de máquina parada.",
      "Historial completo y ordenado de cada equipo.",
      "Información en tiempo real para los jefes de área.",
      "Se elimina el papel y las planillas sueltas."
    ],

    // Nota general para quien presenta la demo
    observaciones: "Empezar contando cómo se trabajaba con papel y después mostrar la carga desde el celular. Duración sugerida: 5 minutos."
  },


  /* ===================== 2. NUEVOS DESARROLLOS ===================== */
  {
    id: "nuevos-desarrollos",
    nombre: "Nuevos Desarrollos",
    icono: "documento",
    portada: "img/nuevos-desarrollos.png",
    descripcionCorta: "Registro y seguimiento de las piezas nuevas que traen clientes y vendedores, hasta su aprobación y codificación.",
    problemaQueResuelve: "Los pedidos de piezas nuevas llegaban por distintos canales (mail, WhatsApp, en persona) y no había un lugar único para ver en qué etapa estaba cada uno. Se demoraban las respuestas a los clientes y a veces se perdía información técnica.",
    area: "Oficina Técnica",
    estado: "produccion",
    fecha: "2026-09-01",
    linkWeb: "https://snow-sheep-342512.hostingersite.com/login",
    video: "videos/nuevos-desarrollos.mp4",
    capturas: [
      "img/nuevos-desarrollos-1.jpeg",
      "img/nuevos-desarrollos-2.jpeg",
      "img/nuevos-desarrollos-3.jpeg"
    ],
    funcionalidades: [
      {
        titulo: "Alta de una pieza nueva",
        descripcion: "El vendedor carga la pieza con los datos del cliente, planos, fotos y cantidades estimadas.",
        observacion: "Cargar una pieza de ejemplo en vivo, con un plano adjunto."
      },
      {
        titulo: "Seguimiento por etapas",
        descripcion: "Cada pieza avanza por etapas claras: recibida, en análisis, cotizada, aprobada y codificada.",
        observacion: "Mostrar el tablero con las piezas agrupadas por etapa."
      },
      {
        titulo: "Aprobación y codificación",
        descripcion: "Cuando la pieza se aprueba, Oficina Técnica le asigna su código definitivo y queda lista para producir.",
        observacion: "Explicar quién aprueba en cada paso."
      },
      {
        titulo: "Avisos a los responsables",
        descripcion: "Cada vez que una pieza cambia de etapa, se avisa a las personas que tienen que intervenir.",
        observacion: "Funcionalidad en prueba: comentar que se está ajustando con los usuarios."
      }
    ],
    beneficios: [
      "Un solo lugar para todos los pedidos de piezas nuevas.",
      "Respuestas más rápidas a clientes y vendedores.",
      "No se pierde información técnica ni planos.",
      "Se sabe en todo momento en qué etapa está cada pieza."
    ],
    observaciones: "Está en producción: la usan todos los vendedores y Oficina Técnica. Pedir opiniones y sugerencias al final de la demo."
  },


  /* ===================== 3. AVISO AUTOMÁTICO DE DESPACHOS ===================== */
  {
    id: "aviso-despachos",
    nombre: "Aviso automático de despachos",
    icono: "email",
    portada: "img/aviso-despachos.png",
    descripcionCorta: "Envía un correo al cliente automáticamente cuando se carga un despacho, con los datos de la mercadería y del transporte.",
    problemaQueResuelve: "Los clientes llamaban o escribían para preguntar si su pedido ya había salido y con qué transporte. Responder cada consulta a mano llevaba tiempo y a veces el aviso no llegaba.",
    area: "Recepción/Despachos",
    estado: "produccion",
    fecha: "2025-11-03",
    linkWeb: "https://chocolate-newt-266021.hostingersite.com/panel/login.php",
    video: "videos/aviso-despachos.mp4",
    capturas: [
      "img/aviso-despachos.jpg",
      "img/aviso-despachos-1.jpg"
    ],
    funcionalidades: [
      {
        titulo: "Detección automática de despachos",
        descripcion: "Un programa revisa el sistema cada pocos minutos y detecta cuando se carga un despacho nuevo.",
        observacion: "Aclarar que nadie tiene que hacer nada extra: funciona solo."
      },
      {
        titulo: "Correo con el detalle de la mercadería",
        descripcion: "El cliente recibe un mail prolijo con los productos, las cantidades y el número de remito.",
        observacion: "Mostrar un correo real de ejemplo (sin datos sensibles)."
      },
      {
        titulo: "Datos del transporte",
        descripcion: "El correo incluye el transporte, el chofer o la empresa de logística y la fecha estimada de entrega.",
        observacion: ""
      },
      {
        titulo: "Registro de envíos",
        descripcion: "Queda guardado a quién se le envió cada aviso y cuándo, por si hay que verificarlo.",
        observacion: "Útil ante un reclamo: se puede demostrar que el aviso se envió."
      },
      {
        titulo: "Seguimiento del envío (nuevo, en prueba)",
        descripcion: "Nueva funcionalidad: el cliente tiene una página para seguir su pedido, expedición cuenta con un panel de control y los remitos se cargan solos desde el sistema. Ya está desarrollada y en prueba; el próximo paso es sumar el código y el link de seguimiento dentro del correo de despacho.",
        observacion: "Aclarar que todavía está en prueba: el aviso por email ya funciona con clientes, falta unir ambas partes."
      }
    ],
    etapasTitulo: "El aviso por email ya funciona con clientes y el seguimiento está desarrollado y en prueba; falta unirlos.",
    etapas: [
      {
        nombre: "Aviso por email",
        incluye: "Email automático al cliente al despachar, con productos y transporte.",
        estado: "produccion",
        estadoTexto: "En producción, enviando a clientes"
      },
      {
        nombre: "Seguimiento",
        incluye: "Página del cliente, panel de expedición, carga automática de remitos desde el sistema.",
        estado: "prueba",
        estadoTexto: "Desarrollado, en prueba"
      },
      {
        nombre: "Integración",
        incluye: "Código y link de seguimiento dentro del email de despacho; confirmación de recepción por el cliente; seguimiento en producción.",
        estado: "desarrollo",
        estadoTexto: "Propuesta"
      },
      {
        nombre: "Mejoras",
        incluye: "QR en el remito para que el transportista marque la entrega desde el celular, aviso por WhatsApp en cada cambio de etapa, mapa del recorrido, estadísticas de demora por transporte.",
        estado: "",
        estadoTexto: "A definir"
      }
    ],
    beneficios: [
      "Menos llamadas y consultas de clientes.",
      "Mejor imagen: el cliente se entera al instante.",
      "Ahorro de tiempo para el personal de despachos.",
      "Registro de cada aviso enviado."
    ],
    observaciones: "Es un script en Python que corre en segundo plano. En la demo conviene mostrar el resultado (el correo que recibe el cliente) más que la parte técnica."
  },


  /* ===================== 4. AGENTE DE PRODUCCIÓN CON IA ===================== */
  {
    id: "agente-produccion-ia",
    nombre: "Agente de Producción con IA",
    icono: "robot",
    portada: "img/agente-produccion-ia.png",
    descripcionCorta: "Cruza lo que falta entregar a clientes con lo que se está fabricando en planta y ayuda a decidir qué producir primero, cuánto producir y en qué máquina, usando el historial de producción y ventas.",
    problemaQueResuelve: "Para decidir qué fabricar había que cruzar a mano las notas de venta pendientes, el stock y las órdenes de trabajo abiertas, buscando en el ERP y en varias planillas. Era difícil saber qué estaba más atrasado, cuánto convenía producir para la temporada y armar el plan de cada sector con las horas reales disponibles.",
    area: "Producción",
    estado: "produccion",
    fecha: "2026-10-20",
    linkWeb: "http://192.168.1.230:4000/",
    video: "videos/agente-produccion-ia.mp4",
    capturas: [
      "img/agente-produccion-ia-1.jpeg",
      "img/agente-produccion-ia-2.jpeg"
    ],
    funcionalidades: [
      {
        titulo: "🔥 Lo templado: reporte diario de Temple",
        descripcion: "Muestra lo que se cargó en Temple entre dos fechas (por defecto, ayer), consultado en vivo al ERP. Si un código tiene varias OT, se agrupa en un solo renglón. Se pueden destildar filas, elegir la fecha que figura en la hoja y escribir observaciones del sector (paradas, fallas…) que salen al pie. Con el botón 'Imprimir lo templado' queda lista la hoja del día.",
        observacion: "Función destacada: mostrar el reporte de ayer en vivo e imprimirlo con una observación de ejemplo. Aclarar que las observaciones no se guardan; quedan solo en la hoja impresa."
      },
      {
        titulo: "Dashboard de pendientes priorizados",
        descripcion: "Trae del ERP todo lo que falta entregar a clientes y lo ordena por prioridad, combinando cuánto está atrasado (60%) y el volumen a producir (40%). Muestra kg y unidades pendientes, % cubierto por stock, artículos vencidos y niveles de urgencia.",
        observacion: "Mostrar la sincronización con el ERP y cómo cambia el orden al ajustar los pesos de prioridad."
      },
      {
        titulo: "Envío a producción con máquina sugerida",
        descripcion: "Se eligen los productos y se envían a producción. El sistema sugiere la máquina de corte (Guillotina, Plasma o la más usada históricamente) y la cantidad según la predicción y lo que falta para la campaña.",
        observacion: "Lo enviado se imprime como orden para planta desde la pantalla Producción."
      },
      {
        titulo: "Predicción por temporada",
        descripcion: "Con el historial de producción y 6 años de ventas, clasifica cada producto en continuo o estacional y sugiere qué adelantar y cuánto fabricar. Lo cruza con el calendario agrícola argentino para saber cuándo empezar.",
        observacion: "Por defecto muestra solo lo que está 'en temporada': este mes o el próximo."
      },
      {
        titulo: "Órdenes de trabajo abiertas",
        descripcion: "Muestra las OT abiertas en planta, una fila por cada proceso (corte, temple, pintura, afilado…), con requerido, fabricado y saldo. Se pueden filtrar, imprimir y exportar.",
        observacion: "Desde esta pantalla se abre el reporte 'Lo templado'."
      },
      {
        titulo: "Armar plan por sector",
        descripcion: "Arma el plan de un sector (por ejemplo, Temple) con turnos y horas disponibles, y lo compara contra las horas requeridas según las piezas por hora de cada código.",
        observacion: "Mostrar un plan de Temple con el total de horas requeridas contra las disponibles."
      },
      {
        titulo: "Carga de planillas Excel",
        descripcion: "Alternativa sin ERP: se sube un Excel, el sistema reconoce las columnas y marca valores sospechosos (un cero de más, fechas fuera de rango, datos faltantes) sin corregir nada solo.",
        observacion: ""
      }
    ],
    beneficios: [
      "Reporte diario de Temple listo para imprimir, sin armarlo a mano.",
      "Se sabe qué fabricar primero según atraso y volumen.",
      "Cantidades sugeridas con base en el historial real de producción y ventas.",
      "Adelantarse a la temporada de cada producto.",
      "Planes por sector con horas requeridas contra horas disponibles.",
      "Todo sale del ERP en modo solo lectura: el sistema nunca modifica el ERP."
    ],
    observaciones: "La app corre en una PC de la empresa y se abre desde el navegador en cualquier máquina de la red interna. En la demo conviene seguir el recorrido de un día: Dashboard → Enviar a producción → Predicción → Órdenes de trabajo → Lo templado → Armar plan."
  }


  // Para agregar otra herramienta: poné una coma después de la llave } de arriba
  // y pegá un bloque nuevo { ... } (ver ejemplo en el README).
];
