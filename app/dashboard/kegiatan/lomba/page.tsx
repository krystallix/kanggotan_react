"use client"

import { useEffect, useState } from "react"
import DashLayout from "@/components/layout/dash-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, User, CalendarDays, Clock, Trophy, Medal } from "lucide-react"
import Link from "next/link"
import { getAllLombaPaginatedClient, deleteLomba } from "@/lib/supabase/queries-client"
import type { Lomba } from "@/types/kegiatan"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export default function LombaPage() {
  const [data, setData] = useState<(Lomba & { kegiatan?: { title: string } })[]>([])
  const [total, setTotal] = useState(0)

  const fetchData = async () => {
    const res = await getAllLombaPaginatedClient(1, 100)
    setData(res.data as (Lomba & { kegiatan?: { title: string } })[])
    setTotal(res.total)
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteLomba(id)
      toast.success("Lomba berhasil dihapus")
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus lomba")
    }
  }

  const togglePertandingan = async (lomba: Lomba) => {
    const { updateLomba } = await import("@/lib/supabase/queries-client")
    try {
      await updateLomba(lomba.id, {
        kegiatan_id: lomba.kegiatan_id,
        nama: lomba.nama,
        deskripsi: lomba.deskripsi || "",
        tanggal: lomba.tanggal || "",
        jam: lomba.jam || "",
        pic_nama: lomba.pic_nama,
        pic_kontak: lomba.pic_kontak || "",
        sort_order: lomba.sort_order,
        has_pertandingan: !lomba.has_pertandingan,
      })
      toast.success(lomba.has_pertandingan ? "Mode turnamen dinonaktifkan" : "Mode turnamen diaktifkan")
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal update")
    }
  }

  return (
    <DashLayout>
      <div className="py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lomba</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {total > 0 ? `${total} lomba` : "Kelola lomba kegiatan"}
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/kegiatan/lomba/input"><Plus className="size-4 mr-2" />Tambah Lomba</Link>
          </Button>
        </div>

        <Card className="overflow-hidden border-border/50 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-medium">Nama</TableHead>
                  <TableHead className="font-medium">Kegiatan</TableHead>
                  <TableHead className="font-medium">PIC</TableHead>
                  <TableHead className="font-medium">Jadwal</TableHead>
                  <TableHead className="font-medium">Turnamen</TableHead>
                  <TableHead className="w-28 font-medium">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Medal className="size-10 text-muted-foreground/40 mb-3" />
                        <p className="text-base font-medium text-muted-foreground">Belum ada lomba</p>
                        <p className="text-sm text-muted-foreground/60 mt-1 mb-4">Tambah lomba untuk kegiatan</p>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/dashboard/kegiatan/lomba/input"><Plus className="size-4 mr-1.5" />Tambah Lomba</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((l) => (
                    <TableRow key={l.id} className="group">
                      <TableCell className="font-medium">{l.nama}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{l.kegiatan?.title || <span className="italic text-muted-foreground/50">—</span>}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-sm bg-muted/50 px-2.5 py-1 rounded-full">
                          <User className="size-3 text-muted-foreground" />
                          {l.pic_nama}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {l.tanggal && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="size-3" />
                              {new Date(l.tanggal + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                          {l.jam && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="size-3" />
                              {l.jam.slice(0, 5)}
                            </span>
                          )}
                          {!l.tanggal && !l.jam && <span className="italic text-muted-foreground/50">—</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {l.has_pertandingan ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-full">
                            <Trophy className="size-3" />
                            Aktif
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/60 italic">Nonaktif</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => togglePertandingan(l)} title="Toggle turnamen" className="hover:bg-accent">
                            <Trophy className={`size-3.5 ${l.has_pertandingan ? 'text-amber-600' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button variant="ghost" size="icon" asChild className="hover:bg-accent">
                            <Link href={`/dashboard/kegiatan/lomba/input?id=${l.id}`}><Pencil className="size-3.5" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(l.id)} className="hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashLayout>
  )
}
