# Plan: Dynamic Kegiatan + Kategori + Lomba + Pertandingan

## 1. Database — 4 Tabel di Supabase

Lihat `sql.md` untuk DDL lengkap.

```
kegiatan_kategori
  └── kegiatan
        └── lomba (khusus kategori event seperti Semarak Kemerdekaan)
              └── pertandingan (khusus lomba turnamen seperti Voli)
```

## 2. Types — `types/kegiatan.ts`

Tipe data untuk seluruh layer:

| Type | Untuk |
|---|---|
| `KegiatanKategori` | id, name, description, icon, sort_order, is_active |
| `Kegiatan` | id, kategori_id, title, description, date, year, is_published |
| `KegiatanWithKategori` | Join kegiatan + kategori_name |
| `Lomba` | id, kegiatan_id, nama, deskripsi, tanggal, jam, pic_nama, pic_kontak, sort_order, has_pertandingan |
| `Pertandingan` | id, lomba_id, tim_a, tim_b, babak, tanggal, jam, lokasi, skor_a, skor_b, status |

Zod schemas:
- `kategoriFormSchema` — validasi input kategori
- `kegiatanFormSchema` — validasi input kegiatan
- `lombaFormSchema` — validasi input lomba
- `pertandinganFormSchema` — validasi input pertandingan

## 3. Queries

### Server (`lib/supabase/queries-server.ts`)

| Fungsi | SELECT | ORDER |
|---|---|---|
| `getKategoriAll()` | semua kategori aktif | sort_order ASC |
| `getKegiatanByYear(year, kategoriId?)` | kegiatan by year, optional filter kategori | date ASC |
| `getKegiatanTerbaru(limit=3)` | upcoming published kegiatan | date ASC |
| `getLombaByKegiatanId(kegiatanId)` | lomba milik suatu kegiatan | sort_order ASC |
| `getPertandinganByLombaId(lombaId)` | pertandingan milik suatu lomba | babak, jam ASC |
| `getKegiatanWithLomba(year)` | kegiatan + lomba + pertandingan untuk display public | — |

### Client (`lib/supabase/queries-client.ts`)

| Fungsi | Operasi |
|---|---|
| `insertKategori`, `updateKategori`, `deleteKategori` | CRUD kategori |
| `insertKegiatan`, `updateKegiatan`, `deleteKegiatan` | CRUD kegiatan |
| `insertLomba`, `updateLomba`, `deleteLomba` | CRUD lomba |
| `insertPertandingan`, `updatePertandingan`, `deletePertandingan` | CRUD pertandingan |

## 4. Public Pages

### `/kegiatan` — Halaman Utama Kegiatan

**Sekarang:** VerticalStepper dengan 7 item hardcoded.
**Nanti:**
- Server component dengan searchParams `?year=2026&kategori=semarak-kemerdekaan`
- Default: tahun berjalan
- Filter tahun + filter kategori (dropdown/pills)
- Untuk kategori biasa: tampilkan kegiatan sebagai timeline
- Untuk kategori Semarak Kemerdekaan: tampilkan sebagai card expandable dengan lomba + pertandingan di dalamnya
- Gunakan ulang `VerticalStepper` untuk kategori biasa

### `/` — Homepage

**Sekarang:**
- `KEGIATAN_PREVIEW` — 3 hardcoded cards
- `AGENDA` — 3 hardcoded items

**Nanti:**
- **Program cards** — fetch dari `getKategoriAll()`, tiap kategori jadi card. Icon dari DB.
- **Agenda Terbaru** — fetch dari `getKegiatanTerbaru(3)`. Untuk Semarak Kemerdekaan: pakai lomba terdekat.

## 5. Dashboard CRUD

### Route Structure

```
/dashboard/kegiatan/
├── page.tsx          — List kegiatan (filter tahun + kategori, pagination, edit/hapus)
├── input/page.tsx    — Form tambah kegiatan baru
├── [id]/edit/page.tsx — Form edit kegiatan (opsional)
├── kategori/
│   ├── page.tsx      — List kategori + form tambah/edit/hapus
│   └── [id]/page.tsx — Edit kategori (atau modal)
├── lomba/
│   ├── page.tsx      — List lomba (filter by kegiatan)
│   └── input/page.tsx — Form tambah lomba
└── pertandingan/
    ├── page.tsx      — List pertandingan (filter by lomba)
    └── input/page.tsx — Form tambah pertandingan
```

### Navigasi Sidebar

Update `data.navMain` di `app-sidebar.tsx` — Kegiatan jadi collapsible dengan sub-item:

```ts
{
  title: "Kegiatan",
  url: "/dashboard/kegiatan",
  icon: Activity,
  isActive: true,
  items: [
    { title: "Input Kegiatan", url: "/dashboard/kegiatan/input" },
    { title: "Kategori", url: "/dashboard/kegiatan/kategori" },
    { title: "Lomba", url: "/dashboard/kegiatan/lomba" },
    { title: "Pertandingan", url: "/dashboard/kegiatan/pertandingan" },
  ],
},
```

## 6. Urutan Implementasi

| # | Task | File / Area |
|---|---|---|
| 1 | Buat tabel di Supabase | `sql.md` → execute di Supabase SQL Editor |
| 2 | Buat `types/kegiatan.ts` | Zod schemas + TypeScript types |
| 3 | Tambah server queries | `lib/supabase/queries-server.ts` |
| 4 | Tambah client queries | `lib/supabase/queries-client.ts` |
| 5 | Seed data awal | Isi kategori + kegiatan dari konten hardcoded yang ada |
| 6 | Update `/kegiatan` public page | Dynamic fetch, filter year, kategori display |
| 7 | Update homepage | Program cards + agenda dari DB |
| 8 | Dashboard: Input kegiatan | Form page |
| 9 | Dashboard: List kegiatan | Table with pagination + filters |
| 10 | Dashboard: Kategori CRUD | List + form |
| 11 | Dashboard: Lomba CRUD | List + form |
| 12 | Dashboard: Pertandingan CRUD | List + form |
| 13 | Update sidebar nav | app-sidebar.tsx |

## 7. Catatan

- Auth belum diaktifkan penuh di middleware (dicomment). Dashboard tetap bisa diakses tanpa login untuk development. Nanti bisa diaktifkan dengan uncomment redirect logic di `middleware.ts`.
- Schema database: `public` (bukan `db_kanggotan2` seperti haul). Atau konsisten pakai `db_kanggotan2`.
- Gunakan pola yang sama seperti Haul: Server Components untuk fetching + searchParams untuk filter.
