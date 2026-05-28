# PLENTY BARBER — SPRINT DE CAMBIOS 01

**Documento para Codex: revisión, decisión e implementación**
**Proyecto:** Plenty Barber / GoPlenty Global
**Guía base:** `CODEX_BUILD_GUIDE_PLENTY_BARBER.md`
**Fecha:** 2026-05-27

---

## INSTRUCCIONES PARA CODEX

Antes de implementar cualquier cambio de este sprint:

1. Lee `CODEX_BUILD_GUIDE_PLENTY_BARBER.md` completo.
2. Lee `AGENTS.md`.
3. Lee los archivos fuente relevantes de cada tarea antes de tocarlos.
4. Por cada tarea, pregúntate si la solución que vas a implementar encaja con el tono premium del producto antes de escribir una línea de código.
5. No agrupes cambios de distintas tareas en un solo commit.
6. No elimines archivos existentes sin justificación explícita en el commit message.
7. Mantén TypeScript estricto en todo lo que toques.

---

## TAREA 1 — SISTEMA DE FEEDBACK VISUAL Y ANIMACIONES

### Contexto
El producto se vende como experiencia premium. Hoy cuando el usuario guarda algo (cliente, configuración, reporte), no recibe ninguna señal visual de que la acción se completó. Eso genera incertidumbre.

### Cambio solicitado
Implementar un sistema de animaciones de confirmación para todas las acciones que persisten datos: guardar cliente, editar cliente, generar reporte, cambiar configuración, cambiar idioma, comprar créditos.

### Preguntas que Codex debe responder antes de implementar

- ¿Existe ya algún sistema de toast o notificación en el proyecto, o hay que construirlo desde cero? Revisa `components/ui/` y `components/dashboard/` antes de decidir.
- ¿Cuál es la librería de animación disponible? Framer Motion está en `package.json` — ¿se está usando en algún componente hoy? ¿Está siendo importada de forma consistente?
- ¿Las animaciones deben vivir en un componente global (como un `ToastProvider` en el layout raíz) o en cada componente que guarda datos? ¿Cuál de los dos enfoques escala mejor para este proyecto?
- ¿Cuántos tipos distintos de feedback hacen falta? ¿Éxito, error, advertencia e información son suficientes, o hay estados intermedios (procesando, en cola)?
- ¿Qué pasa con el feedback de acciones que tardan (generación de reporte con IA)? ¿Cómo se diferencia de un guardado instantáneo?
- El botón que dispara la acción — ¿debe cambiar su estado visual mientras procesa? ¿O solo al terminar?

### Comportamientos esperados (mínimos)
- Al guardar con éxito: animación de check verde con mensaje breve, desaparece sola en ~2.5 segundos.
- Al fallar: animación de error rojo con mensaje descriptivo, persiste hasta que el usuario la cierre.
- Mientras procesa: el botón se desactiva y muestra spinner, no puede dispararse dos veces.
- Las animaciones no deben bloquear la interfaz ni cubrir contenido crítico.
- Deben funcionar igual en móvil que en desktop.

### Archivos relevantes para revisar
- `components/ui/`
- `app/dashboard/clients/` (formularios de cliente)
- `app/dashboard/settings/`
- `app/dashboard/reports/new/actions.ts`
- `app/layout.tsx` (para decidir dónde va el provider)

---

## TAREA 2 — INTERNACIONALIZACIÓN DEL DASHBOARD

### Contexto
El landing page respeta i18n (ES/EN/PT). Sin embargo, una vez que el usuario inicia sesión y entra al dashboard, toda la interfaz está en inglés. Esto rompe la experiencia para usuarios hispanohablantes y lusohablantes, que son el mercado principal.

### Cambio solicitado
1. Aplicar el sistema de i18n existente a todas las pantallas del dashboard.
2. Agregar un selector de idioma accesible desde cualquier pantalla del dashboard (no solo desde la landing).

### Preguntas que Codex debe responder antes de implementar

- ¿Cómo funciona hoy el sistema de i18n? Revisa `lib/i18n/` completamente. ¿Es server-side, client-side, o ambos?
- ¿Los diccionarios existentes (`es`, `en`, `pt`) tienen las claves necesarias para las pantallas del dashboard, o están incompletos? Identifica qué claves faltan antes de implementar.
- ¿El componente `LanguageSwitcher` que existe hoy en `components/i18n/` puede vivir dentro del dashboard sin cambios, o depende de contexto del layout de la landing?
- ¿El idioma se guarda en cookie, en localStorage, en la URL, o en el perfil del usuario en Supabase? ¿Cuál de estas opciones es más consistente con el resto del sistema?
- Si el idioma se guarda en el perfil del usuario, ¿qué pasa cuando entra sin cuenta (demo mode)?
- ¿Dónde debe vivir el selector dentro del dashboard — en el sidebar, en el header, o en settings? ¿Puede estar en los dos primeros para ser siempre visible?

### Comportamientos esperados
- Todo texto visible en el dashboard debe venir de los diccionarios, no de strings hardcodeados.
- El selector de idioma debe estar visible sin necesidad de entrar a settings.
- Cambiar el idioma dentro del dashboard debe aplicarse inmediatamente sin recargar la página (o con una recarga mínima discreta si el approach es server-side).
- El idioma seleccionado debe persistir entre sesiones.

### Archivos relevantes para revisar
- `lib/i18n/` (todos los archivos)
- `components/i18n/`
- `app/dashboard/layout.tsx`
- `components/layout/` (sidebar, header)
- `middleware.ts`

---

## TAREA 3 — UX DEL ERROR DE SUBIDA DE FOTOS

### Contexto
Al subir 4 fotos cuando el máximo es 3, el error llega como `Unhandled Runtime Error` de Next.js, mostrando el stack trace completo al usuario. Eso es inaceptable para un producto premium.

