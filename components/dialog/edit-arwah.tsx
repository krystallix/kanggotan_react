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
import { toast } from "sonner"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { updateArwah } from "@/lib/supabase/queries-client"

interface EditArwahDialogProps {
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

const arwahFormSchema = z.object({
    greeting: z.string().min(1, { message: "Sapaan harus dipilih" }),
    arwahName: z.string()
        .min(2, { message: "Nama harus minimal 2 karakter" }),
    arwahAddress: z.string()
        .min(1, { message: "Alamat Makam harus diisi" })
})

type ArwahFormValues = z.infer<typeof arwahFormSchema>

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

export default function DialogEditArwah({
    open,
    onClose,
    onSuccess,
    haul
}: EditArwahDialogProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const form = useForm<ArwahFormValues>({
        resolver: zodResolver(arwahFormSchema),
        defaultValues: {
            greeting: "",
            arwahName: "",
            arwahAddress: ""
        }
    })

    useEffect(() => {
        if (open) {
            const extractedGreeting = getGreeting(haul.arwahName || "")
            const extractedName = getNameWithoutGreeting(haul.arwahName || "")
            form.reset({
                greeting: extractedGreeting,
                arwahName: extractedName,
                arwahAddress: haul.arwahAddress || ""
            })
        }
    }, [open, haul, form])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSubmit = async (data: ArwahFormValues) => {

        const fullName = `${data.greeting} ${data.arwahName}`

        const form = {
            id: haul.arwahId,
            name: fullName,
            address: data.arwahAddress,
        }
        try {
            toast.promise(
                updateArwah(form),
                {
                    loading: 'Menyimpan data haul...',
                    success: () => {
                        onSuccess?.()
                        onClose()

                        const params = new URLSearchParams(searchParams.toString())
                        params.set("search", haul.arwahId.toString())
                        router.replace(`${pathname}?${params.toString()}`, { scroll: false })

                        return `Data berhasil disimpan!`;
                    },
                    error: (error: Error) => {

                        return error?.message || 'Terjadi kesalahan saat menyimpan data';
                    },
                }
            );
        } catch (error) {
            console.error("Error updating arwah:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-100 md:max-w-140">
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit Arwah</DialogTitle>
                        <DialogDescription>
                            Klik simpan jika sudah selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="w-full md:max-w-xl">
                            <FieldSet>
                                <FieldGroup className="gap-0 md:gap-6">
                                    <Field>
                                        <FieldLabel htmlFor="arwah-name" className="text-sm md:text-base">
                                            Nama Arwah <span className="text-red-500">*</span>
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
                                                    id="arwah-name"
                                                    {...form.register("arwahName")}
                                                    placeholder="Masukkan Nama Arwah..."
                                                />
                                                {form.formState.errors.arwahName && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        {form.formState.errors.arwahName.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="arwah-address" className="text-sm mt-4 md:mt-0 md:text-base">
                                            Alamat Makam <span className="text-red-500">*</span>
                                        </FieldLabel>
                                        <div className="flex flex-col gap-0">
                                            <Input
                                                id="arwah-address"
                                                {...form.register("arwahAddress")}
                                                placeholder="Alamat Makam..."
                                            />
                                            {form.formState.errors.arwahAddress && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {form.formState.errors.arwahAddress.message}
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