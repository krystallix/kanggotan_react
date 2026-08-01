"use client"

import { useEffect, useState } from "react"
import DashLayout from "@/components/layout/dash-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, CalendarDays, Filter, X } from "lucide-react"
import Link from "next/link"
import { getKategoriAllClient, getAllKegiatanPaginatedClient, deleteKegiatan } from "@/lib/supabase/queries-client"
import type { KegiatanWithKategori } from "@/types/kegiatan"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export default function KegiatanDashboardPage() {
  const [data, setData] = useState<(KegiatanWithKategori & { kategori_name: string })[]>([])
  const [total, setTotal] = useState(0)
  const [kategoriList, setKategoriList] = useState<{ id: number; name: string }[]>([])
  const [filterYear, setFilterYear] = useState<number | undefined>(undefined)
  const [filterKategori, setFilterKategori] = useState<number | undefined>(undefined)

  const fetchData = async () => {
    const res = await getAllKegiatanPaginatedClient(1, 50, filterYear, filterKategori)
    setData(res.data as (KegiatanWithKategori & { kategori_name: string })[])
    setTotal(res.total)
  }

  useEffect(() => {
    getKategoriAllClient().then((list) => setKategoriList(list))
  }, [])

  useEffect(() => {
    fetchData()
  }, [filterYear, filterKategori])

  const handleDelete = async (id: number) => {
    try {
      await deleteKegiatan(id)
      toast.success("Kegiatan berhasil dihapus")
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus kegiatan")
    }
  }

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
  const hasFilter = filterYear !== undefined || filterKategori !== undefined

  return (
    <DashLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kegiatan</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {total > 0
                ? `${total} kegiatan${hasFilter ? " (difilter)" : ""}`
                : "Belum ada kegiatan"}
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/kegiatan/input"><Plus className="size-4 mr-2" />Tambah Kegiatan</Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <button
            onClick={() => { setFilterYear(undefined); setFilterKategori(undefined) }}
            className={`px-3.5 py-1.5 text-sm rounded-full border transition-all ${!hasFilter
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/30'
            }`}
          >
            Semua
          </button>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setFilterYear(filterYear === y ? undefined : y)}
              className={`px-3.5 py-1.5 text-sm rounded-full border transition-all ${filterYear === y
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/30'
              }`}
            >
              {y}
              {filterYear === y && <X className="inline size-3 ml-1.5" />}
            </button>
          ))}
          <span className="w-px h-5 bg-border" />
          {kategoriList.map((k) => (
            <button
              key={k.id}
              onClick={() => setFilterKategori(filterKategori === k.id ? undefined : k.id)}
              className={`px-3.5 py-1.5 text-sm rounded-full border transition-all ${filterKategori === k.id
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/30'
              }`}
            >
              {k.name}
              {filterKategori === k.id && <X className="inline size-3 ml-1.5" />}
            </button>
          ))}
        </div>

        {/* Table */}
        <Card className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-none">
          <CardContent className="p-0">
            {/* Mobile View */}
            <div className="divide-y divide-border sm:hidden">
              {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <CalendarDays className="size-10 text-muted-foreground/40 mb-3" />
                  <p className="text-base font-medium text-muted-foreground">Belum ada kegiatan</p>
                  <p className="text-sm text-muted-foreground/60 mt-1 mb-4">
                    {hasFilter ? "Coba ubah filter atau " : ""} Tambah kegiatan baru untuk memulai
                  </p>
                  {!hasFilter && (
                    <Button asChild variant="outline" size="sm">
                      <Link href="/dashboard/kegiatan/input"><Plus className="size-4 mr-1.5" />Tambah Kegiatan</Link>
                    </Button>
                  )}
                </div>
              ) : (
                data.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.kategori_name}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        item.is_published
                          ? 'bg-green-50 text-green-700 border border-green-200/50'
                          : 'bg-zinc-50 text-zinc-500 border border-zinc-200/50'
                      }`}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-1 border-t border-black/5 pt-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:bg-accent">
                          <Link href={`/dashboard/kegiatan/input?id=${item.id}`}>
                            <Pencil className="size-3.5" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-medium">Judul</TableHead>
                    <TableHead className="font-medium">Kategori</TableHead>
                    <TableHead className="font-medium">Tanggal</TableHead>
                    <TableHead className="font-medium">Tahun</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="w-24 font-medium">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <CalendarDays className="size-10 text-muted-foreground/40 mb-3" />
                          <p className="text-base font-medium text-muted-foreground">Belum ada kegiatan</p>
                          <p className="text-sm text-muted-foreground/60 mt-1 mb-4">
                            {hasFilter ? "Coba ubah filter atau " : ""} Tambah kegiatan baru untuk memulai
                          </p>
                          {!hasFilter && (
                            <Button asChild variant="outline" size="sm">
                              <Link href="/dashboard/kegiatan/input"><Plus className="size-4 mr-1.5" />Tambah Kegiatan</Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item) => (
                      <TableRow key={item.id} className="group">
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.kategori_name}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(item.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </TableCell>
                        <TableCell className="text-sm">{item.year}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            item.is_published
                              ? 'bg-green-50 text-green-700 border border-green-200/50'
                              : 'bg-zinc-50 text-zinc-500 border border-zinc-200/50'
                          }`}>
                            {item.is_published ? 'Published' : 'Draft'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" asChild className="hover:bg-accent">
                              <Link href={`/dashboard/kegiatan/input?id=${item.id}`}>
                                <Pencil className="size-3.5" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
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
          </CardContent>
        </Card>
      </div>
    </DashLayout>
  )
}
