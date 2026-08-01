# Redesign Plan — Kanggotan React

## Vibe
Clean minimal, tipografi kuat, rich animation (Framer Motion). Referensi: Linear, Vercel, Stripe.

---

## 1. Warna — `globals.css`

### Sekarang
- Primary: hijau generik `oklch(0.527 0.154 150.069)`
- Background: pure white `oklch(1 0 0)`
- Gray: neutral murni, tanpa tint

### Target
- Primary: hijau lebih dalam dan tegas `oklch(0.44 0.16 150)` — tidak mencolok, tetap pembeda
- Accent: amber/gold `oklch(0.72 0.14 75)` — untuk highlight & hover state
- Background: off-white `oklch(0.99 0.005 90)` — sedikit warm, tidak sterile
- Border: warm tinted `oklch(0.91 0.005 90)`
- Foreground: near-black `oklch(0.12 0.005 90)` — bukan pure black
- Muted-foreground: `oklch(0.50 0.01 90)`
- Shadow: tinted ke hue background, bukan black opacity

### Tambahan
- CSS noise texture via `globals.css` untuk hero background (subtle grain)
- `scroll-behavior: smooth` di `:root`

---

## 2. Tipografi

### Font
- Display/heading: `Geist Sans` (sudah ada) — tighten tracking, increase size
- Body: `Inter` (sudah ada) — line-height 1.7
- Data/angka: `Geist Mono` dengan `font-variant-numeric: tabular-nums`

### Scale perubahan
| Element | Sekarang | Target |
|---|---|---|
| Hero h1 | `text-5xl lg:text-6xl` | `text-6xl lg:text-8xl font-black tracking-tighter` |
| Section h2 | `text-4xl font-bold` | `text-4xl lg:text-5xl font-bold tracking-tight` |
| Label subheader | `text-xs uppercase tracking-[0.2em]` | `text-xs font-medium tracking-widest text-primary/70` |
| Body | default | `leading-relaxed max-w-[65ch] text-wrap-pretty` |
| Stat numbers | `text-2xl font-bold` | `text-5xl font-black tabular-nums` |

---

## 3. Animasi — Framer Motion

### Install
```bash
npm install framer-motion
```

### Shared components — `components/motion/`
- `<FadeIn>` — fade + translateY(-12px) saat masuk viewport, `whileInView`, `once: true`
- `<StaggerChildren>` — wrap list items, stagger 0.08s per child
- `<CountUp>` — angka stat naik dari 0 saat masuk viewport
- `<ParallaxSection>` — background scroll lebih lambat dari konten

### Prinsip
- Semua animasi via `transform` dan `opacity` (GPU-accelerated)
- Duration: 0.5–0.8s, easing: `[0.25, 0.1, 0.25, 1]` (ease-out cubic)
- `whileInView` + `viewport={{ once: true }}` — tidak repeat saat scroll balik
- Hover: `scale(1.02)` ringan, `translateY(-2px)`, duration 200ms

---

## 4. Global Layout — `home-layout.tsx`

### Nav
- Sekarang: `bg-background/80 backdrop-blur-md border-b`
- Target:
  - Lebih tipis di awal (py-3), transparant tanpa border saat top
  - Saat scroll turun: background solid + border muncul (via JS `scroll` listener)
  - Logo: font lebih bold, bisa tambah ikon/mark kecil
  - Nav links: aktif state dengan dot bawah animasi, hover warna primary
  - Smooth transition semua state

### Footer
- Sekarang: belum dilihat detailnya
- Target: 2–3 kolom (logo + tagline | navigasi | kontak), copyright bawah

---

## 5. Homepage — `app/page.tsx`

### Hero
- Sekarang: 2-col (teks kiri, SVG kanan)
- Target:
  - Full-width, text-heavy
  - Background: subtle noise/grain + radial gradient dari primary/5
  - Headline: `font-black tracking-tighter text-8xl`, word-by-word stagger reveal
  - Subheadline fade in setelah headline
  - CTA buttons: scale + shadow on hover, stagger masuk setelah subheadline
  - Stats: `CountUp` animation, angka besar, label kecil di bawah
  - Hapus SVG orang — ganti dengan typographic/abstract visual atau background imagery

### Tentang
- Sekarang: 2-col teks + grid 2x2 kotak
- Target:
  - Layout tetap 2-col tapi lebih editorial
  - Grid 2x2: ganti border `bg-border` jadi cards dengan hover background shift
  - Teks paragraph: `max-w-[55ch] leading-relaxed`
  - `FadeIn` per paragraf dengan stagger

### Program/Kategori
- Sekarang: 3 card border-grid horizontal
- Target:
  - Hapus grid border generik
  - Ganti: card individual dengan background putih, border tipis, hover `translateY(-4px)` + shadow tinted
  - Icon lebih besar (size-12), background primary/8 rounded-2xl
  - Stagger animation saat masuk viewport

### Agenda Terbaru
- Sekarang: list sederhana dalam border box
- Target:
  - Timeline vertikal: garis kiri + dot tanggal
  - Setiap item slide masuk dari kiri dengan stagger
  - Tanggal lebih besar dan prominent

### Kontak Strip
- Sekarang: border box di dalam container
- Target:
  - Full-bleed dark section (background `oklch(0.12 0.005 90)`, text white)
  - Keluar dari max-w container dengan negative margin
  - CTA button: amber/gold accent

---

## 6. Halaman Kegiatan — `app/kegiatan/page.tsx`

### Filter bar
- Sekarang: filter pills biasa, tidak sticky
- Target: sticky filter bar saat scroll, glass-morphism effect

### Card kegiatan
- Sekarang: border card dengan info padat
- Target:
  - Layout editorial: tanggal besar di kiri (seperti majalah), konten kanan
  - Separator antar item via garis bukan card border
  - Hover: background shift subtle + translateX pada arrow
  - `FadeIn` per item dengan stagger

### Lomba di dalam card
- Sekarang: nested card biasa
- Target: lebih compact, badge "Turnamen" lebih prominent

---

## 7. Lomba Detail — `app/kegiatan/lomba/[id]/page.tsx`

### Header
- Target: background subtle radial gradient dari primary/5, padding lebih lapang

### Klasemen
- Target:
  - Top position: warna lebih bold (gold #1, silver #2, bronze #3)
  - Row hover lebih nyata
  - Kolom padding lebih compact di mobile

### Match panels
- Target: score font lebih besar (`text-2xl font-black`)
- Babak badge lebih visible

---

## Urutan Implementasi

| # | Task | File |
|---|---|---|
| 1 | Warna + tipografi | `globals.css` |
| 2 | Install framer-motion | terminal |
| 3 | Shared animation components | `components/motion/` |
| 4 | Nav redesign | `home-layout.tsx` |
| 5 | Homepage redesign | `app/page.tsx` |
| 6 | Kegiatan page | `app/kegiatan/page.tsx` |
| 7 | Lomba detail | `app/kegiatan/lomba/[id]/page.tsx` |

---

## Audit — Generic AI Patterns yang Dihapus

Berdasarkan `redesign-existing-projects` skill audit:

- [x] Pure white background → off-white warm
- [x] 3 equal card columns → varied layout
- [x] Generic border+shadow card → surface-based
- [x] Instant transitions → 200-300ms smooth
- [x] Semua uppercase subheader → sentence case atau tracking-widest
- [x] Flat sections tanpa depth → grain/gradient/imagery
- [x] Stat angka kecil → large CountUp
- [x] SVG ilustrasi generik → typography-driven hero
- [x] Kontak strip biasa → full-bleed dark section
