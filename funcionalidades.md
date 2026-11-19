# Agente de Producción IA — Qué hace el sistema

> Guía funcional para entender, sin conocimientos técnicos, qué hace cada pantalla, de dónde salen los datos y cómo se calculan los números.

---

## 1. En una frase

El sistema toma **lo que falta entregar a clientes** (los pendientes de las notas de venta) y **lo que se está fabricando en planta** (las órdenes de trabajo), y ayuda a decidir **qué producir primero, cuánto producir y en qué máquina**, usando el historial de producción y de ventas de la empresa.

## 2. El recorrido típico de un día

```
 ERP / Excel                                    Planta
     │                                             ▲
     ▼                                             │
┌───────────┐  enviar   ┌────────────┐            │
│ Dashboard │ ────────► │ Producción │ ── imprimir orden ──┘
│ (pendien- │           └────────────┘
│  tes prio-│
│  rizados) │◄── sugerencias ──┐
└───────────┘                  │
                        ┌────────────┐
                        │ Predicción │  (qué conviene fabricar según la temporada)
                        └────────────┘

┌──────────────────┐  enviar  ┌─────────────┐
│ Órdenes de       │ ───────► │ Armar Plan  │ ── imprimir / Excel ──► sector (ej. Temple)
│ trabajo (OT)     │          │ (por sector)│
└──────────────────┘          └─────────────┘
```

1. **Dashboard**: se sincronizan los pendientes desde el ERP y se ve la lista ordenada por prioridad.
2. Se eligen los productos a fabricar y se **envían a producción**, con la máquina de corte y la cantidad.
3. **Producción**: se imprime la lista de lo enviado como orden para planta.
4. **Predicción**: se consulta qué conviene adelantar según la temporada de cada producto.
5. **Órdenes de trabajo**: se ve qué está abierto en planta, proceso por proceso.
6. **Armar Plan**: se arma el plan de un sector (por ejemplo, Temple) con horas requeridas y horas disponibles.

---

## 3. Pantallas

### 3.1 Dashboard (pendientes priorizados)

Es la pantalla principal. Muestra **todos los productos con saldo pendiente de entrega**, ordenados por prioridad.

**De dónde salen los datos (dos formas):**

