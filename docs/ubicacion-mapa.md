# Ubicación y Mapa

## Resumen

Se agregó la funcionalidad de ubicación geográfica para las obras, permitiendo registrar coordenadas latitud/longitud y visualizar las obras en un mapa interactivo.

## Cambios Realizados

### Base de Datos

**Archivo**: `supabase/location-schema.sql`

Agregar columnas a la tabla `works`:

```sql
ALTER TABLE works ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE works ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
```

### Tipos

**Archivo**: `types/index.ts`

- `Work`: Agregados campos `latitude: number | null` y `longitude: number | null`
- `CreateWorkInput`: Agregados campos opcionales `latitude?: number` y `longitude?: number`

### Formulario de Obras

**Archivo**: `components/works/works-form.tsx`

- Agregados campos de entrada para latitud y longitud
- Validación Zod con rango de coordenadas:
  - Latitud: -90 a 90
  - Longitud: -180 a 180
- Conversión segura de string a número (manejo de NaN)
- Mensaje de ayuda indicando cómo obtener coordenadas de Google Maps

### Componente de Mapa

**Archivo**: `components/works/work-map.tsx`

- Nuevo componente que muestra un mapa interactivo usando Leaflet + OpenStreetMap
- Leaflet se carga dinámicamente en `useEffect` para evitar errores de SSR (`window is not defined`)
- Soporta múltiples marcadores con popups
- Diseño responsive con fallback para obras sin ubicación
- Popups usan componentes React (no `dangerouslySetInnerHTML`)
- Muestra skeleton de carga mientras el mapa se inicializa

### Página de Detalle

**Archivo**: `app/works/[id]/page.tsx`

- Integración del componente `WorkMap` para mostrar la ubicación de la obra
- Solo se muestra si la obra tiene coordenadas registradas

### Fixes de Code Review

**Archivo**: `components/works/photo-upload.tsx`

- Removido button anidado dentro de DialogTrigger para evitar error de hydration

## Dependencias Agregadas

```bash
npm install leaflet react-leaflet
npm install @types/leaflet --save-dev
```

## Cómo Obtener Coordenadas

1. Ir a [Google Maps](https://maps.google.com)
2. Hacer click derecho en la ubicación deseada
3. Seleccionar las primeras coordenadas (latitud, longitud)
4. Ingresar los valores en el formulario de la obra

## Notas Técnicas

- El mapa se carga en `useEffect` para evitar errores de SSR
- Los popups del mapa usan componentes hijos de React en lugar de `dangerouslySetInnerHTML`
- El mapa tiene como centro predeterminado Buenos Aires (-34.6037, -58.3816)
- Se usa `DOUBLE PRECISION` en PostgreSQL (no `DECIMAL`) para compatibilidad