**Archivo del error:**
```
app/dashboard/reports/new/actions.ts (157:11) @ validatePhotos
> throw new Error("Upload a maximum of 3 photos.");
```

### Cambio solicitado
El error nunca debe llegar al usuario como una excepción no manejada. La validación debe ocurrir antes de la acción, en el cliente.

### Preguntas que Codex debe responder antes de implementar

- ¿Existe alguna validación client-side del número de fotos antes de llamar a la server action? Revisa el componente de upload de fotos en `app/dashboard/reports/new/`.
- ¿La restricción de máximo 3 fotos está documentada en la UI hoy? ¿El usuario sabe cuántas puede subir antes de intentar?
- ¿Cuál es la razón del límite de 3 fotos? ¿Es técnica (tokens de IA), de almacenamiento, o de UX? Esto importa para decidir si la restricción debe ser configurable.
- ¿El input de fotos debería desactivarse o mostrar feedback después de las 3 primeras selecciones, en lugar de fallar al enviar?
- ¿El mensaje de error "Upload a maximum of 3 photos" debe traducirse también al sistema de i18n?
- ¿Qué pasa si alguien sube una foto que supera el peso máximo (`MAX_UPLOAD_IMAGE_MB`)? ¿Ese error también llega como excepción no manejada?

### Comportamientos esperados
- El input de fotos no permite seleccionar más de 3 archivos.
- Si el usuario intenta arrastrar más de 3, se muestra inline un mensaje amigable (en el idioma del usuario).
- Las fotos ya seleccionadas permanecen; solo se rechazan las que exceden el límite.
- El error nunca llega como excepción no manejada de Next.js.
- La validación del servidor permanece como última línea de defensa, pero devuelve una respuesta estructurada, no un throw sin catch.

### Archivos relevantes para revisar
- `app/dashboard/reports/new/actions.ts` (líneas 150-165)
- Componente de upload en `app/dashboard/reports/new/`
- `.env.example` (variable `MAX_UPLOAD_IMAGE_MB`)

---

## TAREA 4 — BOTONES DE NAVEGACIÓN (LANDING)

### Contexto
Los botones del header/navbar de la landing no tienen la identidad visual del producto. Deben sentirse premium y jerarquizados: un solo botón con peso visual máximo (Ingresar), el resto discretos pero elegantes.

### Cambio solicitado
- Todos los botones del header (Iniciar sesión, Panel, Unirse, Precios) deben ser más redondeados.
- Solo el botón **"Ingresar"** lleva relleno dorado (`#C9A84C`).
- El texto del botón debe decir "Ingresar", no "Unirse".
- Los demás botones deben ser outline o ghost, sin compiten visualmente con "Ingresar".

### Preguntas que Codex debe responder antes de implementar

- ¿Qué componente `Button` existe hoy en `components/ui/`? ¿Tiene variantes (`variant`) configuradas? ¿Cuáles son?
- ¿El header/navbar vive en un componente reutilizable o está duplicado en varias páginas? Localiza exactamente dónde están estos botones.
- ¿El texto "Unirse" viene de los diccionarios de i18n o está hardcodeado? Si viene del diccionario, ¿en qué clave está?
- ¿El border-radius actual de los botones está definido en el componente `Button` o en Tailwind config?
- ¿Hay consistencia entre los botones del header y los botones dentro del dashboard? ¿O son componentes distintos?

### Comportamientos esperados
- `border-radius` notablemente más redondeado en todos los botones del header (sugerencia: `rounded-full` o `rounded-2xl`).
- Un solo botón con `bg-[#C9A84C]` y texto oscuro: "Ingresar".
- Hover states sutiles en todos los botones.
- Comportamiento idéntico en móvil y desktop.
- Cambio reflejado en los diccionarios de i18n, no solo en el texto visible.

### Archivos relevantes para revisar
- `components/ui/Button` (o equivalente)
- Componente de navbar/header en `components/layout/`
- Diccionarios en `lib/i18n/`

---

## TAREA 5 — HERO SECTION: REDISEÑO IMPACTANTE

### Contexto
El hero actual no transmite el valor del producto. Para un SaaS B2B premium de visajismo, el hero debe mostrar el producto en acción, no solo texto.

### Cambio solicitado
1. El hero debe incluir una imagen mockup/screenshot de un informe completo de visajismo como si fuera la vista previa del producto (estilo "app screenshot" o "browser mockup").
2. La imagen debe generarse con IA (usa la capacidad de generación de imágenes disponible).
3. Los únicos dos botones del hero son:
   - **"Iniciar Sesión"** — outline o secundario
   - **"Lo quiero para mi negocio"** — dorado, llamada a la acción principal
4. Todo el hero en textos de la landing adaptados al contexto del informe de visajismo (no copy genérico).

### Preguntas que Codex debe responder antes de implementar

- ¿Cuál es la estructura actual del hero? ¿Está en `app/page.tsx` directamente o en un componente separado en `components/`?
- ¿Hay espacio previsto para imagen en el layout del hero o hay que reestructurarlo completamente?
- ¿La imagen del mockup debe ser una imagen estática en `public/` o cargarse dinámicamente? ¿Cuál de las dos opciones es más correcta para un asset de marketing?
- ¿El copy actual del hero viene de los diccionarios de i18n? ¿El nuevo copy también debe estar en los tres idiomas desde el inicio?
- ¿El botón "Lo quiero para mi negocio" lleva al usuario a pricing, a signup, o a un anchor dentro de la misma landing?
- ¿Cómo cambia el hero cuando el usuario ya está autenticado? ¿Debe mostrar "Ir al panel" en vez de los dos botones?

### Comportamientos esperados
- Hero visualmente dominante: imagen del producto ocupa al menos 50% del espacio en desktop.
- En móvil, la imagen puede quedar debajo del texto o reducirse.
- Texto claro sobre qué hace el producto sin jerga técnica.
- Solo dos CTAs en todo el hero.
- Animación de entrada suave (Framer Motion) para el texto y la imagen.
- La imagen del informe debe verse real y detallada, no un placeholder.

