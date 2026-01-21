import { HaulType } from "@/types/haul"
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
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import { toast } from "sonner";
import { updateSender } from "@/lib/supabase/queries-client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface EditPengirimDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
    haul: HaulType
}

const GREETING_NORMALIZATION_MAP: Record<string, string> = {
    'bp': 'Bp.',
    'bpk': 'Bp.',
    'bapak': 'Bp.',
    'ibu': 'Ibu',
    'sdr': 'Sdr.',
    'sdri': 'Sdr.',
    'saudara': 'Sdr.',
    'saudari': 'Sdr.',
    'adik': 'Adik',
    'adk': 'Adik',
    'adek': 'Adik',
}

const senderFormSchema = z.object({
    greeting: z.string().min(1, { message: "Sapaan harus dipilih" }),
    name: z.string()
        .min(2, { message: "Nama harus minimal 2 karakter" }),
    address: z.string()
        .min(1, { message: "Alamat harus diisi" })
})

type SenderFormValues = z.infer<typeof senderFormSchema>

function getGreeting(name: string): 'Bp.' | 'Ibu' | 'Sdr.' | 'Adik' | '' {
    if (!name) {
        return ''
    }
    const variations = Object.keys(GREETING_NORMALIZATION_MAP).join('|')
    const regex = new RegExp(`^(${variations})\\.?\\s*`, 'i')
    const match = name.match(regex)
    if (match) {
        const foundGreeting = match[1].toLowerCase()
        const normalized = GREETING_NORMALIZATION_MAP[foundGreeting] as 'Bp.' | 'Ibu' | 'Sdr.' | 'Adik'
        return normalized
    }
    return ''
}

function getNameWithoutGreeting(name: string): string {
    if (!name) {
        return ''
    }
    const variations = Object.keys(GREETING_NORMALIZATION_MAP).join('|')
    const regex = new RegExp(`^(${variations})\\.?\\s*`, 'i')
    const result = name.replace(regex, '').trim()
    return result
}

export default function DialogEditSender({
    open,
    onClose,
    onSuccess,
    haul
}: EditPengirimDialogProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const form = useForm<SenderFormValues>({
        resolver: zodResolver(senderFormSchema),
        defaultValues: {
            greeting: "",
            name: "",
            address: ""
        }
    })

    useEffect(() => {
        if (open) {
            const extractedGreeting = getGreeting(haul.name || "")
            const extractedName = getNameWithoutGreeting(haul.name || "")
            form.reset({
                greeting: extractedGreeting,
                name: extractedName,
                address: haul.address || ""
            })
        }
    }, [open, haul, form])


    const handleSubmit = async (data: SenderFormValues) => {
        try {
            const fullName = `${data.greeting} ${data.name}`

            const form = {
                id: haul.id,
                name: fullName,
                address: data.address
            }

            toast.promise(
                updateSender(form),
                {
                    loading: 'Menyimpan data haul...',
                    success: () => {
                        onSuccess?.()

                        const params = new URLSearchParams(searchParams.toString())
                        params.set("search", fullName)
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false })

                        onClose()
                        return `Data berhasil disimpan!`;
                    },
                    error: (error: Error) => {

                        return error?.message || 'Terjadi kesalahan saat menyimpan data';
                    },
                }
            );
        } catch {
            toast.error("Gagal, silahkan coba lagi", {
                position: "top-center",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-100 md:max-w-140">
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Pengirim</DialogTitle>
                        <DialogDescription>
                            Klik simpan jika sudah selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="w-full md:max-w-xl">
                            <FieldSet>
                                <FieldGroup className="gap-0 md:gap-6">
                                    <Field>
                                        <FieldLabel htmlFor="sender-name" className="text-sm md:text-base">
                                            Nama Pengirim <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <div className="flex flex-col">
                                                <Select
                                                    value={form.watch("greeting")}
                                                    onValueChange={(value) => {
                                                        form.setValue("greeting", value, { shouldValidate: true })
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full sm:w-28">
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
                                                {form.formState.errors.greeting && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        {form.formState.errors.greeting.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex-1 w-full">
                                                <Input
                                                    id="sender-name"
                                                    {...form.register("name")}
                                                    placeholder="Masukkan Nama Pengirim..."
                                                />
                                                {form.formState.errors.name && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        {form.formState.errors.name.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="sender-address" className="text-sm mt-4 md:mt-0 md:text-base">
                                            Alamat Pengirim <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <div className="flex flex-col gap-0">
                                            <Input
                                                id="sender-address"
                                                {...form.register("address")}
                                                placeholder="Alamat Pengirim..."
                                            />
                                            {form.formState.errors.address && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {form.formState.errors.address.message}
                                                </p>
                                            )}
                                        </div>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save />
                            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}