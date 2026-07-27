"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import DashLayout from "@/components/layout/dash-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import { getKategoriAllClient, insertKegiatan, updateKegiatan } from "@/lib/supabase/queries-client"
import type { KegiatanKategori } from "@/types/kegiatan"
import { toast } from "sonner"
import Link from "next/link"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { DatePickerField } from "@/components/date-picker-field"

export default function InputKegiatan() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")

  const [kategoriList, setKategoriList] = useState<KegiatanKategori[]>([])
  const [kategoriId, setKategoriId] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!editId)

  useEffect(() => {
    getKategoriAllClient().then(setKategoriList)
    if (editId) {
      const supabase = createClient()
      supabase
        .schema("db_kanggotan2")
        .from("kegiatan")
        .select("*")
        .eq("id", Number(editId))
        .single()
        .then(({ data, error }) => {
          if (error || !data) { toast.error("Kegiatan tidak ditemukan"); return }
          setKategoriId(String(data.kategori_id))
          setTitle(data.title)
          setDescription(data.description || "")
          setDate(data.date)
          setYear(String(data.year))
          setIsPublished(data.is_published)
          setFetching(false)
        })
    }
  }, [editId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date || !kategoriId) {
      toast.error("Judul, tanggal, dan kategori wajib diisi")
      return
    }
    setLoading(true)
    try {
      const payload = {
        kategori_id: Number(kategoriId),
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        year: Number(year),
        is_published: isPublished,
      }
      if (editId) {
        await updateKegiatan(Number(editId), payload)
        toast.success("Kegiatan berhasil diupdate")
      } else {
        await insertKegiatan(payload)
        toast.success("Kegiatan berhasil ditambahkan")
      }
      router.push("/dashboard/kegiatan")
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan kegiatan")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <DashLayout>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-5 animate-spin mr-2" /> Memuat data kegiatan...
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout>
      <div className="py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/kegiatan"><ArrowLeft className="size-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {editId ? "Edit Kegiatan" : "Tambah Kegiatan"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {editId ? "Perbarui data kegiatan" : "Isi data kegiatan baru RISMA"}
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-6">
                  <Field>
                    <FieldLabel htmlFor="kategori" className="text-sm">Kategori</FieldLabel>
                    <Select value={kategoriId} onValueChange={setKategoriId}>
                      <SelectTrigger id="kategori"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>
                        {kategoriList.map((k) => (
                          <SelectItem key={k.id} value={String(k.id)}>{k.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="title" className="text-sm">Judul Kegiatan</FieldLabel>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Takbiran Idul Adha 2026" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="desc" className="text-sm">Deskripsi</FieldLabel>
                    <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi kegiatan (opsional)" />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field>
                      <FieldLabel htmlFor="date" className="text-sm">Tanggal</FieldLabel>
                      <DatePickerField value={date} onChange={setDate} year={year} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="year" className="text-sm">Tahun</FieldLabel>
                      <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} min={2020} max={2099} />
                    </Field>
                  </div>

                  <Field>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isPublished}
                          onChange={(e) => setIsPublished(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 rounded-full bg-muted peer-checked:bg-primary transition-colors" />
                        <div className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
                      </div>
                      <div>
                        <span className="text-sm font-medium">Published</span>
                        <p className="text-xs text-muted-foreground">Tampilkan di halaman publik</p>
                      </div>
                    </label>
                  </Field>

                  <div className="flex justify-end pt-4 border-t border-border/50">
                    <Button type="submit" disabled={loading} size="lg">
                      {loading ? (
                        <><Loader2 className="size-4 mr-2 animate-spin" />Menyimpan...</>
                      ) : (
                        <><Save className="size-4 mr-2" />Simpan</>
                      )}
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashLayout>
  )
}
