"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Trash2, Loader2, Link2, Phone, X, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { getSponsorsByYearKategoriClient, insertSponsor, updateSponsor, deleteSponsor, deleteSponsorStorageFiles, uploadSponsorFile } from "@/lib/supabase/queries-client"
import type { Sponsor, SponsorLink } from "@/types/kegiatan"
import { toast } from "sonner"

function SponsorForm({
  year,
  kategoriId,
  initial,
  onSuccess,
  onCancel,
}: {
  year: number
  kategoriId: number
  initial?: Sponsor
  onSuccess: () => void
  onCancel: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [nama, setNama] = useState(initial?.nama ?? "")
  const [phone, setPhone] = useState(initial?.phone ?? "")
  const [deskripsi, setDeskripsi] = useState(initial?.deskripsi ?? "")
  const [links, setLinks] = useState<SponsorLink[]>(initial && initial.links.length > 0 ? initial.links : [{ title: "", url: "" }])
  const [logoUrl, setLogoUrl] = useState<string | null>(initial?.logo_url ?? null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [existingPhotos, setExistingPhotos] = useState<string[]>(initial?.photos ?? [])
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const logoInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const updateLink = (index: number, patch: Partial<SponsorLink>) => {
    setLinks((prev) => prev.map((link, i) => (i === index ? { ...link, ...patch } : link)))
  }

  const addLink = () => setLinks((prev) => [...prev, { title: "", url: "" }])
  const removeLink = (index: number) => setLinks((prev) => prev.filter((_, i) => i !== index))

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setLogoFile(file)
    if (file) setLogoUrl(null)
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoUrl(null)
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPhotoFiles((prev) => [...prev, ...files])
    if (photoInputRef.current) photoInputRef.current.value = ""
  }

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const removePhotoFile = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nama.trim()) {
      toast.error("Nama sponsor wajib diisi")
      return
    }
    const cleanLinks = links.filter((l) => l.title.trim() && l.url.trim())
    if (cleanLinks.length > 0 && cleanLinks.some((l) => !l.title.trim() || !l.url.trim())) {
      toast.error("Judul dan URL setiap link wajib diisi")
      return
    }

    setLoading(true)
    const uploaded: string[] = []
    try {
      let finalLogoUrl = logoUrl
      if (logoFile) {
        finalLogoUrl = await uploadSponsorFile(logoFile)
        if (finalLogoUrl) uploaded.push(finalLogoUrl)
      }

      const newPhotoUrls = []
      for (const file of photoFiles) {
        const url = await uploadSponsorFile(file)
        if (url) {
          newPhotoUrls.push(url)
          uploaded.push(url)
        }
      }
      const finalPhotos = [...existingPhotos, ...newPhotoUrls]

      const payload = {
        year,
        kategori_id: kategoriId,
        nama: nama.trim(),
        phone: phone.trim() || null,
        deskripsi: deskripsi.trim() || null,
        logo_url: finalLogoUrl || null,
        links: cleanLinks,
        photos: finalPhotos,
      }

      if (initial) {
        await updateSponsor(initial.id, payload)
        const removedLogo = initial.logo_url && finalLogoUrl !== initial.logo_url ? initial.logo_url : null
        const removedPhotos = initial.photos.filter((p) => !finalPhotos.includes(p))
        await deleteSponsorStorageFiles([removedLogo, ...removedPhotos])
        toast.success("Sponsor berhasil diupdate")
      } else {
        await insertSponsor(payload)
        toast.success("Sponsor berhasil ditambahkan")
      }
      onSuccess()
    } catch (err: unknown) {
      if (uploaded.length > 0) {
        await deleteSponsorStorageFiles(uploaded).catch(() => {})
      }
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan sponsor")
    } finally {
      setLoading(false)
    }
  }

  const logoPreview = logoFile ? URL.createObjectURL(logoFile) : logoUrl

  return (
    <Card className="mb-6 border-border bg-muted/20">
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-xs">Nama Sponsor *</FieldLabel>
              <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="e.g. CV Maju Bersama" />
            </Field>
            <Field>
              <FieldLabel className="text-xs">Phone / WhatsApp</FieldLabel>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0812-3456-7890" />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-xs">Logo Sponsor</FieldLabel>
              <input
                type="file"
                ref={logoInputRef}
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/95 cursor-pointer"
              />
              {logoPreview && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={logoPreview} alt="Preview logo" className="size-10 rounded-lg object-contain bg-muted p-1 border border-border/40" />
                  <span className="text-[10px] text-muted-foreground truncate">{logoFile ? logoFile.name : "Logo saat ini"}</span>
                  <button type="button" onClick={removeLogo} className="ml-auto text-muted-foreground hover:text-foreground">
                    <X className="size-3.5" />
                  </button>
                </div>
              )}
            </Field>
            <Field>
              <FieldLabel className="text-xs">Foto Sponsor (bisa banyak)</FieldLabel>
              <input
                type="file"
                ref={photoInputRef}
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/95 cursor-pointer"
              />
              {(existingPhotos.length > 0 || photoFiles.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {existingPhotos.map((photo, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img src={photo} alt={`Foto ${index + 1}`} className="size-10 rounded-lg object-cover bg-muted p-0.5 border border-border/40" />
                      <button type="button" onClick={() => removeExistingPhoto(index)} className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 text-white p-0.5">
                        <X className="size-2.5" />
                      </button>
                    </div>
                  ))}
                  {photoFiles.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img src={URL.createObjectURL(file)} alt={`Foto baru ${index + 1}`} className="size-10 rounded-lg object-cover bg-muted p-0.5 border border-border/40" />
                      <button type="button" onClick={() => removePhotoFile(index)} className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 text-white p-0.5">
                        <X className="size-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel className="text-xs flex items-center gap-1.5">
              <Link2 className="size-3.5" /> Link Dinamis
            </FieldLabel>
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={link.title} onChange={(e) => updateLink(index, { title: e.target.value })} placeholder="Judul (e.g. Website, Instagram)" className="w-40 shrink-0" />
                  <Input value={link.url} onChange={(e) => updateLink(index, { url: e.target.value })} placeholder="https://..." />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(index)} disabled={links.length === 1} className="size-8 shrink-0 hover:bg-red-50 hover:text-red-600">
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addLink}>
                <Plus className="size-3.5 mr-1.5" /> Tambah Link
              </Button>
            </div>
          </Field>

          <Field>
            <FieldLabel className="text-xs">Deskripsi</FieldLabel>
            <Input value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi singkat sponsor (opsional)" />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin mr-1.5" /> : null}
              {initial ? "Update Sponsor" : "Simpan Sponsor"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function SponsorManager({ year, kategoriId }: { year: number; kategoriId: number }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [fetching, setFetching] = useState(true)
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Sponsor | null>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const data = await getSponsorsByYearKategoriClient(year, kategoriId)
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
  }, [year, kategoriId])

  const fetchSponsors = async () => {
    try {
      const data = await getSponsorsByYearKategoriClient(year, kategoriId)
      setSponsors(data)
    } catch (e: unknown) {
      console.error(e)
    }
  }

  const handleSuccess = () => {
    setAdding(false)
    setEditing(null)
    fetchSponsors()
  }

  const handleDeleteSponsor = async (sponsor: Sponsor) => {
    if (!confirm("Apakah Anda yakin ingin menghapus sponsor ini?")) return
    try {
      await deleteSponsor(sponsor)
      toast.success("Sponsor berhasil dihapus")
      fetchSponsors()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus sponsor")
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
          <h2 className="text-xl font-bold tracking-tight">Sponsor Kategori</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Dibagikan ke semua kegiatan kategori ini di tahun {year}</p>
        </div>
        {!adding && !editing && (
          <Button onClick={() => setAdding(true)} size="sm">
            <Plus className="size-4 mr-1.5" /> Tambah Sponsor
          </Button>
        )}
      </div>

      {(adding || editing) && (
        <SponsorForm
          year={year}
          kategoriId={kategoriId}
          initial={editing ?? undefined}
          onSuccess={handleSuccess}
          onCancel={() => {
            setAdding(false)
            setEditing(null)
          }}
        />
      )}

      {sponsors.length === 0 ? (
        <p className="text-center py-10 text-xs text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/10">
          Belum ada sponsor untuk kategori ini tahun {year}.
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
                  {s.phone && (
                    <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                      <Phone className="size-2.5 shrink-0" />
                      {s.phone}
                    </a>
                  )}
                  {s.links.map((link, index) => (
                    <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1">
                      <Link2 className="size-2.5 shrink-0" />
                      {link.title}
                    </a>
                  ))}
                </div>
                {s.deskripsi && (
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{s.deskripsi}</p>
                )}
                {s.photos.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {s.photos.map((photo, index) => (
                      <a key={index} href={photo} target="_blank" rel="noopener noreferrer">
                        <img src={photo} alt={`${s.nama} foto ${index + 1}`} className="size-8 rounded-md object-cover border border-border/40" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditing(s)}
                  className="size-7 hover:bg-primary/10 hover:text-primary rounded-lg"
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteSponsor(s)}
                  className="size-7 hover:bg-red-50 hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
