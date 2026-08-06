-- SQL Migration: Sponsor Table
-- Run this in your Supabase SQL Editor

-- 1. Sponsor di-share antar semua kegiatan di tahun + kategori yang sama.
--    Migrasi: kegiatan_id -> year + kategori_id
ALTER TABLE db_kanggotan2.sponsor ADD COLUMN IF NOT EXISTS year smallint;
ALTER TABLE db_kanggotan2.sponsor ADD COLUMN IF NOT EXISTS kategori_id bigint REFERENCES db_kanggotan2.kegiatan_kategori(id);

UPDATE db_kanggotan2.sponsor s
SET year = k.year, kategori_id = k.kategori_id
FROM db_kanggotan2.kegiatan k
WHERE s.kegiatan_id = k.id;

ALTER TABLE db_kanggotan2.sponsor ALTER COLUMN year SET NOT NULL;
ALTER TABLE db_kanggotan2.sponsor ALTER COLUMN kategori_id SET NOT NULL;

-- 2. Field baru: phone, link dinamis (JSONB), foto multiple (JSONB)
ALTER TABLE db_kanggotan2.sponsor ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE db_kanggotan2.sponsor ADD COLUMN IF NOT EXISTS links jsonb DEFAULT '[]'::jsonb NOT NULL;
ALTER TABLE db_kanggotan2.sponsor ADD COLUMN IF NOT EXISTS photos jsonb DEFAULT '[]'::jsonb NOT NULL;

-- 3. Migrasi data lama: lokasi_url/sosmed_url -> links
UPDATE db_kanggotan2.sponsor
SET links = (CASE WHEN lokasi_url IS NOT NULL
             THEN jsonb_build_array(jsonb_build_object('title','Lokasi','url',lokasi_url))
             ELSE '[]'::jsonb END)
         || (CASE WHEN sosmed_url IS NOT NULL
             THEN jsonb_build_array(jsonb_build_object('title','Sosial Media','url',sosmed_url))
             ELSE '[]'::jsonb END)
WHERE lokasi_url IS NOT NULL OR sosmed_url IS NOT NULL;

-- 4. Hapus kolom lama
ALTER TABLE db_kanggotan2.sponsor DROP COLUMN kegiatan_id;
ALTER TABLE db_kanggotan2.sponsor DROP COLUMN lokasi_url;
ALTER TABLE db_kanggotan2.sponsor DROP COLUMN sosmed_url;

-- 5. Enable RLS
ALTER TABLE db_kanggotan2.sponsor ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
CREATE POLICY "Allow public read access to sponsors"
ON db_kanggotan2.sponsor
FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to insert sponsors"
ON db_kanggotan2.sponsor
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update sponsors"
ON db_kanggotan2.sponsor
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete sponsors"
ON db_kanggotan2.sponsor
FOR DELETE
TO authenticated
USING (true);
