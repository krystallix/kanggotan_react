"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import DashLayout from "@/components/layout/dash-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import { getAllLombaPaginatedClient, insertPertandingan, updatePertandingan } from "@/lib/supabase/queries-client"
import type { Lomba } from "@/types/kegiatan"
import { toast } from "sonner"
import Link from "next/link"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

export default function InputPertandingan() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")

  const [lombaList, setLombaList] = useState<(Lomba & { kegiatan?: { title: string } })[]>([])
  const [lombaId, setLombaId] = useState("")
  const [timA, setTimA] = useState("")
  const [timB, setTimB] = useState("")
  const [babak, setBabak] = useState("Penyisihan")
  const [tanggal, setTanggal] = useState("")
  const [jam, setJam] = useState("")
  const [lokasi, setLokasi] = useState("")
  const [skorA, setSkorA] = useState("")
  const [skorB, setSkorB] = useState("")
  const [status, setStatus] = useState("terjadwal")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!editId)

  useEffect(() => {
    getAllLombaPaginatedClient(1, 100).then((res) => {
      setLombaList(res.data as (Lomba & { kegiatan?: { title: string } })[])
    })
    if (editId) {
      const supabase = createClient()
      supabase
        .schema("db_kanggotan2")
        .from("pertandingan")
        .select("*")
        .eq("id", Number(editId))
        .single()
        .then(({ data, error }) => {
          if (error || !data) { toast.error("Pertandingan tidak ditemukan"); return }
          setLombaId(String(data.lomba_id))
          setTimA(data.tim_a)
          setTimB(data.tim_b)
          setBabak(data.babak)
          setTanggal(data.tanggal || "")
          setJam(data.jam || "")
          setLokasi(data.lokasi || "")
          setSkorA(data.skor_a !== null ? String(data.skor_a) : "")
          setSkorB(data.skor_b !== null ? String(data.skor_b) : "")
          setStatus(data.status)
          setFetching(false)
        })
    }
  }, [editId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lombaId || !timA.trim() || !timB.trim() || !babak.trim()) {
      toast.error("Lomba, tim A, tim B, dan babak wajib diisi")
      return
    }
    setLoading(true)
    try {
      const payload = {
        lomba_id: Number(lombaId),
        tim_a: timA.trim(),
        tim_b: timB.trim(),
        babak: babak.trim(),
        tanggal: tanggal || undefined,
        jam: jam || undefined,
        lokasi: lokasi.trim() || undefined,
        skor_a: skorA ? Number(skorA) : null,
        skor_b: skorB ? Number(skorB) : null,
        status: status as 'terjadwal' | 'berlangsung' | 'selesai',
        sort_order: 0,
      }
      if (editId) {
        await updatePertandingan(Number(editId), payload)
        toast.success("Pertandingan berhasil diupdate")
      } else {
        await insertPertandingan(payload)
        toast.success("Pertandingan berhasil ditambahkan")
      }
      router.push("/dashboard/kegiatan/pertandingan")
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan pertandingan")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <DashLayout>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-5 animate-spin mr-2" /> Memuat data pertandingan...
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout>
      <div className="py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/kegiatan/pertandingan"><ArrowLeft className="size-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {editId ? "Edit Pertandingan" : "Tambah Pertandingan"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {editId ? "Perbarui jadwal pertandingan" : "Tambah jadwal pertandingan baru"}
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-6">
                  <Field>
                    <FieldLabel htmlFor="lomba" className="text-sm">Lomba (Turnamen)</FieldLabel>
                    <Select value={lombaId} onValueChange={setLombaId}>
                      <SelectTrigger id="lomba"><SelectValue placeholder="Pilih lomba" /></SelectTrigger>
                      <SelectContent>
                        {lombaList.filter(l => l.has_pertandingan).map((l) => (
                          <SelectItem key={l.id} value={String(l.id)}>{l.nama}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field>
                      <FieldLabel htmlFor="timA" className="text-sm">Tim A</FieldLabel>
                      <Input id="timA" value={timA} onChange={(e) => setTimA(e.target.value)} placeholder="e.g. RT 01" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="timB" className="text-sm">Tim B</FieldLabel>
                      <Input id="timB" value={timB} onChange={(e) => setTimB(e.target.value)} placeholder="e.g. RT 02" />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="babak" className="text-sm">Babak</FieldLabel>
                    <Select value={babak} onValueChange={setBabak}>
                      <SelectTrigger id="babak"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Penyisihan">Penyisihan</SelectItem>
                        <SelectItem value="Semifinal">Semifinal</SelectItem>
                        <SelectItem value="Final">Final</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FieldLabel htmlFor="lokasi" className="text-sm">Lokasi</FieldLabel>
                    <Input id="lokasi" value={lokasi} onChange={(e) => setLokasi(e.target.value)} placeholder="e.g. Lapangan Voli Balai RW" />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Field>
                      <FieldLabel htmlFor="skorA" className="text-sm">Skor A</FieldLabel>
                      <Input id="skorA" type="number" value={skorA} onChange={(e) => setSkorA(e.target.value)} min={0} placeholder="—" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="skorB" className="text-sm">Skor B</FieldLabel>
                      <Input id="skorB" type="number" value={skorB} onChange={(e) => setSkorB(e.target.value)} min={0} placeholder="—" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="status" className="text-sm">Status</FieldLabel>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="terjadwal">Terjadwal</SelectItem>
                          <SelectItem value="berlangsung">Berlangsung</SelectItem>
                          <SelectItem value="selesai">Selesai</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

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
