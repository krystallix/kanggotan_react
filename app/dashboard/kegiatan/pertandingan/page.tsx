"use client"

import { useEffect, useState } from "react"
import DashLayout from "@/components/layout/dash-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Swords, CalendarDays, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { getAllPertandinganPaginatedClient, deletePertandingan } from "@/lib/supabase/queries-client"
import type { Pertandingan } from "@/types/kegiatan"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export default function PertandinganPage() {
  const [data, setData] = useState<(Pertandingan & { lomba?: { nama: string } })[]>([])
  const [total, setTotal] = useState(0)

  const fetchData = async () => {
    const res = await getAllPertandinganPaginatedClient(1, 100)
    setData(res.data as (Pertandingan & { lomba?: { nama: string } })[])
    setTotal(res.total)
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: number) => {
    try {
      await deletePertandingan(id)
      toast.success("Pertandingan berhasil dihapus")
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus pertandingan")
    }
  }

  return (
    <DashLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pertandingan</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {total > 0 ? `${total} pertandingan` : "Kelola jadwal pertandingan"}
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/kegiatan/pertandingan/input"><Plus className="size-4 mr-2" />Tambah Pertandingan</Link>
          </Button>
        </div>

        <Card className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-medium">Lomba</TableHead>
                  <TableHead className="font-medium">Tim</TableHead>
                  <TableHead className="font-medium">Babak</TableHead>
                  <TableHead className="font-medium">Jadwal</TableHead>
                  <TableHead className="font-medium">Lokasi</TableHead>
                  <TableHead className="font-medium">Skor</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="w-24 font-medium">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Swords className="size-10 text-muted-foreground/40 mb-3" />
                        <p className="text-base font-medium text-muted-foreground">Belum ada pertandingan</p>
                        <p className="text-sm text-muted-foreground/60 mt-1 mb-4">Tambah jadwal pertandingan untuk lomba turnamen</p>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/dashboard/kegiatan/pertandingan/input"><Plus className="size-4 mr-1.5" />Tambah Pertandingan</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((p) => (
                    <TableRow key={p.id} className="group">
                      <TableCell className="text-sm font-medium">{p.lomba?.nama || <span className="italic text-muted-foreground/50">—</span>}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{p.tim_a}</span>
                          <span className="text-xs text-muted-foreground">vs</span>
                          <span className="font-medium text-sm">{p.tim_b}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium bg-muted/50 px-2.5 py-1 rounded-full">{p.babak}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          {p.tanggal && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="size-3" />
                              {new Date(p.tanggal + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                          {p.jam && (
                            <span className="inline-flex items-center gap-1 ml-3">
                              <Clock className="size-3" />
                              {p.jam.slice(0, 5)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.lokasi ? (
                          <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{p.lokasi}</span>
                        ) : <span className="italic text-muted-foreground/50">—</span>}
                      </TableCell>
                      <TableCell>
                        {p.skor_a !== null ? (
                          <span className="font-mono text-sm font-bold tabular-nums">
                            {p.skor_a} – {p.skor_b}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/60 italic">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                          p.status === 'selesai'
                            ? 'bg-green-50 text-green-700 border-green-200/50'
                            : p.status === 'berlangsung'
                            ? 'bg-blue-50 text-blue-700 border-blue-200/50'
                            : 'bg-zinc-50 text-zinc-500 border-zinc-200/50'
                        }`}>
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" asChild className="hover:bg-accent">
                            <Link href={`/dashboard/kegiatan/pertandingan/input?id=${p.id}`}><Pencil className="size-3.5" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="hover:bg-red-50 hover:text-red-600">
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
