"use client"

import { useEffect, useState } from "react"
import DashLayout from "@/components/layout/dash-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, GripVertical, Tags, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { getKategoriAllClient, insertKategori, updateKategori, deleteKategori } from "@/lib/supabase/queries-client"
import type { KegiatanKategori } from "@/types/kegiatan"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

type SortKey = "sort_order" | "name" | "description" | "icon"
type SortOrder = "asc" | "desc"

export default function KategoriPage() {
  const [kategoriList, setKategoriList] = useState<KegiatanKategori[]>([])
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<KegiatanKategori | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("CalendarDays")
  const [sortOrderField, setSortOrderField] = useState(0)
  const [sortKey, setSortKey] = useState<SortKey>("sort_order")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const fetchData = async () => {
    const data = await getKategoriAllClient()
    setKategoriList(data)
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

  const sortedData = [...kategoriList].sort((a, b) => {
    const clean = (v: unknown) => (v == null ? "" : String(v).toLowerCase())
    const valA = clean(a[sortKey])
    const valB = clean(b[sortKey])

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

  const openAdd = () => {
    setEditItem(null)
    setName("")
    setDescription("")
    setIcon("CalendarDays")
    setSortOrderField(kategoriList.length)
    setOpen(true)
  }

  const openEdit = (item: KegiatanKategori) => {
    setEditItem(item)
    setName(item.name)
    setDescription(item.description || "")
    setIcon(item.icon)
    setSortOrderField(item.sort_order)
    setOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Nama kategori wajib diisi"); return }
    try {
      if (editItem) {
        await updateKategori(editItem.id, { name, description, icon, sort_order: sortOrderField, is_active: true })
        toast.success("Kategori berhasil diupdate")
      } else {
        await insertKategori({ name, description, icon, sort_order: sortOrderField, is_active: true })
        toast.success("Kategori berhasil ditambahkan")
      }
      setOpen(false)
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan kategori")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteKategori(id)
      toast.success("Kategori berhasil dihapus")
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus kategori")
    }
  }

  return (
    <DashLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kategori</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {kategoriList.length > 0 ? `${kategoriList.length} kategori kegiatan` : "Kelola kategori kegiatan"}
            </p>
          </div>
          <Button onClick={openAdd}><Plus className="size-4 mr-2" />Tambah Kategori</Button>
        </div>

        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead onClick={() => handleSort("sort_order")} className="w-12 font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center"># <SortIcon col="sort_order" /></span>
                </TableHead>
                <TableHead onClick={() => handleSort("name")} className="font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center">Nama <SortIcon col="name" /></span>
                </TableHead>
                <TableHead onClick={() => handleSort("description")} className="font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center">Deskripsi <SortIcon col="description" /></span>
                </TableHead>
                <TableHead onClick={() => handleSort("icon")} className="font-semibold text-foreground cursor-pointer select-none">
                  <span className="inline-flex items-center">Icon <SortIcon col="icon" /></span>
                </TableHead>
                <TableHead className="w-24 font-semibold text-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Tags className="size-10 text-muted-foreground/40 mb-3" />
                      <p className="text-base font-medium text-muted-foreground">Belum ada kategori</p>
                      <p className="text-sm text-muted-foreground/60 mt-1 mb-4">Buat kategori kegiatan pertama</p>
                      <Button variant="outline" size="sm" onClick={openAdd}>
                        <Plus className="size-4 mr-1.5" />Tambah Kategori
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((k) => (
                  <TableRow key={k.id} className="group">
                    <TableCell className="text-muted-foreground">
                      <GripVertical className="size-4" />
                    </TableCell>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {k.description || <span className="italic text-muted-foreground/50">—</span>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">{k.icon}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(k)} className="hover:bg-accent">
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(k.id)} className="hover:bg-red-50 hover:text-red-600">
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
            </DialogHeader>
            <FieldGroup className="gap-4 py-2">
              <Field>
                <FieldLabel>Nama Kategori</FieldLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Semarak Kemerdekaan" />
              </Field>
              <Field>
                <FieldLabel>Deskripsi</FieldLabel>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi kategori" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Icon (Lucide)</FieldLabel>
                  <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. Flag, Heart" />
                </Field>
                <Field>
                  <FieldLabel>Urutan</FieldLabel>
                  <Input type="number" value={sortOrderField} onChange={(e) => setSortOrderField(Number(e.target.value))} />
                </Field>
              </div>
            </FieldGroup>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button onClick={handleSave}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashLayout>
  )
}
