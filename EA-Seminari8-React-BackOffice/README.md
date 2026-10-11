# Backoffice — Autores y libros (React Native con Expo)

Backoffice adaptado a **React Native con Expo**, TypeScript y Expo Router para el **Seminario 8 de EA**. Es la versión móvil nativa del backoffice: usa **la misma API REST** (`EA-Seminari8-React-BackOffice-API`) y dispone de las pantallas de gestión de autores y libros (listar, buscar en tiempo real, crear, editar y borrar autores y libros, vista en lista o tarjetas, permisos de hardware/cámara y pantalla explicativa de teoría).

Incluye además la solución completa al ejercicio del campo **Editorial (`publisher`)**.

## Requisitos

- [Node.js](https://nodejs.org/) 22 o superior.
- [MongoDB](https://www.mongodb.com/), local o en Atlas, para el backend.
- El backend arrancado (carpeta `EA-Seminari8-React-BackOffice-API`, en el puerto 1337).

## Cómo arrancarlo

Hacen falta dos terminales: una para la API y otra para React Native.

**1. Backend (API)**

```bash
cd EA-Seminari8-React-BackOffice-API
npm install
cp .env.example .env
npm run seed
npm run dev
```

La API queda disponible en `http://localhost:1337` (y en `http://10.0.2.2:1337` para emuladores Android).

**2. Frontend (React Native con Expo)**

```bash
cd EA-Seminari8-React-BackOffice
npm install
npm run web       # Para probar directamente en el navegador
# o
npm run android   # Para probar en emulador Android o móvil conectado por USB
# o
npm start         # Inicia Expo DevTools para escanear el QR con la app Expo Go
```

## Configuración de Red

La URL de la API se gestiona automáticamente según la plataforma en `src/config/environment.ts`:
- En **Android Emulator**, redirige automáticamente a `http://10.0.2.2:1337`.
- En **iOS Simulator y Web**, utiliza `http://localhost:1337`.

## Pantallas (Expo Router)

| Ruta | Pantalla | Descripción |
|---|---|---|
| `/(tabs)/books` | Libros | Catálogo de libros con buscador en tiempo real (título, ISBN, descripción, **editorial**), pull-to-refresh y vista lista/tarjetas. |
| `/(tabs)/books/new` | Nuevo Libro | Formulario de libro con campo editorial (`publisher`) y selección de foto con cámara/galería (permisos nativos). |
| `/(tabs)/books/[id]/edit` | Editar Libro | Formulario con precarga completa de datos incluyendo editorial. |
| `/(tabs)/books/[id]` | Detalle Libro | Vista de detalle de portada grande, editorial, autores, tags y precio. |
| `/(tabs)/authors` | Autores | Listado con buscador, pull-to-refresh, edición y modal de borrado. |
| `/(tabs)/authors/new` | Nuevo Autor | Formulario con roles, estado activo y foto de perfil. |
| `/(tabs)/authors/[id]/edit` | Editar Autor | Formulario de edición con precarga. |
| `/(tabs)/authors/[id]` | Detalle Autor | Información del autor, biografía y estado. |
| `/(tabs)/permissions` | Permisos Nativos | Demostrador interactivo de permisos de Cámara y Galería (`usePermissions.ts`). |
| `/(tabs)/info` | Teoría & Comparativa | Resumen interactivo de React Native vs Web, Bridge, DOM vs Native, eventos, etc. |

## Documentación de Cambios

Para consultar el informe completo de cambios con explicaciones y líneas de código modificadas:
- Ver [cambios.md](../cambios.md)
- Ver [cambios.pdf](../cambios.pdf)
