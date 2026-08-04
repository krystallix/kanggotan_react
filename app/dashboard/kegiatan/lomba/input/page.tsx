"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import DashLayout from "@/components/layout/dash-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import { getKegiatanByYearClient, insertLomba, updateLomba } from "@/lib/supabase/queries-client"
import type { KegiatanWithKategori } from "@/types/kegiatan"
import { toast } from "sonner"
import Link from "next/link"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

export default function InputLomba() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")

  const [kegiatanList, setKegiatanList] = useState<KegiatanWithKategori[]>([])
  const [kegiatanId, setKegiatanId] = useState("")
  const [nama, setNama] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [tanggal, setTanggal] = useState("")
  const [jam, setJam] = useState("")
  const [picNama, setPicNama] = useState("")
  const [picKontak, setPicKontak] = useState("")
  const [hasPertandingan, setHasPertandingan] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!editId)

  useEffect(() => {
    const year = new Date().getFullYear()
    getKegiatanByYearClient(year).then(setKegiatanList)
    if (editId) {
      const supabase = createClient()
      supabase
        .schema("db_kanggotan2")
        .from("lomba")
        .select("*")
        .eq("id", Number(editId))
        .single()
        .then(({ data, error }) => {
          if (error || !data) { toast.error("Lomba tidak ditemukan"); return }
          setKegiatanId(String(data.kegiatan_id))
          setNama(data.nama)
          setDeskripsi(data.deskripsi || "")
          setTanggal(data.tanggal || "")
          setJam(data.jam || "")
          setPicNama(data.pic_nama)
          setPicKontak(data.pic_kontak || "")
          setHasPertandingan(data.has_pertandingan)
          setFetching(false)
        })
    }
  }, [editId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nama.trim() || !kegiatanId || !picNama.trim()) {
      toast.error("Nama lomba, kegiatan, dan PIC wajib diisi")
      return
    }
    setLoading(true)
    try {
      const payload = {
        kegiatan_id: Number(kegiatanId),
        nama: nama.trim(),
        deskripsi: deskripsi.trim() || undefined,
        tanggal: tanggal || undefined,
        jam: jam || undefined,
        pic_nama: picNama.trim(),
        pic_kontak: picKontak.trim() || undefined,
        sort_order: 0,
        has_pertandingan: hasPertandingan,
      }
      if (editId) {
        await updateLomba(Number(editId), payload)
        toast.success("Lomba berhasil diupdate")
      } else {
        await insertLomba(payload)
        toast.success("Lomba berhasil ditambahkan")
      }
      router.push("/dashboard/kegiatan/lomba")
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan lomba")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <DashLayout>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-5 animate-spin mr-2" /> Memuat data lomba...
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/kegiatan/lomba"><ArrowLeft className="size-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {editId ? "Edit Lomba" : "Tambah Lomba"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {editId ? "Perbarui data lomba" : "Tambah lomba baru untuk kegiatan"}
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-6">
                  <Field>
                    <FieldLabel htmlFor="kegiatan" className="text-sm">Kegiatan</FieldLabel>
                    <Select value={kegiatanId} onValueChange={setKegiatanId}>
                      <SelectTrigger id="kegiatan"><SelectValue placeholder="Pilih kegiatan" /></SelectTrigger>
                      <SelectContent>
                        {kegiatanList.map((k) => (
                          <SelectItem key={k.id} value={String(k.id)}>{k.title} ({k.year})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="nama" className="text-sm">Nama Lomba</FieldLabel>
                    <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="e.g. Lomba Voli" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="desc" className="text-sm">Deskripsi</FieldLabel>
                    <Input id="desc" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi lomba (opsional)" />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field>
                      <FieldLabel htmlFor="tgl" className="text-sm">Tanggal</FieldLabel>
                      <Input id="tgl" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="jam" className="text-sm">Jam</FieldLabel>
                      <Input id="jam" type="time" value={jam} onChange={(e) => setJam(e.target.value)} />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="pic" className="text-sm">Penanggung Jawab (PIC)</FieldLabel>
                    <Input id="pic" value={picNama} onChange={(e) => setPicNama(e.target.value)} placeholder="Nama PIC" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="kontak" className="text-sm">Kontak PIC</FieldLabel>
                    <Input id="kontak" value={picKontak} onChange={(e) => setPicKontak(e.target.value)} placeholder="No. WhatsApp (opsional)" />
                  </Field>

                  <Field>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={hasPertandingan}
                          onChange={(e) => setHasPertandingan(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 rounded-full bg-muted peer-checked:bg-primary transition-colors" />
                        <div className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
                      </div>
                      <div>
                        <span className="text-sm font-medium">Lomba turnamen</span>
                        <p className="text-xs text-muted-foreground">Aktifkan jika lomba memiliki jadwal pertandingan (tim vs tim)</p>
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
