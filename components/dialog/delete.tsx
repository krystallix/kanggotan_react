"use client"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DeleteArwahResult, DeleteSenderResult, HaulType } from "@/types/haul"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteSender, deleteArwah } from "@/lib/supabase/queries-client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface DeleteDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
    variant?: 'pengirim' | 'arwah'
    haul: HaulType
}

export default function DialogDelete({
    open,
    onClose,
    onSuccess,
    variant,
    haul
}: DeleteDialogProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleDelete = async () => {
        const promise = variant === 'pengirim'
            ? deleteSender(haul.id)
            : deleteArwah(haul.arwahId, haul.id);

        toast.promise(promise, {
            loading: 'Menghapus data...',
            success: (result: DeleteSenderResult | DeleteArwahResult) => {
                onSuccess?.()
                onClose()

                const params = new URLSearchParams(searchParams.toString())

                // Type guard - cek apakah result punya property nextArwah
                if ('nextArwah' in result) {
                    // TypeScript sekarang tahu ini DeleteArwahResult
                    if (result.nextArwah) {
                        params.set("search", result.nextArwah.id.toString())
                    } else {
                        params.delete("search")
                    }
                } else {
                    // Ini DeleteSenderResult
                    params.delete("search")
                }

                router.replace(`${pathname}?${params.toString()}`, { scroll: false })

                return `Data ${variant} berhasil dihapus`
            },
            error: (error: Error) => {
                return error?.message || `Gagal menghapus data ${variant}`
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-100 md:max-w-140">
                <DialogHeader>
                    <DialogTitle className="capitalize">Hapus {variant}</DialogTitle>
                    <DialogDescription>
                        Aksi ini tidak dapat dibatalkan.
                    </DialogDescription>
                    {variant === 'pengirim' ? (
                        <p>Apakah anda yakin ingin menghapus data pengirim <b>{haul.name}</b>?</p>
                    ) : (
                        <p>Apakah anda yakin ingin menghapus data arwah <b>{haul.arwahName}</b> makam <b>{haul.arwahAddress}</b>?</p>
                    )}
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}