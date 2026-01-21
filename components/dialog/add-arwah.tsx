"use client"
import { useState, useEffect } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Plus, Save, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import AutoComplete from "@/components/auto-complete"
import { getArwahsNameDistinct, getAddressDistinct, insertArwahs } from "@/lib/supabase/queries-client"
import { arwahSchema } from "@/types/haul"
import { toast } from "sonner"
import { HaulType } from "@/types/haul"
import { Input } from "../ui/input"
import { useRouter, usePathname, useSearchParams } from "next/navigation"



interface AddArwahDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
    haul: HaulType
}

export default function DialogAddArwah({
    open,
    onClose,
    onSuccess,
    haul
}: AddArwahDialogProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [arwahsName, setArwahsName] = useState<string[]>([])
    const [address, setAddress] = useState<string[]>([])
    const [arwahList, setArwahList] = useState([{
        id: Date.now(),
        greeting: '',
        name: '',
        address: ''
    }])
    const [arwahErrors, setArwahErrors] = useState<{
        [key: number]: {
            greeting?: string
            name?: string
            address?: string
        }
    }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)


    useEffect(() => {
        if (open) {
            async function fetchArwahs() {
                const names = await getArwahsNameDistinct()
                setArwahsName(names)
            }
            fetchArwahs()

            async function fetchAddress() {
                const addresses = await getAddressDistinct()
                setAddress(addresses)
            }
            fetchAddress()
        }
    }, [open])

    const addArwah = () => {
        setArwahList([...arwahList, {
            id: Date.now(),
            greeting: '',
            name: '',
            address: ''
        }])
    }

    const removeArwah = (id: number) => {
        setArwahList(arwahList.filter(item => item.id !== id))
        const newErrors = { ...arwahErrors }
        delete newErrors[id]
        setArwahErrors(newErrors)
    }

    const updateArwah = (id: number, field: string, value: string) => {
        setArwahList(arwahList.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ))

        if (arwahErrors[id]?.[field as 'greeting' | 'name' | 'address']) {
            const newErrors = { ...arwahErrors }
            delete newErrors[id][field as 'greeting' | 'name' | 'address']
            if (Object.keys(newErrors[id]).length === 0) {
                delete newErrors[id]
            }
            setArwahErrors(newErrors)
        }
    }

    const handleSubmit = async () => {
        try {
            if (arwahList.length === 0) {
                toast.error("Minimal harus ada satu data arwah", {
                    position: "top-center",
                })
                return
            }

            setArwahErrors({})
            const errors: {
                [key: number]: {
                    greeting?: string
                    name?: string
                    address?: string
                }
            } = {}
            let hasError = false

            arwahList.forEach((arwah) => {
                const validation = arwahSchema.safeParse({
                    greeting: arwah.greeting,
                    name: arwah.name,
                    address: arwah.address
                })

                if (!validation.success) {
                    hasError = true
                    errors[arwah.id] = {}
                    validation.error.issues.forEach(issue => {
                        const field = issue.path[0] as 'greeting' | 'name' | 'address'
                        errors[arwah.id][field] = issue.message
                    })
                }
            })

            if (hasError) {
                setArwahErrors(errors)
                toast.error("Pastikan semua data arwah terisi dengan lengkap", {
                    position: "top-center",
                })
                return
            }

            setIsSubmitting(true)

            const cap = (str: string) => str.replace(/\b(\w)/g, (m) => m.toUpperCase())

            const formatted = arwahList.map((arwah) => ({
                sender_id: haul.id,
                arwah_name: cap(`${arwah.greeting} ${arwah.name}`.trim()),
                arwah_address: cap(arwah.address),
            }))

            toast.promise(
                insertArwahs(formatted),
                {
                    loading: 'Menyimpan data arwah...',
                    success: (result) => {
                        onSuccess?.()
                        const params = new URLSearchParams(searchParams.toString())
                        if (result.data && result.data.length > 0) {

                            params.set("search", result.data[0].id.toString())
                        }
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                        onClose()
                        return "Data arwah berhasil ditambahkan!"
                    },
                    error: "Gagal menyimpan data arwah"
                }
            )
        } catch {
            toast.error("Gagal menyimpan data arwah", {
                position: "top-center",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setArwahList([{ id: Date.now(), greeting: '', name: '', address: '' }])
        setArwahErrors({})
        // setResetKey(prev => prev + 1)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-100 md:max-w-170 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="capitalize">Tambah Arwah</DialogTitle>
                    <DialogDescription>
                        Tambahkan data arwah untuk <strong>{haul.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <FieldSet>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">

                        <div className="flex gap-2 sm:w-auto">
                            <Input type="number" min="1" defaultValue={1} />
                            <Button
                                type="button"
                                onClick={addArwah}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah
                            </Button>
                        </div>
                    </div>

                    <div>
                        {arwahList.map((arwah, index) => (
                            <div
                                key={arwah.id}
                                className="relative border-2 rounded-lg p-3 md:p-5 mb-4 mt-0"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                    <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 space-y-3 md:space-y-4 w-full">
                                        <Field>
                                            <FieldLabel htmlFor={`arwah-name-${index}`} className="text-sm md:text-base font-medium">
                                                Nama Arwah <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <div className="flex flex-col w-full sm:w-24">
                                                    <Select
                                                        value={arwah.greeting || undefined}
                                                        onValueChange={(value) => {
                                                            updateArwah(arwah.id, 'greeting', value)
                                                        }}
                                                    >
                                                        <SelectTrigger className={arwahErrors[arwah.id]?.greeting ? "border-red-500" : ""}>
                                                            <SelectValue placeholder="Sapaan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Sapaan</SelectLabel>
                                                                <SelectItem value="Bp.">Bp.</SelectItem>
                                                                <SelectItem value="Ibu">Ibu</SelectItem>
                                                                <SelectItem value="Sdr.">Sdr.</SelectItem>
                                                                <SelectItem value="Adik">Adik</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    {arwahErrors[arwah.id]?.greeting && (
                                                        <p className="text-xs text-red-500 mt-1">
                                                            {arwahErrors[arwah.id].greeting}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex-1 w-full">
                                                    <AutoComplete
                                                        data={arwahsName}
                                                        placeholder="Nama Arwah..."
                                                        onValueChange={(value: string) => {
                                                            updateArwah(arwah.id, 'name', value)
                                                        }}
                                                    />
                                                    {arwahErrors[arwah.id]?.name && (
                                                        <p className="text-xs text-red-500 mt-1">
                                                            {arwahErrors[arwah.id].name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor={`arwah-address-${index}`} className="text-sm md:text-base font-medium">
                                                Alamat Makam <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <div className="flex flex-col gap-0">
                                                <AutoComplete
                                                    data={address}
                                                    placeholder="Masukkan lokasi makam"
                                                    onValueChange={(value) => {
                                                        updateArwah(arwah.id, 'address', value)
                                                    }}
                                                />
                                                {arwahErrors[arwah.id]?.address && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        {arwahErrors[arwah.id].address}
                                                    </p>
                                                )}
                                            </div>
                                        </Field>
                                    </div>

                                    {arwahList.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeArwah(arwah.id)}
                                            className="hover:bg-red-200 bg-red-50 cursor-pointer text-red-600 hover:text-red-600 shrink-0 self-start"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </FieldSet>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isSubmitting}>
                            Batal
                        </Button>
                    </DialogClose>
                    <Button
                        variant="default"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>Menyimpan...</>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Simpan
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}