| Forma | Cómo | Notas |
|---|---|---|
| **Sincronizar desde ERP** | Botón en el Dashboard. Lee en vivo las notas de venta del ERP (saldo pendiente, peso, fecha de entrega, cliente). | Excluye las líneas cerradas/facturadas (estado 3) aunque tengan saldo. Si un código tiene varios pedidos, se agrupan en una fila con la **fecha de entrega más antigua**, y se guarda el detalle de cada pedido. |
| **Cargar planilla Excel** | Botón "Cargar nueva planilla". Se sube el archivo y se indica qué columna es cada dato. | Ver [sección 4](#4-carga-de-planillas-excel). |

**Indicadores (tarjetas de arriba):**

| Indicador | Qué significa |
|---|---|
| **Kg pendientes** | Suma de (peso unitario × saldo) de todos los productos. No descuenta stock. |
| **Unidades pendientes** | Suma de los saldos, en unidades. No descuenta stock. |
| **% cubierto por stock** | De los productos con saldo, qué porcentaje ya tiene stock suficiente para cubrirlo entero. |
| **Artículos vencidos** | Productos con fecha de entrega ya pasada **y** que todavía necesitan fabricarse (no cubiertos por stock). |

También hay un **gráfico de artículos por nivel de urgencia**.

**Columnas clave de la tabla:**

- **Saldo**: lo que falta entregar al cliente.
- **A producir** = saldo − stock disponible (nunca menos de 0). Es lo que realmente hay que fabricar.
  - ⚠️ Cuando los datos vienen **sincronizados desde el ERP**, el stock **no se descuenta** (A producir = Saldo), porque el stock que informa el ERP hoy no es confiable (hay casos con stock negativo). Si se carga una planilla Excel con stock propio, ese stock sí se descuenta.
- **Kg / Kg. Total**: peso unitario y peso total del saldo.
- **Días vencido**: cuántos días pasaron desde la fecha de entrega (negativo = todavía no venció).
- **Urgencia**: categoría según los días vencidos (ver tabla abajo).
- **Grupo**: forma del producto (Redondos Chicos, Redondos Grandes, Rectangulares, No Redondo).
- Etiqueta **"Nuevo"**: el código no estaba en la sincronización/carga anterior.

**Niveles de urgencia** (los límites se pueden cambiar en "Configuración de prioridad"):

| Urgencia | Días vencido (por defecto) |
|---|---|
| Vencido +90 días | más de 90 |
| Vencido 31-90 días | 31 a 90 |
| Vencido 8-30 días | 8 a 30 |
| Vencido 0-7 días | 0 a 7 |
| Futuro | todavía no vence |

**Prioridad (orden de la tabla):** es un puntaje que combina dos cosas:

```
Prioridad = 0,6 × (qué tan atrasado está) + 0,4 × (qué tan grande es el volumen a producir)
```

Ambos factores se llevan a una escala de 0 a 1 comparando contra el resto de los productos. Los pesos 0,6 / 0,4 se ajustan en **Configuración de prioridad**: subir el peso del volumen prioriza los pedidos grandes; subir el de atraso prioriza los más viejos.

**Acciones disponibles:**

- **Filtros** por urgencia, grupo y búsqueda; **Ocultar enviados**.
- **Enviar a producción** (ver 3.1.1).
- **Exportar a Excel** del plan priorizado.
- **Códigos excluidos del plan**: lista de códigos que nunca entran al plan (fletes, seguros, chatarra, repuestos…). Si un código termina en `-` excluye a toda la familia (ej. `ONDI-` excluye `ONDI-123`). Viene precargada con algunos códigos y se puede editar.
- **Configuración de prioridad**: pesos del puntaje y límites de urgencia. Al cambiarlos se recalcula todo al instante, sin volver a cargar datos.

#### 3.1.1 Enviar a producción

Se tildan productos en la tabla y se aprieta **Enviar a producción**. Para cada producto se define:

- **Máquina / proceso de corte**: Guillotina, Plasma, Planchuela, Láser, Punzonado, Laterales, Afilado, o uno nuevo agregado con **"+ Agregar proceso"**.
  - El sistema **sugiere** la máquina:
    - Redondos Chicos → **Guillotina**, siempre.
    - Redondos Grandes → **Plasma**, siempre.
    - Rectangulares y No Redondo → no hay regla fija; se sugiere la máquina **más usada históricamente** para ese código en las OT.
- **Cantidad a producir**: por defecto, lo que falta producir. Como ayuda se muestran:
  - **Sugerido (predicción)**: cantidad recomendada según el historial (botón "Usar sugerido").
  - **Total para cubrir la campaña** (botón "Usar cantidad de campaña").
  - **Ya producido este año** (OT cerradas) y **ya en curso** (OT abiertas).
  - **Falta producir para la campaña** o **Excedente** si ya se produjo más de lo recomendado.

Al confirmar, los productos quedan marcados como **enviados** y aparecen en la pantalla Producción.

### 3.2 Producción

Lista de **lo que ya se envió a producción**, con la máquina asignada y la cantidad confirmada. No es una fuente de datos aparte: son los mismos productos del Dashboard marcados como enviados.

- **Deshacer envío**: el producto vuelve a estado pendiente y reaparece en el Dashboard.
- **Imprimir / Exportar PDF**: imprime la tabla en formato claro (aunque la pantalla esté en modo oscuro), para usar como orden para planta.
- **Descargar Excel**.

> Los productos enviados se conservan aunque desaparezcan de una sincronización posterior (quedan como historial). Los que nunca se enviaron y ya no figuran como pendientes se borran.

### 3.3 Predicción

Responde: **¿qué conviene fabricar ahora y cuánto, según lo que pasó en años anteriores?**

**Datos que usa** (se cargan con los botones de la pantalla):

| Botón | Qué trae |
|---|---|
| **Sincronizar producción desde ERP** | Historial de producción real (órdenes cerradas y avance de las abiertas). |
| **Sincronizar ventas desde ERP (6 años)** | Ventas por código y mes, de los últimos 6 años. |
| **Sincronizar stock desde ERP** | Una **foto** del stock y del peso unitario de cada código. Se muestra con su fecha porque no se actualiza solo. |
| **Cargar otro año** | Alternativa manual: subir un Excel de OT de un año (ej. `OT 2025.xlsx`). Volver a cargar el mismo año reemplaza esos datos. |

**Clasificación de cada producto** (según en cuántos meses del año tuvo producción históricamente):

| Clasificación | Meses con producción | Qué significa |
|---|---|---|
| **Continuo** | 7 a 12 | Se fabrica todo el año; conviene mantenerlo siempre en rotación. |
| **Estacional moderado** | 4 a 6 | Tiene temporada, pero amplia. |
| **Estacional fuerte** | 1 a 3 | Muy concentrado en pocos meses. |

**Cálculos:**

- **Cantidad sugerida**
  - Continuo: promedio mensual histórico (total producido ÷ años de datos ÷ 12).
  - Estacional: promedio histórico de su **mes pico** (el mes en que más se fabricó).
- **Total anual**: lo producido históricamente ÷ años de datos.
- **Total para cubrir la campaña**: igual, pero sumando solo los meses en que ese código tuvo movimiento (su propia temporada).
- **Falta producir para la campaña** = total de campaña − lo ya producido este año (OT cerradas) − lo que ya está en curso (OT abiertas). Si da negativo se muestra como **Excedente**.
- **Kg sugeridos**: la cantidad sugerida × peso unitario (si el código no tiene peso cargado en el ERP, se avisa y no se suma).
- **Máquina sugerida**: la máquina de corte más usada en el historial de ese código.
- **Referencia — historial de ventas**: el patrón de ventas del código, mostrado aparte para comparar contra el patrón de fabricación.

**Qué se muestra por defecto:** solo lo que está **"en temporada"**: los productos Continuos y los Estacionales cuyo mes pico es **este mes o el próximo** (4 a 6 semanas de anticipación). Cualquier otro código se puede encontrar igual con el buscador.

**Calendario agrícola:** cruza el mes pico de cada producto con el calendario general de siembra, cosecha y desmalezado de Argentina por sector (agricultura extensiva, caña de azúcar, fruticultura, horticultura, viticultura), armado con fuentes como INTA, EEAOC y Senasa. Sirve para ver en qué temporada del campo cae la demanda y el **mes sugerido para empezar** a fabricar. Es una referencia aproximada a nivel país.

**Filtros y salidas:** grupo, subgrupo, clasificación, mes, estación, sector agrícola, "solo lo que no está en el plan". Se puede tildar productos para **exportar la selección a Excel** o **imprimir en PDF**, y exportar los productos con pico en el mes actual.

Cada fila indica si el código **ya está en el plan** de pendientes o **no está — revisar**.

### 3.4 Órdenes de trabajo

Muestra las **órdenes de trabajo abiertas en planta**, sincronizadas desde el ERP con el botón **Sincronizar**. Hay **una fila por cada proceso** de cada orden (corte, temple, pintura, afilado…), porque una orden pasa por varias etapas.

**Columnas:** OT, programa, proceso, código, grupo, descripción, **Requerido**, **A producir**, **Fabricado**, **Saldo**, y si el código **está en el plan** de pendientes. Las órdenes que no estaban en la sincronización anterior se marcan como **Nuevo**.

**Filtros:** proceso, grupo, búsqueda (por código u OT), "en el plan de pendientes sí/no", **solo nuevas** y **ocultar etapas terminadas** (prendido por defecto: oculta las etapas sin saldo y que ya fabricaron todo lo pedido). Los filtros activos se resaltan en color, y el **saldo se resalta** cuando se filtró por un proceso o grupo, que es cuando tiene sentido leerlo.

**Acciones sobre la selección** (se tildan filas):

- Resumen con totales de Requerido, A producir y Fabricado.
- **Imprimir (PDF)** y **Exportar a Excel** exactamente lo seleccionado.
- **Enviar a Armar Plan**: copia esas filas al plan del sector correspondiente. Si la selección mezcla procesos (ej. Conformado y Corte Láser), cada uno va a su propio plan.

**🔥 Lo templado:** reporte de lo que se cargó en Temple entre dos fechas (por defecto, ayer), consultado en vivo al ERP. Un mismo código con varias OT se agrupa en un solo renglón. Permite destildar filas, elegir la fecha que figura en la hoja y escribir **observaciones del sector** (paradas, fallas…) que salen al pie. Botón **Imprimir lo templado**. Las observaciones no se guardan.

### 3.5 Armar Plan (por sector)

Arma el **plan de producción de un sector** (ej. Plan de Temple) con los ítems enviados desde Órdenes de trabajo. Hay **un plan único y editable por sector**.

- **Datos del plan**: fecha, número de semana y **turnos** (1 o 2, con hora desde/hasta). El sistema calcula las **horas disponibles** (un turno que cruza la medianoche se cuenta bien).
- **Tabla de ítems**: OT, programa, proceso, código, descripción, A producir, Fabricado, Saldo, **Piezas por hora** y horas requeridas.
- **Horas requeridas** de cada ítem = saldo ÷ piezas por hora. Abajo se compara el **total de horas requeridas contra las horas disponibles**.
- **Piezas por hora**: se pueden cargar de un Excel (código → piezas/hora) y se completan solas para los códigos del plan; si un código no está, se carga a mano en la fila.
- **Capacidad de referencia por tipo de pieza**: tabla editable con la capacidad en doble turno y en un turno. Es solo de consulta: no dispara cálculos ni alertas.
- Quitar ítems del plan, **Imprimir** y **Exportar a Excel**.

> Los ítems del plan son una **copia** de la OT en el momento de agregarlos, así el plan no se pierde cuando se vuelve a sincronizar el ERP. Si se agrega de nuevo una OT que ya estaba, se actualizan sus cantidades y se conservan las piezas por hora cargadas.

### 3.6 Ayuda

Explicación dentro de la app de cada pantalla y cálculo, con botón **Descargar PDF**.

---

## 4. Carga de planillas Excel

Sirve para empresas o casos sin conexión al ERP. Se aplica a pendientes, historial de OT, catálogo de productos y piezas por hora.

1. **Subir el archivo** (arrastrar o elegir).
2. **Confirmar qué columna es cada dato** (código, descripción, cantidad pedida, saldo, peso unitario, fecha de entrega, stock…). El sistema propone el mapeo automáticamente reconociendo nombres habituales y muestra una vista previa. El mapeo se recuerda para la próxima carga.
3. **Revisión de calidad de datos**: el sistema marca valores sospechosos, **sin corregir nada solo**:
   - **Valor fuera de lo común**: números que saltan un orden de magnitud respecto del resto (típico "un cero de más"). Los ceros no se marcan.
   - **Fecha fuera de rango razonable**: más de 5 años antes o después de hoy; sugiere el año corregido (ej. 2006 → 2026).
   - **Dato faltante**.

   Para cada alerta se elige: **Aceptar sugerencia**, **Mantener** el valor original o **Excluir fila**. También hay acciones en bloque.
4. Se **genera el plan priorizado** y se vuelve al Dashboard.

---

## 5. Conexión con el ERP

Toda la lectura del ERP es **solo lectura**: el sistema nunca escribe en el ERP.

| Qué se sincroniza | Desde dónde (en la app) | Qué reemplaza |
|---|---|---|
| Pendientes de entrega | Dashboard → Sincronizar desde ERP | Actualiza los pendientes, conservando lo ya enviado a producción. |
| Órdenes de trabajo abiertas | Órdenes de trabajo → Sincronizar | Reemplaza la lista completa (si falla, queda la anterior). |
| Historial de producción | Predicción | Reemplaza todo el historial. |
| Ventas (6 años) | Predicción | Reemplaza todas las ventas. |
| Stock y peso unitario | Predicción | Actualiza la foto de stock con su fecha. |
| Lo templado | Órdenes de trabajo → Lo templado | Consulta en vivo, no se guarda. |

Si la conexión al ERP no está configurada, los botones de sincronizar no aparecen y se avisa en pantalla.

---

## 6. Cómo se usa en la empresa

- La app corre en una PC de la empresa y se abre desde el navegador, también desde otras máquinas de la red interna.
- **`iniciar-app.bat`**: levanta la app. Al arrancar muestra las direcciones para entrar (`http://localhost:4000` en esa PC y `http://<IP>:4000` desde la red).
- **`actualizar-app.bat`**: se corre una vez después de cada cambio en el código (compila y actualiza la base de datos).
- Temas de pantalla: **Claro**, **Oscuro** y **Clásico ERP**. Funciona también en pantallas chicas (menú ☰).

---

## 7. Glosario

| Término | Significado |
|---|---|
| **Pendiente / Saldo** | Lo que falta entregar a un cliente según las notas de venta. |
| **A producir** | Lo que hay que fabricar después de descontar el stock. |
| **OT** | Orden de trabajo de planta. Pasa por varios procesos (etapas). |
| **Proceso / etapa** | Cada paso de una OT: corte, temple, pintura, afilado, etc. |
| **Grupo** | Forma del producto: Redondos Chicos, Redondos Grandes, Rectangulares, No Redondo. |
| **Mes pico** | El mes en que históricamente más se fabricó un producto. |
| **Campaña** | Los meses del año en que un producto tiene movimiento histórico. |
| **En temporada** | Continuo, o estacional con pico este mes o el próximo. |
| **Códigos excluidos** | Códigos que no son productos a fabricar y nunca entran al plan. |
