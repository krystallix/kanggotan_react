# Plan: Sponsor — Storage Cleanup + Carousel UX

## Scope

1. **C — Storage cleanup**: hapus file (logo/foto) dari bucket `sponsors` saat sponsor/foto dihapus, biar tak ada file orphan.
2. **B5 — Thumbnail + lazy**: thumbnail aktif auto-scroll ke tengah viewport + `loading="lazy"` pada thumbnail.

## 1. Storage Cleanup

### `lib/supabase/queries-client.ts`
- Helper baru `deleteSponsorStorageFiles(urls: (string | null)[])`
  - Parse nama file dari URL (`.../storage/v1/object/public/sponsors/<nama>`)
  - `supabase.storage.from("sponsors").remove([nama])`
  - Error hanya di-log (jangan throw, biar hapus row tetap jalan)
- Ubah `deleteSponsor(id)` → `deleteSponsor(sponsor: Sponsor)`
  - Hapus file `logo_url` + semua `photos` dulu
  - Lalu hapus row sponsor

### `app/dashboard/kegiatan/input/sponsor-manager.tsx`
- `handleDeleteSponsor` → kirim objek `sponsor` lengkap (bukan id)
- `SponsorForm.handleSubmit` (mode edit):
  - Foto yang dihapus = `initial.photos` minus `finalPhotos`
  - Logo yang dihapus = `initial.logo_url` jika `finalLogoUrl !== initial.logo_url`
  - Setelah `updateSponsor` sukses → `deleteSponsorStorageFiles([...])`
- `SponsorForm.handleSubmit` (mode add):
  - Jika `insertSponsor` gagal setelah upload → cleanup file yang baru di-upload

## 2. Carousel — `app/sponsor/[kategori_year]/[id_sponsor]/photo-carousel.tsx`

- `loading="lazy"` pada semua `<img>` thumbnail (row card + row overlay). Main image tetap eager.
- Aktif thumbnail auto-scroll:
  - `useRef<(HTMLButtonElement | null)[]>[]` per row (card + overlay)
  - `useEffect` pada `[index]` → `scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })`

## 3. Catatan

- `deleteSponsor` hanya dipakai di `sponsor-manager.tsx` (sudah diverifikasi via grep).
- Runtime storage cleanup tak bisa ditest headless (RLS butuh auth) → test manual di dashboard admin.

## 4. Verifikasi

- `npx tsc --noEmit`
- `npx eslint` pada file yang diubah
- `npm run build`
