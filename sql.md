CREATE SCHEMA IF NOT EXISTS db_kanggotan2;

-- Tabel master kategori kegiatan
CREATE TABLE IF NOT EXISTS db_kanggotan2.kegiatan_kategori (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'CalendarDays',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION db_kanggotan2.update_kegiatan_kategori_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_kegiatan_kategori_updated_at
  BEFORE UPDATE ON db_kanggotan2.kegiatan_kategori
  FOR EACH ROW
  EXECUTE FUNCTION db_kanggotan2.update_kegiatan_kategori_updated_at();

-- Tabel kegiatan (item aktivitas per tahun)
CREATE TABLE IF NOT EXISTS db_kanggotan2.kegiatan (
  id BIGSERIAL PRIMARY KEY,
  kategori_id BIGINT NOT NULL REFERENCES db_kanggotan2.kegiatan_kategori(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  year INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_kegiatan_year ON db_kanggotan2.kegiatan(year);
CREATE INDEX idx_kegiatan_kategori ON db_kanggotan2.kegiatan(kategori_id);
CREATE INDEX idx_kegiatan_date ON db_kanggotan2.kegiatan(date);

CREATE OR REPLACE FUNCTION db_kanggotan2.update_kegiatan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_kegiatan_updated_at
  BEFORE UPDATE ON db_kanggotan2.kegiatan
  FOR EACH ROW
  EXECUTE FUNCTION db_kanggotan2.update_kegiatan_updated_at();

-- Tabel lomba (sub-aktivitas untuk kategori event seperti Semarak Kemerdekaan)
CREATE TABLE IF NOT EXISTS db_kanggotan2.lomba (
  id BIGSERIAL PRIMARY KEY,
  kegiatan_id BIGINT NOT NULL REFERENCES db_kanggotan2.kegiatan(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  deskripsi TEXT,
  tanggal DATE,
  jam TIME,
  pic_nama TEXT NOT NULL DEFAULT '',
  pic_kontak TEXT,
  sort_order INTEGER DEFAULT 0,
  has_pertandingan BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_lomba_kegiatan ON db_kanggotan2.lomba(kegiatan_id);

CREATE OR REPLACE FUNCTION db_kanggotan2.update_lomba_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_lomba_updated_at
  BEFORE UPDATE ON db_kanggotan2.lomba
  FOR EACH ROW
  EXECUTE FUNCTION db_kanggotan2.update_lomba_updated_at();

-- Tabel pertandingan (jadwal tim vs tim untuk lomba turnamen seperti Voli)
CREATE TABLE IF NOT EXISTS db_kanggotan2.pertandingan (
  id BIGSERIAL PRIMARY KEY,
  lomba_id BIGINT NOT NULL REFERENCES db_kanggotan2.lomba(id) ON DELETE CASCADE,
  tim_a TEXT NOT NULL,
  tim_b TEXT NOT NULL,
  babak TEXT NOT NULL DEFAULT 'Penyisihan',
  tanggal DATE,
  jam TIME,
  lokasi TEXT,
  skor_a INTEGER,
  skor_b INTEGER,
  status TEXT NOT NULL DEFAULT 'terjadwal' CHECK (status IN ('terjadwal', 'berlangsung', 'selesai')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pertandingan_lomba ON db_kanggotan2.pertandingan(lomba_id);

CREATE OR REPLACE FUNCTION db_kanggotan2.update_pertandingan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_pertandingan_updated_at
  BEFORE UPDATE ON db_kanggotan2.pertandingan
  FOR EACH ROW
  EXECUTE FUNCTION db_kanggotan2.update_pertandingan_updated_at();

-- Matikan Row Level Security
ALTER TABLE db_kanggotan2.kegiatan_kategori DISABLE ROW LEVEL SECURITY;
ALTER TABLE db_kanggotan2.kegiatan DISABLE ROW LEVEL SECURITY;
ALTER TABLE db_kanggotan2.lomba DISABLE ROW LEVEL SECURITY;
ALTER TABLE db_kanggotan2.pertandingan DISABLE ROW LEVEL SECURITY;

-- Beri akses ke anon & authenticated roles
GRANT USAGE ON SCHEMA db_kanggotan2 TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA db_kanggotan2 TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA db_kanggotan2 TO anon, authenticated;

-- Drop (jika perlu rollback)
-- DROP TABLE IF EXISTS db_kanggotan2.pertandingan CASCADE;
-- DROP TABLE IF EXISTS db_kanggotan2.lomba CASCADE;
-- DROP TABLE IF EXISTS db_kanggotan2.kegiatan CASCADE;
-- DROP TABLE IF EXISTS db_kanggotan2.kegiatan_kategori CASCADE;
