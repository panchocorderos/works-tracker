-- Tabla de fotos
CREATE TABLE IF NOT EXISTS work_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID REFERENCES works(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies
CREATE POLICY "Allow all" ON work_photos FOR ALL USING (true) WITH CHECK (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_work_photos_work_id ON work_photos(work_id);
CREATE INDEX IF NOT EXISTS idx_work_photos_created_at ON work_photos(created_at DESC);
