"use client"

import { useEffect, useState } from "react"
import DashLayout from "@/components/layout/dash-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Swords, CalendarDays, Clock, MapPin, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import { getAllPertandinganPaginatedClient, deletePertandingan } from "@/lib/supabase/queries-client"
import type { Pertandingan } from "@/types/kegiatan"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

type SortKey = "lomba_nama" | "tim" | "babak" | "tanggal" | "lokasi" | "skor" | "status"
type SortOrder = "asc" | "desc"

export default function PertandinganPage() {
  const [data, setData] = useState<(Pertandingan & { lomba?: { nama: string } })[]>([])
  const [total, setTotal] = useState(0)
  const [sortKey, setSortKey] = useState<SortKey>("tanggal")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const fetchData = async () => {
    const res = await getAllPertandinganPaginatedClient(1, 100)
    setData(res.data as (Pertandingan & { lomba?: { nama: string } })[])
    setTotal(res.total)
  }

  useEffect(() => { fetchData() }, [])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    let valA: any
    let valB: any

    if (sortKey === "lomba_nama") {
      valA = a.lomba?.nama || ""
      valB = b.lomba?.nama || ""
    } else if (sortKey === "tim") {
      valA = a.tim_a || ""
      valB = b.tim_a || ""
    } else if (sortKey === "skor") {
      valA = a.skor_a !== null ? a.skor_a : -1
      valB = b.skor_a !== null ? b.skor_a : -1
    } else {
      valA = a[sortKey as keyof Pertandingan]
      valB = b[sortKey as keyof Pertandingan]
    }

    if (sortKey === "tanggal") {
      const timeA = valA ? new Date(valA).getTime() : 0
      const timeB = valB ? new Date(valB).getTime() : 0
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA
    }

    if (typeof valA === "string") {
      valA = valA.toLowerCase()
      valB = (valB as string || "").toLowerCase()
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1
    if (valA > valB) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1.5 size-3.5 text-muted-foreground/60" />
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1.5 size-3.5 text-primary" />
    ) : (
      <ArrowDown className="ml-1.5 size-3.5 text-primary" />
    )
  }

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

        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead onClick={() => handleSort("lomba_nama")} className="font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center">Lomba <SortIcon col="lomba_nama" /></span>
                </TableHead>
                <TableHead onClick={() => handleSort("tim")} className="font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center">Tim <SortIcon col="tim" /></span>
                </TableHead>
                <TableHead onClick={() => handleSort("babak")} className="font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center">Babak <SortIcon col="babak" /></span>
                </TableHead>
                <TableHead onClick={() => handleSort("tanggal")} className="font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center">Jadwal <SortIcon col="tanggal" /></span>
                </TableHead>
                <TableHead onClick={() => handleSort("lokasi")} className="font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center">Lokasi <SortIcon col="lokasi" /></span>
                </TableHead>
                <TableHead onClick={() => handleSort("skor")} className="font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center">Skor <SortIcon col="skor" /></span>
                </TableHead>
                <TableHead onClick={() => handleSort("status")} className="font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center">Status <SortIcon col="status" /></span>
                </TableHead>
                <TableHead className="w-24 font-semibold text-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
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
                sortedData.map((p) => (
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
                      ) : <span className="italic text-muted-foreground/50">—</span>}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        p.status === "selesai"
                          ? "bg-green-50 text-green-700 border border-green-200/50"
                          : p.status === "berlangsung"
                          ? "bg-red-50 text-red-700 border border-red-200/50 animate-pulse"
                          : "bg-zinc-50 text-zinc-500 border border-zinc-200/50"
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
        </div>
      </div>
    </DashLayout>
  )
}