### Archivos relevantes para revisar
- `app/page.tsx`
- Componentes de la landing en `components/`
- `public/images/`
- Diccionarios en `lib/i18n/`

---

## TAREA 6 — PRICING: SELECTOR DE MONEDA Y EXPERIENCIA PREMIUM

### Contexto
La sección de precios es donde el lead decide comprar. Hoy puede estar mostrando solo una moneda o sin selector. El mercado del producto cubre Colombia, Brasil/Portugal y USA como principales.

### Cambio solicitado
1. Selector tipo toggle/slide entre tres opciones de moneda:
   - 🇨🇴 Colombia → precio en COP
   - 🇧🇷🇵🇹 Brasil y Portugal → precio en BRL/EUR (dólar × 4 como cobertura de fluctuación)
   - 🇺🇸 USA → precio en USD (precio base)
2. Las tarjetas de precios deben tener:
   - Hover con elevación y borde dorado sutil.
   - Animación suave de "flotar" (`float` animation continua, no agresiva).
   - Transición suave al cambiar moneda (los números cambian con animación).
3. La experiencia de pago debe sentirse cómoda y sin presión.

### Preguntas que Codex debe responder antes de implementar

- ¿Existe ya una página de pricing en `app/pricing/`? ¿Qué tiene hoy? ¿Los precios son hardcodeados o vienen de alguna configuración?
- ¿Los planes están definidos en `lib/payments/plans.ts`? ¿Tienen precios en múltiples monedas o solo en una?
- ¿El toggle de moneda debe ser un componente de estado client-side o debe persistir la preferencia del usuario entre visitas?
- ¿Cómo se manejan los tipos de cambio? ¿La regla dólar × 4 para BRL aplica a todos los planes, o hay una tabla de precios separada por región?
- ¿Las tarjetas de pricing actuales tienen el componente `Card` de `components/ui/`? ¿O tienen estilos propios?
- ¿La animación de float debe aplicarse a todas las tarjetas o solo a la tarjeta "recomendada"?
- ¿Los precios en COP deben redondearse a miles (ej: $199.000)? ¿Qué formato de número aplica para cada moneda?

### Comportamientos esperados
- El selector de moneda es visible en la parte superior de la sección de pricing.
- Cambiar moneda anima suavemente los valores de precio (no salto brusco).
- Hover en tarjeta: sube ligeramente, borde dorado aparece gradualmente.
- La tarjeta "recomendada" o "más popular" tiene float continuo suave.
- En móvil, el selector funciona igual pero adaptado a pantallas pequeñas.
- El copy de cada plan no cambia al cambiar moneda, solo los números.

### Archivos relevantes para revisar
- `app/pricing/`
- `lib/payments/plans.ts`
- `components/payments/`
- `tailwind.config.ts` (para agregar animación de float si no existe)
- Diccionarios en `lib/i18n/`

---

## TAREA 7 — CONEXIÓN DE PASARELAS DE PAGO

### Contexto
Las integraciones de pago están scaffoldeadas (`lib/payments/providers/`) pero no conectadas end-to-end. El producto necesita funcionar con pagos reales antes de poder lanzar.

### Cambio solicitado
Implementar y conectar:
- **Colombia**: BOLD como pasarela principal (links de pago fijos, soporte Nequi, PSE, QR, tarjeta, bancos). Evaluar si PSE standalone también es necesario.
- **Internacional (USA y otros)**: Stripe completo con checkout.
- **Brasil**: Investigar y conectar la pasarela más usada del mercado brasileño.

### Preguntas que Codex debe responder antes de implementar

- ¿Qué tan completa está la integración de Wompi hoy en `lib/payments/providers/wompi.ts`? ¿Wompi y BOLD son distintos proveedores o BOLD es una capa sobre algún adquirente ya existente?
- ¿Tiene BOLD una API REST/SDK documentado, o solo funciona con links de pago fijos? ¿Cuál de los dos modelos encaja mejor con el flujo de créditos del producto?
- ¿La integración de Stripe en `lib/payments/providers/stripe.ts` tiene el webhook handler completo? ¿El endpoint `/api/payments/` está preparado para recibir eventos de Stripe?
- ¿Cuál es la pasarela de pago dominante en Brasil para SaaS? (Investigar: Pagar.me, PagSeguro, Efi/Gerencianet, MercadoPago, Stripe Brazil). ¿Ya está scaffoldeada alguna de ellas?
- ¿El webhook de pagos en `/api/payments/` tiene la lógica de asignar créditos después de un pago confirmado? ¿O falta conectar esa parte?
- ¿Cómo se maneja el caso en que un pago queda "pendiente" (común en PSE y boletos brasileños)? ¿El sistema puede esperar confirmación asíncrona?
- ¿La seguridad de webhooks en `lib/payments/webhook-security.ts` cubre todos los proveedores que se van a activar?

### Comportamientos esperados
- Un usuario en Colombia puede pagar con BOLD (Nequi, PSE, tarjeta, QR).
- Un usuario fuera de Colombia puede pagar con Stripe.
- Un usuario en Brasil puede pagar con la pasarela local seleccionada.
- Después de un pago confirmado, los créditos se asignan automáticamente sin intervención manual.
- Pagos pendientes quedan en estado "procesando" hasta confirmación de webhook.
- El dashboard muestra el estado real de la transacción.

### Archivos relevantes para revisar
- `lib/payments/providers/` (todos)
- `lib/payments/plans.ts`
- `lib/payments/webhook-security.ts`
- `app/api/payments/`
- `lib/database/credits.ts`
- `.env.example` (revisar qué variables de cada proveedor están documentadas)

---

## TAREA 8 — PÁGINA DE PRICING COMO PÁGINA DE VENTA HONESTA

