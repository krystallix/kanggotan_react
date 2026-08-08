-- SQL: RLS Policies untuk db_kanggotan2 (RLS tetap AKTIF)
-- Jalankan di Supabase SQL Editor.
-- Pola: SELECT publik, CRUD hanya authenticated.

-- ── pertandingan ──
ALTER TABLE db_kanggotan2.pertandingan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read pertandingan" ON db_kanggotan2.pertandingan;
DROP POLICY IF EXISTS "auth insert pertandingan" ON db_kanggotan2.pertandingan;
DROP POLICY IF EXISTS "auth update pertandingan" ON db_kanggotan2.pertandingan;
DROP POLICY IF EXISTS "auth delete pertandingan" ON db_kanggotan2.pertandingan;

CREATE POLICY "public read pertandingan" ON db_kanggotan2.pertandingan
  FOR SELECT USING (true);
CREATE POLICY "auth insert pertandingan" ON db_kanggotan2.pertandingan
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update pertandingan" ON db_kanggotan2.pertandingan
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete pertandingan" ON db_kanggotan2.pertandingan
  FOR DELETE TO authenticated USING (true);

-- ── lomba ──
ALTER TABLE db_kanggotan2.lomba ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read lomba" ON db_kanggotan2.lomba;
DROP POLICY IF EXISTS "auth insert lomba" ON db_kanggotan2.lomba;
DROP POLICY IF EXISTS "auth update lomba" ON db_kanggotan2.lomba;
DROP POLICY IF EXISTS "auth delete lomba" ON db_kanggotan2.lomba;

CREATE POLICY "public read lomba" ON db_kanggotan2.lomba
  FOR SELECT USING (true);
CREATE POLICY "auth insert lomba" ON db_kanggotan2.lomba
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update lomba" ON db_kanggotan2.lomba
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete lomba" ON db_kanggotan2.lomba
  FOR DELETE TO authenticated USING (true);

-- ── kegiatan ──
ALTER TABLE db_kanggotan2.kegiatan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read kegiatan" ON db_kanggotan2.kegiatan;
DROP POLICY IF EXISTS "auth insert kegiatan" ON db_kanggotan2.kegiatan;
DROP POLICY IF EXISTS "auth update kegiatan" ON db_kanggotan2.kegiatan;
DROP POLICY IF EXISTS "auth delete kegiatan" ON db_kanggotan2.kegiatan;

CREATE POLICY "public read kegiatan" ON db_kanggotan2.kegiatan
  FOR SELECT USING (true);
CREATE POLICY "auth insert kegiatan" ON db_kanggotan2.kegiatan
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update kegiatan" ON db_kanggotan2.kegiatan
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete kegiatan" ON db_kanggotan2.kegiatan
  FOR DELETE TO authenticated USING (true);

-- ── kegiatan_kategori ──
ALTER TABLE db_kanggotan2.kegiatan_kategori ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read kegiatan_kategori" ON db_kanggotan2.kegiatan_kategori;
DROP POLICY IF EXISTS "auth insert kegiatan_kategori" ON db_kanggotan2.kegiatan_kategori;
DROP POLICY IF EXISTS "auth update kegiatan_kategori" ON db_kanggotan2.kegiatan_kategori;
DROP POLICY IF EXISTS "auth delete kegiatan_kategori" ON db_kanggotan2.kegiatan_kategori;

CREATE POLICY "public read kegiatan_kategori" ON db_kanggotan2.kegiatan_kategori
  FOR SELECT USING (true);
CREATE POLICY "auth insert kegiatan_kategori" ON db_kanggotan2.kegiatan_kategori
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update kegiatan_kategori" ON db_kanggotan2.kegiatan_kategori
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete kegiatan_kategori" ON db_kanggotan2.kegiatan_kategori
  FOR DELETE TO authenticated USING (true);
