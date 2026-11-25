# Guía de Desarrollo para Agentes y Desarrolladores (AGENTS.md)

Este documento establece la arquitectura, normas de codificación, convenciones de diseño y protocolos de verificación para cualquier agente de IA o desarrollador que trabaje en **IntroDex** (`fiuba-ids-tp2-frontend`).

---

## 1. Contexto del Proyecto

- **Nombre**: IntroDex (`fiuba-ids-tp2-frontend`)
- **Propósito**: Frontend académico en SvelteKit para la materia _Introducción al Desarrollo de Software_ (FIUBA / UBA).
- **Backend**: API REST en FastAPI (Python) corriendo en `http://localhost:8000/api/` (datos persistidos en SQLite).
- **Frontend Port**: `http://localhost:5173`.
- **Consigna del Trabajo**: Referenciada en [`CONSIGNA.md`](CONSIGNA.md) (no modificar).

---

## 2. Pila Tecnológica y Reglas de Sintaxis

### Svelte 5 (Runes Mode)

El proyecto utiliza **Svelte 5** nativamente. **NUNCA** utilizar la sintaxis obsoleta de Svelte 3/4.

- ✅ Utilizar `$props()` para recibir propiedades:
  ```svelte
  <script>
  	let { data, children } = $props();
  </script>
  ```
- ✅ Utilizar `$state()` para variables reactivas locales:
  ```svelte
  let busqueda = $state('');
  ```
- ✅ Utilizar `$derived()` para valores calculados:
  ```svelte
  let filtrados = $derived(items.filter(i => i.activo));
  ```
- ✅ Utilizar `$effect()` en lugar de bloques reactivos `$:`.
- ✅ En eventos, usar atributos estándar HTML en minúscula (`onclick`, `onsubmit`, `onkeydown`, `oninput`) en lugar de directivas legacy como `on:click` o `on:submit`.
- ❌ **NO** utilizar `export let variable;` (sintaxis legacy).
- ❌ **NO** utilizar `$: variable = ...;` (sintaxis legacy).

### SvelteKit 3

- La navegación reactiva se accede desde `$app/state` (`page`, `navigating`).
- Las acciones de navegación imperativa se importan desde `$app/navigation` (`goto`).
- Los formularios con mutaciones de datos en servidor usan `use:enhance` de `$app/forms`.
- Formularios de búsqueda y filtrado **deben utilizar `method="GET"`** para sincronizar parámetros con la URL (`/pokemones?nombre=...&tipo=...`).

### Tailwind CSS v4

- El proyecto usa Tailwind CSS v4 integrado con `@tailwindcss/vite` en `src/app.css`.
- Clases modernas activas: `shadow-xs`, `shadow-2xs`, `rounded-3xl`, `backdrop-blur-md`, `divide-slate-100`.
- Paleta semántica orientada a `slate`, `blue`, `rose` y `emerald`.

---

## 3. Integración con el Backend (FastAPI)

1. **Variables de Entorno y `API_URL`**:
   - `API_URL` se define en `.env` (por defecto `http://localhost:8000/api`).
   - En código, se importa exclusivamente de `#lib/constantes/index`: `import { API_URL } from '#lib/constantes/index';`.
   - `src/lib/constantes/index.js` utiliza `export const API_URL = process.env.API_URL;` como única fuente de verdad sin valores URL hardcodeados.
   - **NUNCA** escribir cadenas de URL fijas (`http://localhost:8000/...`) en endpoints de rutas, formularios o componentes (`Typeahead.svelte`).

2. **Trailing Slashes Obligatorios**:
   FastAPI redirige con `307 Temporary Redirect` las peticiones sin barra final. Todas las URLs en llamadas `fetch` deben incluir la barra final:
   - ✅ `${API_URL}/pokemon/?limit=20&offset=0`
   - ✅ `${API_URL}/movimientos/?limit=20`
   - ✅ `${API_URL}/equipos/`
   - ❌ `${API_URL}/pokemon` (causa 307 redirect).

3. **Endpoints Principales**:
   - `GET /api/pokemon/?limit={}&offset={}&nombre_parcial={}&tipo={}`
   - `GET /api/pokemon/{id}`
   - `GET /api/movimientos/?limit={}&offset={}&nombre_parcial={}&tipo={}`
   - `GET /api/movimientos/{id}`
   - `GET /api/equipos/`
   - `POST /api/equipos/` (crear equipo)
   - `GET /api/equipos/{id}`
   - `PUT /api/equipos/{id}` (actualizar nombre / generación)
   - `DELETE /api/equipos/{id}` (eliminar equipo)
   - `POST /api/equipos/{id}/integrantes` (añadir integrante)
   - `PUT /api/equipos/{id}/integrantes/{id_integrante}` (editar apodo y movimientos)
   - `DELETE /api/equipos/{id}/integrantes/{id_integrante}` (eliminar integrante)
   - `POST /api/equipos/{id}/integrantes/{id_integrante}/movimientos` (aprender movimiento)

---

## 4. Estándares de Navegación y UI

1. **Paginación (`Pagination.svelte`)**:
   - Usar enlaces semánticos `<a>` con `href={getPageUrl(targetPage)}` y `data-sveltekit-preload-data="hover"`.
   - Limpiar de los parámetros de búsqueda cualquier clave residual de formulario (como `?/filter`).
   - Añadir desplazamiento suave hacia arriba (`window.scrollTo({ top: 0, behavior: 'smooth' })`).

2. **Detección de Rutas en Navbar (`Encabezado.svelte`)**:
   - Usar `page.url.pathname.startsWith(enlace)` para que las rutas anidadas (`/pokemones/25`, `/equipos/3`) mantengan encendida la pestaña correspondiente.

3. **Manejo de Errores y Servidor Inactivo (`+error.svelte`)**:
   - En caso de error de conexión con la API o servidor caído, mostrar el mensaje general _"El servidor no se encuentra en ejecución o no responde en este momento"_.
   - **REGLA ESTRICTA**: No exponer detalles técnicos de puertos (`localhost:8000`) o instrucciones de verificación interna de infraestructura al usuario final.
   - **REGLA ESTRICTA**: No crear archivos interceptores en `src/hooks.server.js`.

---

## 5. Protocolo de Verificación Obligatorio

Antes de dar por concluida cualquier tarea o modificación, se debe ejecutar en la terminal:

```bash
npm run format && npm run lint && npm run build
```

1. `npm run format`: Prettier debe formatear sin errores.
2. `npm run lint`: Prettier `--check` y ESLint deben reportar `0 errors`.
3. `npm run build`: Debe compilar exitosamente tanto el bundle SSR como el cliente en `.svelte-kit/output`.
4. Comprobar que los endpoints clave devuelvan HTTP `200` contra el servidor en ejecución (`http://localhost:5173/`).