### Contexto
Cuando un usuario llega a `/pricing` desde el botón de la landing, el botón "Iniciar Sesión" del header puede llevarlo fuera del flujo de compra. Un lead que abandona la página de pricing raramente vuelve.

### Cambio solicitado
1. La página `/pricing` debe tener su propio layout sin el header global con "Iniciar Sesión".
2. El tono de toda la página debe ser informativo, honesto y sin presión.
3. El único CTA prominente en pricing debe ser el de elegir un plan.

### Preguntas que Codex debe responder antes de implementar

- ¿La página `/pricing` usa el layout raíz con header o tiene su propio layout? Revisa `app/pricing/layout.tsx` si existe.
- ¿Eliminar el botón "Iniciar Sesión" del header en pricing implica crear un layout alternativo, o hay una forma de pasar props al header para ocultar ese elemento?
- ¿Qué navegación mínima sí debe tener la página de pricing? (ej: logo que regresa a la landing, quizás un enlace de "Ya tengo cuenta").
- ¿El copy actual de la página de pricing es honesto sobre lo que incluye cada plan? ¿Hay información que podría generar expectativas incorrectas?
- ¿Debe haber un FAQ en pricing? ¿Qué preguntas respondería?
- ¿Cómo se ve la página de pricing en móvil hoy? ¿Las tarjetas son legibles en pantallas pequeñas?

### Comportamientos esperados
- La página `/pricing` no muestra el botón "Iniciar Sesión" en ningún lugar visible.
- Hay un link discreto de "¿Ya tienes cuenta? Ingresa aquí" para usuarios existentes.
- El logo lleva de regreso a la landing.
- El copy es directo: qué incluye, qué no incluye, qué pasa si se acaban los créditos.
- El CTA de cada plan lleva directamente al checkout del plan seleccionado.
- En móvil, los planes se apilan verticalmente sin perder información.

### Archivos relevantes para revisar
- `app/pricing/`
- `app/layout.tsx`
- `components/layout/` (header/navbar)
- `lib/payments/plans.ts`

---

## TAREAS ADICIONALES (identificadas como pendientes críticos)

Estas tareas no fueron explícitamente solicitadas pero son necesarias para que el producto funcione de forma coherente. Codex debe evaluarlas en el orden de prioridad indicado.

---

### ADICIONAL A — ESTADOS DE CARGA EN GENERACIÓN DE INFORME

**Prioridad: Alta**

#### Preguntas
- ¿Qué ve el usuario hoy mientras la IA procesa el análisis? ¿Hay algún indicador de progreso o la pantalla simplemente espera?
- ¿El endpoint `/api/ai/analyze-face` puede tardar más de 30 segundos? ¿Qué pasa si el usuario cierra la pestaña mientras procesa?
- ¿Debería haber un estado de "procesando" guardado en base de datos para que el usuario pueda cerrar y volver?
- ¿La tabla `generations` tiene un campo de `status` (`pending`, `processing`, `done`, `error`)? ¿Se actualiza correctamente?

#### Comportamiento esperado
- Mientras la IA procesa, el usuario ve una pantalla de espera con animación (no un spinner genérico — algo que refuerce la marca).
- Si la generación falla, el crédito se devuelve y el usuario recibe un mensaje claro.
- Si el usuario cierra y vuelve, puede ver el estado de su generación en el historial.

---

### ADICIONAL B — VALIDACIÓN DE CRÉDITOS ANTES DE GENERAR

**Prioridad: Alta**

#### Preguntas
- ¿Hoy el sistema verifica que el usuario tiene créditos disponibles antes de llamar a la IA, o el error solo aparece después de consumir la llamada?
- ¿Dónde ocurre esa validación? ¿En la server action o en el endpoint de IA?
- ¿Qué pasa si dos pestañas intentan generar al mismo tiempo con el último crédito disponible?
- ¿Hay una transacción atómica que descuenta el crédito y llama a la IA, o son dos pasos separados?

#### Comportamiento esperado
- Si el usuario no tiene créditos, el botón "Generar informe" está desactivado con mensaje explicativo.
- La comprobación es server-side para evitar manipulación client-side.
- El crédito se descuenta de forma atómica con la generación (no antes, no después por separado).

---

### ADICIONAL C — RESPONSIVE MÓVIL EN EL FLUJO DE NUEVO INFORME

**Prioridad: Media**

#### Preguntas
- ¿El flujo de creación de un nuevo informe (`/dashboard/reports/new`) funciona correctamente en móvil?
- ¿El componente de subida de fotos permite arrastrar en móvil o solo seleccionar desde galería?
- ¿Los formularios de datos del cliente en el flujo de nuevo informe tienen el espacio suficiente en pantallas de 375px?
- ¿Se ha probado el flujo completo en un dispositivo real o solo en DevTools?

---

### ADICIONAL D — OPTIMIZACIÓN DE IMAGEN ANTES DE SUBIR

**Prioridad: Media**

#### Preguntas
- ¿Las fotos que sube el usuario se procesan (redimensionan, comprimen) antes de enviarse a la IA, o se envían tal cual?
- ¿Qué pasa si alguien sube una foto de 15MB desde un iPhone? ¿Supera el límite configurado en `MAX_UPLOAD_IMAGE_MB`?
- ¿El error de tamaño excedido tiene la misma UX deficiente que el error de número de fotos?
- ¿Vale la pena comprimir client-side con Canvas API antes de subir, o el servidor puede manejarlo?

---

### ADICIONAL E — SESSION EXPIRADA EN DASHBOARD

**Prioridad: Media**

#### Preguntas
- ¿Qué pasa hoy cuando la sesión de Supabase expira mientras el usuario está en el dashboard?
- ¿El middleware de Next.js en `middleware.ts` captura la sesión expirada y redirige al login, o el usuario ve errores genéricos?
- ¿El usuario pierde el trabajo no guardado cuando la sesión expira?
- ¿Hay un mecanismo de refresh automático del token de sesión?

---

---

