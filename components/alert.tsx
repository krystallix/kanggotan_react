"use client"

import { useState } from "react"
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert"
import { InfoIcon, X } from "lucide-react"

export function CloseableAlert() {
    const [open, setOpen] = useState(true)

    if (!open) return null

    return (
        <Alert className="bg-yellow-50 relative pr-10 text-yellow-600">
            <InfoIcon className="size-4 " />
            <AlertDescription className="flex flex-row gap-2 text-yellow-600">
                Apabila terdapat kesalahan penulisan, silakan klik tombol di samping nama pengirim atau arwah yang akan diubah.
            </AlertDescription>
            <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-2 top-2 rounded p-1 text-yellow-600 hover:bg-yellow-100"
                aria-label="Tutup"
            >
                <X className="h-4 w-4" />
            </button>
        </Alert>
    )
}
