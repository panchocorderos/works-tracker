-- Agregar columnas de ubicación a la tabla works
ALTER TABLE works ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE works ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