## TAREA 9 — SISTEMA MULTI-NICHO: 3 FRAMES DE PRODUCTO

### Contexto
El producto hoy está construido con el lenguaje visual y textual de una barbería. Pero el análisis de visajismo es igual de valioso para spas, salones de belleza y consultores de imagen. Un spa no debería ver la palabra "Barbería" en ningún lugar de su panel. La propuesta de valor es la misma; el envoltorio cambia.

**Tercer nicho recomendado: Consultor de Imagen Personal.**
Es el nicho de menor barrera de entrada para el producto: un solo profesional, sin equipo, que ya hace visajismo manualmente y que puede adoptar la herramienta inmediatamente. Tiene alto ticket por cliente, necesidad real del informe en PDF para entregar, y es el perfil que más referencia el producto a otros negocios. ¿Tiene sentido para el roadmap actual o se prioriza diferente?

### Cambio solicitado
Implementar tres "frames" o perfiles de nicho que adaptan el lenguaje, terminología y quizás el acento visual del producto:
- **Frame 1: Barbería** → el frame actual, sin cambios en su identidad.
- **Frame 2: Spa / Centro de Bienestar** → lenguaje más suave, términos como "tratamiento", "ritual", "bienestar facial", nunca "corte" ni "barbería".
- **Frame 3: Consultor de Imagen Personal** → lenguaje aspiracional, términos como "sesión de imagen", "diagnóstico personal", "propuesta de estilo".

### Preguntas que Codex debe responder antes de implementar

- ¿El nicho de un negocio se guarda hoy en la tabla `businesses` en Supabase? ¿Hay un campo `business_type` o similar? Si no existe, ¿dónde debe agregarse al schema?
- ¿Los diccionarios de i18n (`lib/i18n/`) tienen claves separadas por nicho, o todo el copy está mezclado? ¿Cuál es la forma menos costosa de agregar variantes de texto por nicho sin duplicar cada clave del diccionario?
- ¿El onboarding (`app/onboarding/`) pregunta hoy qué tipo de negocio es el usuario? ¿Es el momento correcto para seleccionar el frame, o debe poder cambiarse desde settings?
- ¿Los tres frames deben tener diferencias visuales (colores de acento distintos, imágenes distintas) o solo diferencias de texto? ¿Hasta dónde llega la personalización sin comprometer el mantenimiento del código?
- ¿El PDF generado cambia según el nicho del negocio? ¿El encabezado y pie de página del informe deben reflejar el frame del negocio?
- ¿Los tres frames comparten exactamente las mismas funcionalidades o algún nicho podría necesitar secciones adicionales/diferentes en el informe? (ej: un spa podría querer una sección de "cuidado de piel" que una barbería no tiene)

### Comportamientos esperados
- Un negocio de tipo Spa no ve la palabra "barbería", "corte" ni "motilada" en ninguna pantalla.
- El frame se selecciona durante el onboarding y puede modificarse en settings.
- Cambiar el frame actualiza todo el texto del dashboard en tiempo real.
- Los PDFs generados reflejan el lenguaje del frame del negocio.
- El frame no afecta la lógica de negocio: créditos, reportes, pagos funcionan igual en los tres.

### Archivos relevantes para revisar
- `app/onboarding/`
- `app/dashboard/settings/`
- `lib/i18n/` (todos los diccionarios)
- `database/schema.sql` (tabla `businesses`)
- Componentes de PDF en `lib/pdf/`

---

## TAREA 10 — BOTÓN DE RETROCESO NATIVO DENTRO DE LA APP

### Contexto
Los usuarios del dashboard usan el botón "atrás" del browser como reflejo natural. Pero en una SPA o con navegación de Next.js, ese botón puede comportarse de forma impredecible o llevar fuera del dashboard. Un botón de retroceso propio dentro de la interfaz es más predecible y se puede diseñar acorde a la identidad visual.

### Cambio solicitado
Implementar un componente de botón de retroceso que viva dentro del dashboard, visible en todas las sub-páginas (ej: detalle de cliente, nuevo reporte, configuración), que navegue hacia la ruta anterior dentro de la propia aplicación.

### Preguntas que Codex debe responder antes de implementar

- ¿Dónde vive el layout del dashboard (`app/dashboard/layout.tsx`)? ¿Tiene un header o breadcrumb que pueda alojar el botón de retroceso?
- ¿El botón debe usar `router.back()` de Next.js o debe seguir una jerarquía explícita de rutas? ¿Cuál de los dos es más predecible para los usuarios de este producto?
- ¿Qué pasa si el usuario llegó directamente a una sub-ruta del dashboard (desde un link externo o email)? ¿`router.back()` lo sacaría del dashboard? ¿Cómo se maneja ese caso?
- ¿En qué páginas del dashboard NO debe aparecer el botón? (ej: la página principal del dashboard no tiene a dónde "volver" dentro de la app)
- ¿Debe haber también un breadcrumb de navegación (Dashboard > Clientes > Mateo Alvarez) o solo el botón?
- ¿El diseño del botón debe ser consistente con los botones existentes del sistema o puede tener un estilo distinto (ej: solo ícono de flecha)?

### Comportamientos esperados
- El botón aparece en todas las sub-páginas del dashboard excepto en la raíz `/dashboard`.
- Al hacer clic, lleva a la ruta anterior dentro del dashboard (nunca fuera).
- Si no hay ruta anterior registrada dentro del dashboard, lleva a `/dashboard` como fallback.
- El botón es claramente identificable pero no compite visualmente con las acciones principales de la página.
- Funciona en móvil igual que en desktop.

### Archivos relevantes para revisar
- `app/dashboard/layout.tsx`
- `components/layout/` (sidebar y header del dashboard)
- `app/dashboard/clients/[id]/`
- `app/dashboard/reports/new/`

---

## TAREA 11 — BUG: ERROR AL ELIMINAR CLIENTE

