import { z } from "zod";

// ── Database Types ──

export type KegiatanKategori = {
  id: number;
  name: string;
  description: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Kegiatan = {
  id: number;
  kategori_id: number;
  title: string;
  description: string | null;
  date: string;
  year: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type KegiatanWithKategori = Kegiatan & {
  kategori_name: string;
  kategori_icon: string;
};

export type Lomba = {
  id: number;
  kegiatan_id: number;
  nama: string;
  deskripsi: string | null;
  tanggal: string | null;
  jam: string | null;
  pic_nama: string;
  pic_kontak: string | null;
  sort_order: number;
  has_pertandingan: boolean;
  created_at: string;
  updated_at: string;
};

export type Pertandingan = {
  id: number;
  lomba_id: number;
  tim_a: string;
  tim_b: string;
  babak: string;
  tanggal: string | null;
  jam: string | null;
  lokasi: string | null;
  skor_a: number | null;
  skor_b: number | null;
  status: 'terjadwal' | 'berlangsung' | 'selesai';
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// ── Zod Schemas ──

export const kategoriFormSchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  description: z.string().optional(),
  icon: z.string().optional(),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type KategoriFormValues = z.infer<typeof kategoriFormSchema>;

export const kegiatanFormSchema = z.object({
  kategori_id: z.coerce.number().int().min(1, "Kategori wajib dipilih"),
  title: z.string().min(1, "Judul kegiatan wajib diisi"),
  description: z.string().optional(),
  date: z.string().min(1, "Tanggal wajib diisi"),
  year: z.coerce.number().int().min(2020),
  is_published: z.boolean().default(true),
});

export type KegiatanFormValues = z.infer<typeof kegiatanFormSchema>;

export const lombaFormSchema = z.object({
  kegiatan_id: z.coerce.number().int().min(1, "Kegiatan wajib dipilih"),
  nama: z.string().min(1, "Nama lomba wajib diisi"),
  deskripsi: z.string().optional(),
  tanggal: z.string().optional(),
  jam: z.string().optional(),
  pic_nama: z.string().min(1, "Nama PIC wajib diisi"),
  pic_kontak: z.string().optional(),
  sort_order: z.coerce.number().int().min(0).default(0),
  has_pertandingan: z.boolean().default(false),
});

export type LombaFormValues = z.infer<typeof lombaFormSchema>;

export const pertandinganFormSchema = z.object({
  lomba_id: z.coerce.number().int().min(1, "Lomba wajib dipilih"),
  tim_a: z.string().min(1, "Nama Tim A wajib diisi"),
  tim_b: z.string().min(1, "Nama Tim B wajib diisi"),
  babak: z.string().min(1, "Babak wajib diisi"),
  tanggal: z.string().optional(),
  jam: z.string().optional(),
  lokasi: z.string().optional(),
  skor_a: z.coerce.number().int().min(0).optional().nullable(),
  skor_b: z.coerce.number().int().min(0).optional().nullable(),
  status: z.enum(['terjadwal', 'berlangsung', 'selesai']).default('terjadwal'),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export type PertandinganFormValues = z.infer<typeof pertandinganFormSchema>;

export type Sponsor = {
  id: number;
  kegiatan_id: number;
  nama: string;
  logo_url: string | null;
  lokasi_url: string | null;
  sosmed_url: string | null;
  deskripsi: string | null;
  created_at: string;
};

export const sponsorFormSchema = z.object({
  kegiatan_id: z.coerce.number().int().min(1, "Kegiatan wajib dipilih"),
  nama: z.string().min(1, "Nama sponsor wajib diisi"),
  logo_url: z.string().optional().nullable(),
  lokasi_url: z.string().optional().nullable(),
  sosmed_url: z.string().optional().nullable(),
  deskripsi: z.string().optional().nullable(),
});

export type SponsorFormValues = z.infer<typeof sponsorFormSchema>;
