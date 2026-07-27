-- =============================================================
-- SEED: Semarak Kemerdekaan 2026
-- =============================================================

-- 1. Kategori
INSERT INTO db_kanggotan2.kegiatan_kategori (name, description, icon, sort_order)
VALUES ('Semarak Kemerdekaan', 'Rangkaian lomba HUT RI', 'Trophy', 1)
ON CONFLICT (name) DO NOTHING;

-- 2. Kegiatan (pakai subquery agar id kategori fleksibel)
WITH kat AS (
  SELECT id FROM db_kanggotan2.kegiatan_kategori WHERE name = 'Semarak Kemerdekaan'
)
INSERT INTO db_kanggotan2.kegiatan (kategori_id, title, date, year, is_published)
VALUES
  ((SELECT id FROM kat), 'Lomba Anak-Anak',   '2026-07-26', 2026, true),
  ((SELECT id FROM kat), 'Lomba Ibu-Ibu',     '2026-07-31', 2026, true),
  ((SELECT id FROM kat), 'Lomba Bapak-Bapak', '2026-07-26', 2026, true);

-- 3. Lomba
-- Ambil kegiatan_id via subquery per kegiatan

-- === ANAK-ANAK ===
WITH k AS (SELECT id FROM db_kanggotan2.kegiatan WHERE title = 'Lomba Anak-Anak' AND year = 2026)
INSERT INTO db_kanggotan2.lomba (kegiatan_id, nama, tanggal, jam, pic_nama, sort_order)
VALUES
  ((SELECT id FROM k), 'Lomba Keagamaan',  '2026-07-26', '15:30', 'isfak, eka, dhea, izzah, zia, malik, sabiq', 1),
  ((SELECT id FROM k), 'Lomba Mewarnai',   '2026-07-26', '16:30', 'devin, farah', 2),
  ((SELECT id FROM k), 'Lomba Karet Tepung','2026-08-02', '15:30', 'erly, zilla, fian rt 3, yolla, zahra, aira, lia, fitri', 3),
  ((SELECT id FROM k), 'Lomba Corong Air',  '2026-08-02', '16:30', 'billa rt 5, salsa rt 3, ezra, reza rt 4, ani, lilis, salma, sherly', 4),
  ((SELECT id FROM k), 'Lomba Bola Air',    '2026-08-09', '15:30', 'indah, anggi, affan, zaki, nadya, dita, rafi, rio', 5),
  ((SELECT id FROM k), 'Lomba Sarung Bola', '2026-08-09', '16:30', 'lisa, nella, nada, aril, abdan, ian, haikal', 6),
  ((SELECT id FROM k), 'Lomba Pancing Kerupuk','2026-08-16','15:30', 'azkia, lina, puput, attar, arfa, rahma, alga, fian 4', 7),
  ((SELECT id FROM k), 'Lomba Tiup Cup',    '2026-08-16', '16:30', 'hanum, ghana, arya, wisang, itta, keyla, anis, nabila 4', 8);

-- === IBU-IBU ===
WITH k AS (SELECT id FROM db_kanggotan2.kegiatan WHERE title = 'Lomba Ibu-Ibu' AND year = 2026)
INSERT INTO db_kanggotan2.lomba (kegiatan_id, nama, tanggal, jam, pic_nama, sort_order)
VALUES
  ((SELECT id FROM k), 'Estafet Air',    '2026-07-31', NULL, 'khurun, sani, ella, andi, miftah', 1),
  ((SELECT id FROM k), 'Estafet Tepung', '2026-08-07', NULL, 'vanda, hera, andin, risang, bagas', 2),
  ((SELECT id FROM k), 'Estafet Karet',  '2026-08-12', NULL, 'dina, bintan, finda, khozen, acan', 3),
  ((SELECT id FROM k), 'Estafet Kardus', '2026-08-14', NULL, 'alya, sifa, fani, febri, andi', 4);

-- === BAPAK-BAPAK ===
WITH k AS (SELECT id FROM db_kanggotan2.kegiatan WHERE title = 'Lomba Bapak-Bapak' AND year = 2026)
INSERT INTO db_kanggotan2.lomba (kegiatan_id, nama, tanggal, jam, pic_nama, sort_order)
VALUES
  ((SELECT id FROM k), 'Catur',    '2026-07-26', NULL, 'khozen, bagas, tomi, risang, malik, aji', 1),
  ((SELECT id FROM k), 'Pingpong', '2026-07-26', NULL, 'imron, faiz tapet, rama, haris, raka, miftah', 2),
  ((SELECT id FROM k), 'Karambol', '2026-07-26', NULL, 'ade, bagas, haikal, rama, hakim', 3);