### Contexto
Al intentar eliminar un cliente desde el dashboard, ocurre un error no manejado de Next.js que expone el stack trace al usuario.

**Error exacto:**
```
Unhandled Runtime Error
Error: Cannot read properties of undefined (reading 'get')

Source
app\dashboard\clients\actions.ts (104:30) @ get

  102 | export async function deleteClient(...): Promise<ClientActionState> {
  103 |   const businessUser = await requireCurrentBusinessUser();
> 104 |   const id = String(formData.get("id") ?? "");
      |                              ^
```

El problema es que `formData` llega como `undefined` a la función. Esto sugiere que la server action no está recibiendo el `FormData` correctamente desde el componente que la llama.

### Preguntas que Codex debe responder antes de implementar

- ¿Cómo se llama hoy la acción `deleteClient` desde el componente de UI? ¿Se usa con un `<form>` con `action={deleteClient}`, o se llama directamente como función pasando el `formData` manualmente?
- ¿El componente que dispara la eliminación pasa correctamente el `id` del cliente dentro del `FormData`? ¿Hay un `<input type="hidden" name="id" value={client.id} />` dentro del formulario?
- ¿La firma de la server action `deleteClient(_state, formData)` es compatible con `useFormState` de React? ¿O se está usando de otra manera?
- ¿Este patrón de server action con `FormData` funciona en otras acciones del proyecto (ej: `saveClient`, `updateClient`)? Si sí, ¿qué tiene de diferente `deleteClient`?
- Una vez resuelto el bug técnico, ¿el flujo de eliminación tiene confirmación antes de ejecutar? (Ver Tarea 12 relacionada).

### Comportamientos esperados
- El botón de eliminar cliente dispara la acción correctamente sin excepciones no manejadas.
- El error nunca muestra stack trace al usuario.
- Si la eliminación falla (ej: cliente con reportes activos), devuelve un mensaje amigable.
- Después de eliminar, el usuario vuelve a la lista de clientes con feedback visual de éxito.

### Archivos relevantes para revisar
- `app/dashboard/clients/actions.ts` (líneas 100-115)
- Componente que llama a `deleteClient` en `app/dashboard/clients/`
- Otras server actions del proyecto para comparar el patrón usado

---

## TAREA 12 — CONFIRMACIÓN ANTES DE ACCIONES DESTRUCTIVAS O CLAVE

### Contexto
Acciones como eliminar un cliente, eliminar un reporte o modificar configuración crítica (plan, equipo, datos del negocio) no deben ejecutarse con un solo clic. El usuario necesita una segunda confirmación para evitar errores accidentales. Esto también aplica a acciones positivas pero irreversibles, como confirmar una compra.

### Cambio solicitado
Implementar un sistema de diálogo de confirmación (modal) que se active antes de ejecutar acciones destructivas o de alto impacto. El diálogo debe ser discreto, informativo y nunca alarmista.

### Preguntas que Codex debe responder antes de implementar

- ¿Existe algún componente de `Dialog` o `Modal` en `components/ui/`? ¿O hay que construirlo?
- ¿Qué acciones específicas requieren confirmación? Listar al menos: eliminar cliente, eliminar reporte, remover miembro del equipo, cambiar de plan, y cualquier otra que sea irreversible.
- ¿El diálogo de confirmación debe ser genérico (reutilizable con diferentes mensajes) o debe tener variantes por tipo de acción?
- ¿Cómo se activa el diálogo con server actions de Next.js? ¿El componente de confirmación es puramente client-side antes de llamar a la action, o hay otra forma de manejarlo?
- ¿El diálogo debe pedir solo un clic de confirmación, o en casos extremos (eliminar cuenta) debe pedir que el usuario escriba algo (ej: el nombre del negocio)?
- ¿El tono del texto del diálogo debe ser neutral o debe anticipar el error del usuario? (ej: "¿Seguro que deseas eliminar a Mateo Álvarez? Esta acción no se puede deshacer." vs. "Vas a eliminar a Mateo Álvarez.")

### Comportamientos esperados
- Las acciones destructivas tienen un diálogo de confirmación con dos botones: "Cancelar" (primario visual) y "Confirmar eliminación" (rojo/destructivo, menos prominente visualmente que cancelar).
- El diálogo incluye el nombre del elemento afectado para que el usuario pueda confirmar que es lo correcto.
- Cancelar cierra el diálogo sin ejecutar nada.
- El diálogo es accesible con teclado (Escape para cancelar, Enter para confirmar).
- En móvil, el diálogo aparece desde abajo como bottom sheet, no como modal centrado.

### Archivos relevantes para revisar
- `components/ui/` (buscar Dialog, Modal, AlertDialog)
- `app/dashboard/clients/` (botón de eliminar)
- `app/dashboard/team/` (remover miembro)
- `app/dashboard/reports/` (eliminar reporte)

---

## TAREA 13 — BOTÓN "LO QUIERO PARA MI NEGOCIO" → FLUJO DE PRICING

### Contexto
En la Tarea 5 se definió que el hero tendrá un botón "Lo quiero para mi negocio". La intención es que este botón lleve al lead directamente al flujo de compra, no a una pantalla de registro genérica que lo desconecte de la intención de compra.

### Cambio solicitado
El botón "Lo quiero para mi negocio" en el hero debe navegar a `/pricing`, que es la página de venta definida en la Tarea 8.

### Preguntas que Codex debe responder antes de implementar

- ¿El botón del hero actualmente navega a alguna ruta? ¿A cuál?
- ¿`/pricing` tiene ya el contenido y diseño definido por la Tarea 6 y la Tarea 8 antes de que este botón apunte hacia ahí? ¿O hay un orden de implementación que respetar?
- ¿Debe el botón pasar algún parámetro a la URL de pricing (ej: `?source=hero`) para poder medir el origen del lead en analytics?
- Si el usuario ya está autenticado y tiene un plan activo, ¿a dónde debe llevar este botón? ¿A pricing de todas formas, o al dashboard?

