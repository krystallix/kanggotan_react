-- =============================================================
-- SEED: Pertandingan Voli - Semarak Kemerdekaan 2026
-- =============================================================

-- 1. Insert lomba Voli ke Lomba Bapak-Bapak
WITH k AS (
  SELECT id FROM db_kanggotan2.kegiatan WHERE title = 'Lomba Bapak-Bapak' AND year = 2026
)
INSERT INTO db_kanggotan2.lomba (kegiatan_id, nama, tanggal, jam, pic_nama, sort_order, has_pertandingan)
VALUES ((SELECT id FROM k), 'Voli', '2026-07-27', '19:30', '', 4, true);

-- 2. Insert semua pertandingan
WITH l AS (
  SELECT id FROM db_kanggotan2.lomba WHERE nama = 'Voli'
    AND kegiatan_id = (SELECT id FROM db_kanggotan2.kegiatan WHERE title = 'Lomba Bapak-Bapak' AND year = 2026)
)
INSERT INTO db_kanggotan2.pertandingan (lomba_id, tim_a, tim_b, babak, tanggal, jam, sort_order)
VALUES
  -- Babak Grup
  ((SELECT id FROM l), 'RT 01', 'Pondok', 'Grup', '2026-07-27', '19:30', 1),
  ((SELECT id FROM l), 'RT 02', 'RT 05',  'Grup', '2026-07-27', '20:30', 2),

  ((SELECT id FROM l), 'RT 03', 'RT 04',  'Grup', '2026-07-28', '19:30', 3),
  ((SELECT id FROM l), 'RT 01', 'RT 05',  'Grup', '2026-07-28', '20:30', 4),

  ((SELECT id FROM l), 'Pondok', 'RT 04', 'Grup', '2026-07-31', '19:30', 5),
  ((SELECT id FROM l), 'RT 02',  'RT 03', 'Grup', '2026-07-31', '20:30', 6),

  ((SELECT id FROM l), 'RT 01', 'RT 04',  'Grup', '2026-08-01', '19:30', 7),
  ((SELECT id FROM l), 'RT 05', 'RT 03',  'Grup', '2026-08-01', '20:30', 8),

  ((SELECT id FROM l), 'Pondok', 'RT 02', 'Grup', '2026-08-02', '19:30', 9),
  ((SELECT id FROM l), 'RT 01',  'RT 03', 'Grup', '2026-08-02', '20:30', 10),

  ((SELECT id FROM l), 'RT 04', 'RT 02',  'Grup', '2026-08-03', '19:30', 11),
  ((SELECT id FROM l), 'RT 05', 'Pondok', 'Grup', '2026-08-03', '20:30', 12),

  ((SELECT id FROM l), 'RT 01', 'RT 02',  'Grup', '2026-08-07', '19:30', 13),
  ((SELECT id FROM l), 'RT 03', 'Pondok', 'Grup', '2026-08-07', '20:30', 14),

  ((SELECT id FROM l), 'RT 04', 'RT 05',  'Grup', '2026-08-08', '19:30', 15),
  ((SELECT id FROM l), 'Pondok', 'RT 01', 'Grup', '2026-08-08', '20:30', 16),

  ((SELECT id FROM l), 'RT 05', 'RT 02',  'Grup', '2026-08-09', '19:30', 17),
  ((SELECT id FROM l), 'RT 04', 'RT 03',  'Grup', '2026-08-09', '20:30', 18),

  ((SELECT id FROM l), 'RT 05', 'RT 01',  'Grup', '2026-08-10', '19:30', 19),
  ((SELECT id FROM l), 'RT 04', 'Pondok', 'Grup', '2026-08-10', '20:30', 20),

  ((SELECT id FROM l), 'RT 03', 'RT 02',  'Grup', '2026-08-14', '19:30', 21),
  ((SELECT id FROM l), 'RT 04', 'RT 01',  'Grup', '2026-08-14', '20:30', 22),

  ((SELECT id FROM l), 'RT 03', 'RT 05',  'Grup', '2026-08-15', '19:30', 23),
  ((SELECT id FROM l), 'RT 02', 'Pondok', 'Grup', '2026-08-15', '20:30', 24),

  -- 16 Agustus LIBUR (tidak ada pertandingan)

  ((SELECT id FROM l), 'RT 03', 'RT 01',  'Grup', '2026-08-17', '19:30', 25),
  ((SELECT id FROM l), 'RT 02', 'RT 04',  'Grup', '2026-08-17', '20:30', 26),

  ((SELECT id FROM l), 'Pondok', 'RT 05', 'Grup', '2026-08-21', '19:30', 27),
  ((SELECT id FROM l), 'RT 01',  'RT 02', 'Grup', '2026-08-21', '20:30', 28),

  ((SELECT id FROM l), 'Pondok', 'RT 03', 'Grup', '2026-08-22', '19:30', 29),
  ((SELECT id FROM l), 'RT 04',  'RT 05', 'Grup', '2026-08-22', '20:30', 30),

  -- Babak Semifinal
  ((SELECT id FROM l), 'Peringkat 1', 'Peringkat 4', 'Semifinal', '2026-08-29', '19:30', 31),
  ((SELECT id FROM l), 'Peringkat 2', 'Peringkat 3', 'Semifinal', '2026-08-29', '20:30', 32),

  -- Babak Final & Tempat Ke-3
  ((SELECT id FROM l), 'Perebutan Juara 3', '-', 'Perebutan Juara 3', '2026-08-30', '19:30', 33),
  ((SELECT id FROM l), 'Final',             '-', 'Final',             '2026-08-30', '20:30', 34);
