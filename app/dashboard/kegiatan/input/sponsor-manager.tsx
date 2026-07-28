"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Trash2, Globe, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { getSponsorsByKegiatanIdClient, insertSponsor, deleteSponsor, uploadSponsorLogo } from "@/lib/supabase/queries-client"
import type { Sponsor } from "@/types/kegiatan"
import { toast } from "sonner"

export function SponsorManager({ kegiatanId }: { kegiatanId: number }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [fetching, setFetching] = useState(true)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form states
  const [nama, setNama] = useState("")
  const [lokasiUrl, setLokasiUrl] = useState("")
  const [sosmedUrl, setSosmedUrl] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const data = await getSponsorsByKegiatanIdClient(kegiatanId)
        if (active) {
          setSponsors(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (active) {
          setFetching(false)
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [kegiatanId])

  const fetchSponsors = async () => {
    try {
      const data = await getSponsorsByKegiatanIdClient(kegiatanId)
      setSponsors(data)
    } catch (e: unknown) {
      console.error(e)
    }
  }

  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nama.trim()) {
      toast.error("Nama sponsor wajib diisi")
      return
    }

    setLoading(true)
    try {
      let logoUrl = ""
      const file = fileInputRef.current?.files?.[0]
      if (file) {
        logoUrl = await uploadSponsorLogo(file)
      }

      await insertSponsor({
        kegiatan_id: kegiatanId,
        nama: nama.trim(),
        lokasi_url: lokasiUrl.trim() || null,
        sosmed_url: sosmedUrl.trim() || null,
        deskripsi: deskripsi.trim() || null,
        logo_url: logoUrl || null,
      })

      toast.success("Sponsor berhasil ditambahkan")
      setNama("")
      setLokasiUrl("")
      setSosmedUrl("")
      setDeskripsi("")
      if (fileInputRef.current) fileInputRef.current.value = ""
      setAdding(false)
      fetchSponsors()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menambahkan sponsor")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSponsor = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus sponsor ini?")) return
    try {
      await deleteSponsor(id)
      toast.success("Sponsor berhasil dihapus")
      fetchSponsors()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus sponsor")
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
        <Loader2 className="size-4 animate-spin mr-2" /> Memuat sponsor...
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Sponsor Kegiatan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Kelola sponsor yang terhubung dengan kegiatan ini</p>
        </div>
        {!adding && (
          <Button onClick={() => setAdding(true)} size="sm">
            <Plus className="size-4 mr-1.5" /> Tambah Sponsor
          </Button>
        )}
      </div>

      {adding && (
        <Card className="mb-6 border-border bg-muted/20">
          <CardContent className="p-5">
            <form onSubmit={handleAddSponsor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-xs">Nama Sponsor *</FieldLabel>
                  <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="e.g. CV Maju Bersama" />
                </Field>
                <Field>
                  <FieldLabel className="text-xs">Lokasi URL (Google Maps)</FieldLabel>
                  <Input value={lokasiUrl} onChange={(e) => setLokasiUrl(e.target.value)} placeholder="e.g. https://maps.app.goo.gl/..." />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-xs">Sosmed URL (Instagram/dll)</FieldLabel>
                  <Input value={sosmedUrl} onChange={(e) => setSosmedUrl(e.target.value)} placeholder="e.g. https://instagram.com/sponsor" />
                </Field>
                <Field>
                  <FieldLabel className="text-xs">Logo Sponsor</FieldLabel>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/95 cursor-pointer"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel className="text-xs">Deskripsi</FieldLabel>
                <Input value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi singkat sponsor (opsional)" />
              </Field>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setAdding(false)}>
                  Batal
                </Button>
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin mr-1.5" /> : null}
                  Simpan Sponsor
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {sponsors.length === 0 ? (
        <p className="text-center py-10 text-xs text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/10">
          Belum ada sponsor untuk kegiatan ini.
        </p>
      ) : (
        <div className="grid gap-3 grid-cols-1">
          {sponsors.map((s) => (
            <div key={s.id} className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-xs">
              {s.logo_url ? (
                <img src={s.logo_url} alt={s.nama} className="size-10 rounded-lg object-contain bg-muted p-1 border border-border/40 shrink-0" />
              ) : (
                <div className="size-10 rounded-lg bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0">
                  {s.nama.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs truncate">{s.nama}</h4>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  {s.lokasi_url && (
                    <a href={s.lokasi_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1">
                      <MapPin className="size-2.5 shrink-0" />
                      Lokasi Maps
                    </a>
                  )}
                  {s.sosmed_url && (
                    <a href={s.sosmed_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1">
                      <Globe className="size-2.5 shrink-0" />
                      Sosial Media
                    </a>
                  )}
                </div>
                {s.deskripsi && (
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{s.deskripsi}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteSponsor(s.id)}
                className="size-7 hover:bg-red-50 hover:text-red-600 rounded-lg"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