### Comportamientos esperados
- Clic en "Lo quiero para mi negocio" → navega a `/pricing` con scroll hacia arriba.
- Si hay analytics disponibles, el origen del clic queda registrado.
- Si el usuario ya está autenticado y tiene plan, el botón cambia a "Ir a mi panel" o "Ver mis créditos".

### Archivos relevantes para revisar
- `app/page.tsx` (hero section)
- `components/` (componente del hero si existe separado)
- `app/pricing/`

---

## TAREA 14 — ESTADOS DEL WIDGET DE SALUD DE CRÉDITOS

### Contexto
En el dashboard existe un widget que hoy dice algo como:

> "Tu saldo de créditos está saludable. Tu negocio puede seguir generando informes con el saldo actual."

Este mensaje es el mismo sin importar si el usuario tiene 500 créditos o 2. Un usuario con 5 créditos restantes necesita saber que debe recargar antes de que se quede sin acceso.

### Cambio solicitado
Implementar al menos 4 estados del widget de créditos con mensajes y colores distintos según el saldo real:

| Rango de créditos | Estado | Tono del mensaje |
|---|---|---|
| > 50 | Saludable | Verde/neutro, tranquilizador |
| 20 – 50 | Atención | Amarillo/ámbar, informativo sin alarmar |
| 5 – 19 | Crítico | Naranja, directo con CTA de recarga |
| 0 – 4 | Agotado | Rojo, bloqueante con CTA urgente |

### Preguntas que Codex debe responder antes de implementar

- ¿Dónde vive hoy el widget de créditos en el dashboard? ¿En `components/dashboard/` o en `app/dashboard/page.tsx`?
- ¿El saldo de créditos se obtiene en el servidor (Server Component) o en el cliente? ¿Se actualiza en tiempo real o solo al recargar la página?
- ¿Los rangos de 50 y 5 créditos son buenos umbrales para este producto, o deben ser configurables desde variables de entorno o desde la tabla `system_config`?
- ¿El CTA de recarga en los estados crítico y agotado debe llevar a una página de compra de créditos, a pricing, o abrir un modal de compra rápida?
- ¿El estado "Agotado" (0-4 créditos) debe bloquear el botón "Nuevo informe", o solo advertir? ¿Qué es más correcto para la UX del producto?
- ¿El widget debe mostrar el número exacto de créditos restantes o solo el estado semafórico?

### Comportamientos esperados
- El widget cambia de color, ícono y mensaje según el saldo real.
- Con créditos críticos o agotados, aparece un CTA de recarga visible dentro del widget.
- Si el saldo llega a 0, el botón "Nuevo informe" muestra un tooltip explicativo y no permite continuar.
- La lógica de umbrales es fácil de ajustar sin cambiar la UI.

### Archivos relevantes para revisar
- `components/dashboard/` (widget de créditos)
- `app/dashboard/page.tsx`
- `lib/database/credits.ts`
- `app/dashboard/credits/`

---

## TAREA 15 — PERFORMANCE LOCAL Y ESTRATEGIA DE CACHÉ

### Contexto
La app se siente lenta en desarrollo local. Esto puede tener múltiples causas: compilación de Next.js en dev mode, queries sin caché a Supabase, renders innecesarios, o simplemente el tamaño del bundle. Antes de asumir que es un problema de infraestructura, hay que identificar el cuello de botella real.

**Sobre los planes pagos de Supabase:** los planes pagos sí ofrecen más recursos de cómputo (más RAM, más CPU para queries), pero el lentitud en local generalmente no es culpa de Supabase sino del entorno de desarrollo de Next.js. Esto debe investigarse antes de considerar upgrade de plan.

### Preguntas que Codex debe responder antes de implementar cualquier optimización

- ¿La lentitud ocurre en la primera carga de una página (compilación de Next.js) o también en navegaciones subsiguientes dentro del dashboard?
- ¿Hay queries a Supabase que se ejecutan sin ningún tipo de caché? ¿Se usa `React.cache()`, `unstable_cache`, o `revalidatePath` de Next.js en las funciones de `lib/database/`?
- ¿Los Server Components del dashboard hacen fetches en paralelo (usando `Promise.all`) o secuencialmente? Un fetch secuencial de 3 queries puede ser 3x más lento que uno paralelo.
- ¿Next.js está en modo `turbopack` para desarrollo? ¿Se puede activar en `package.json` el script `dev` con `--turbo` para ver si mejora la compilación?
- ¿Hay imágenes sin optimizar (sin `next/image`) que estén bloqueando la carga inicial?
- ¿El demo mode carga datos hardcodeados o también hace llamadas a Supabase? Si hace llamadas, ¿eso es necesario?

### Plan de acción sugerido para investigar (en orden)

1. Activar Turbopack en dev: `next dev --turbo` — ver si la compilación mejora.
2. Auditar las funciones de `lib/database/` para identificar fetches sin caché.
3. Verificar que los fetches en Server Components del dashboard usen `Promise.all`.
4. Revisar si hay componentes Client que hacen fetches que podrían moverse al servidor.
5. Solo si los pasos anteriores no son suficientes, evaluar el plan de Supabase.

### Sobre los planes de Supabase
- El plan gratuito de Supabase tiene recursos limitados (500MB de base de datos, 2 proyectos).
- El plan Pro (~$25/mes) ofrece más almacenamiento, backups y resources de cómputo.
- El lentitud de queries en producción sí puede mejorar con un plan pago (índices más eficientes, más conexiones).
- En desarrollo local, el costo del plan no afecta la velocidad: el cuello de botella es Next.js dev mode.

### Comportamientos esperados tras la optimización
- La primera carga del dashboard en dev mode es notablemente más rápida.
- Las navegaciones dentro del dashboard son casi instantáneas (sin re-fetch innecesario).
- Las queries a Supabase usan caché apropiado según el tipo de dato (estático vs. dinámico).

