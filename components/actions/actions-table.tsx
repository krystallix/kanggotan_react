"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HaulType } from "@/types/haul"
import { Button } from "@/components/ui/button"
import { CirclePlus, FilePen, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import DialogEditSender from "../dialog/edit-sender"
import DialogEditArwah from "../dialog/edit-arwah"
import DialogDelete from "../dialog/delete"
import DialogAddArwah from "../dialog/add-arwah"



export default function ActionsTable({ data }: { data: HaulType }) {
    const [isEditPengirimOpen, setIsEditPengirimOpen] = useState(false)
    const [isEditArwahOpen, setIsEditArwahOpen] = useState(false)
    const [isAddArwahOpen, setIsAddArwahOpen] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean
        variant: 'pengirim' | 'arwah'
    }>({
        open: false,
        variant: 'pengirim'
    })

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setIsEditPengirimOpen(true)}>
                        <FilePen className="mr-2 h-4 w-4" />
                        Edit Pengirim
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditArwahOpen(true)}>
                        <FilePen className="mr-2 h-4 w-4" />
                        Edit Arwah
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsAddArwahOpen(true)}>
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Tambah Arwah
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialog({ open: true, variant: 'pengirim' })}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Pengirim
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialog({ open: true, variant: 'arwah' })}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Arwah
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogEditSender
                open={isEditPengirimOpen}
                onClose={() => setIsEditPengirimOpen(false)}
                haul={data}
            />
            <DialogEditArwah
                open={isEditArwahOpen}
                onClose={() => setIsEditArwahOpen(false)}
                haul={data}
            />
            <DialogDelete
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, variant: 'pengirim' })}
                haul={data}
                variant={deleteDialog.variant}
            />
            <DialogAddArwah
                open={isAddArwahOpen}
                onClose={() => setIsAddArwahOpen(false)}
                haul={data}
            />
        </>
    )
}