### Archivos relevantes para revisar
- `package.json` (script de `dev`)
- `lib/database/` (todos los archivos — buscar fetches sin caché)
- `app/dashboard/page.tsx` (auditar fetches en el componente raíz del dashboard)
- `next.config.mjs`

---

## TAREA 16 — CONEXIÓN REAL DE LA API DE IA (NÚCLEO DEL PRODUCTO)

### Contexto
Este es el cambio más crítico del sprint. El producto vende un análisis de visajismo con IA. Si la IA no funciona, no hay producto. El endpoint `/api/ai/analyze-face` existe, los proveedores están scaffoldeados, pero la conexión real con la API (OpenAI, Anthropic o DeepSeek) aún no está verificada de extremo a extremo.

El pitch de venta es: un cliente se sienta en la silla, el barbero o estilista sube una foto, y en segundos el sistema devuelve un análisis completo con recomendaciones de peinado, color y estilo. Eso elimina el miedo del cliente a quedar mal después de un cambio radical.

### Cambio solicitado
Verificar, corregir y dejar funcionando el flujo completo:
1. Subir foto de cliente.
2. Llamar a la API de IA con esa foto.
3. Recibir análisis estructurado.
4. Guardar el análisis en la tabla `generations`.
5. Mostrar el análisis en el dashboard como informe legible.
6. Permitir descargar o compartir el informe.

### Preguntas que Codex debe responder antes de implementar

- ¿El endpoint `/api/ai/analyze-face` funciona hoy con una llamada real (no mock)? ¿Hay un test manual documentado? Si no, hay que probarlo primero con `curl` o Postman antes de tocar el frontend.
- ¿Cuál de los tres proveedores (OpenAI, Anthropic, DeepSeek) está configurado como default en `.env.example`? ¿Esa variable (`PREFERRED_AI_PROVIDER`) se lee correctamente en `lib/ai/providers/`?
- ¿El modelo configurado (ej: `gpt-4o-mini`) tiene capacidad de análisis de imágenes (vision)? ¿O se necesita un modelo diferente?
- ¿El prompt que se envía a la IA en `lib/ai/prompts/` produce una respuesta en el formato JSON esperado? ¿La validación con Zod en `lib/ai/validators/` cubre todos los campos que se muestran en el informe?
- ¿Las fotos subidas a Supabase Storage tienen URLs accesibles para enviarlas a la API de IA? ¿O se necesita enviar el contenido binario de la imagen?
- ¿Qué pasa cuando la IA devuelve una respuesta inesperada o parcial? ¿El sistema falla silenciosamente o el usuario recibe un error útil?
- ¿El informe generado incluye propuestas visuales (imágenes de estilos sugeridos)? ¿Esas imágenes se generan con otro endpoint (`/api/ai/generate-illustrations`) o son parte del mismo análisis?
- ¿El flujo completo funciona en demo mode con datos simulados, para que pueda mostrarse sin gastar créditos reales de la API?

### Comportamientos esperados (flujo completo verificado)
- El barbero sube 1-3 fotos del cliente → el sistema llama a la IA → en menos de 30 segundos aparece el informe.
- El informe incluye: morfología facial, colorimetría, estilos recomendados, estilos a evitar, paleta de colores, resumen ejecutivo.
- El informe se guarda en base de datos y aparece en el historial del cliente.
- Se puede descargar como PDF con el logo del negocio.
- Se puede compartir por WhatsApp como link público temporal.
- Si la IA falla, el crédito se devuelve y el usuario recibe un mensaje claro.
- En demo mode, el flujo completo funciona con datos simulados realistas.

### Archivos relevantes para revisar
- `app/api/ai/analyze-face/` (endpoint completo)
- `lib/ai/providers/` (todos los proveedores)
- `lib/ai/prompts/` (prompts de análisis)
- `lib/ai/validators/` (validación de respuesta)
- `lib/ai/analyze-face.ts` (lógica principal)
- `lib/storage/` (manejo de imágenes)
- `lib/database/reports.ts` (guardado del análisis)
- `app/dashboard/reports/new/` (UI del flujo)
- `lib/demo/` (datos de demostración)
- `.env.example` (variables de IA)

---

## CRITERIOS GENERALES DE ACEPTACIÓN PARA ESTE SPRINT

Antes de considerar cualquier tarea de este sprint como terminada, verificar:

- [ ] El cambio funciona en Chrome y Safari (mínimo).
- [ ] El cambio funciona en pantallas de 375px (móvil) y 1440px (desktop).
- [ ] Ningún string visible quedó hardcodeado en inglés si el idioma activo es español.
- [ ] No hay `console.error` sin manejo en producción.
- [ ] No hay dependencias nuevas en `package.json` sin justificación explícita en el commit message.
- [ ] Las animaciones nuevas respetan `prefers-reduced-motion` (accesibilidad).
- [ ] No se rompió nada del flujo de autenticación existente.
- [ ] El demo mode sigue funcionando después de los cambios.
- [ ] Ningún error de Next.js llega al usuario como stack trace visible (Tareas 3, 11).
- [ ] Las acciones destructivas siempre tienen confirmación antes de ejecutar (Tarea 12).
- [ ] El texto del dashboard no menciona "barbería" cuando el nicho es Spa o Consultor (Tarea 9).
- [ ] El flujo completo de generación de informe con IA funciona de extremo a extremo (Tarea 16).

---

## NOTAS FINALES PARA CODEX

El tono de este producto es **premium, honesto y humano**. Cada decisión de UX debe hacerse pensando en un barbero o estilista colombiano, brasileño o estadounidense que tiene su negocio y quiere una herramienta que lo haga quedar bien con sus clientes.

No es un producto para desarrolladores. Es un producto para personas que trabajan con sus manos y con su mirada estética.

Cuando en duda: **menos es más. Pero lo poco que hay, que brille.**
