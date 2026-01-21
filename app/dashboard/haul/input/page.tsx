"use client"

// input/page.tsx
import AutoComplete from "@/components/auto-complete";
import DashLayout from "@/components/layout/dash-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAddressDistinct, getArwahsNameDistinct, getSendersNameDistinct, insertDataHaul } from "@/lib/supabase/queries-client";
import { haulFormSchema, HaulFormValues, arwahSchema } from "@/types/haul";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function InputArwah() {

    const [sendersName, setSendersName] = useState<string[]>([])
    const [arwahsName, setArwahsName] = useState<string[]>([])
    const [address, setAddress] = useState<string[]>([])
    const [arwahErrors, setArwahErrors] = useState<{ [key: number]: { greeting?: string, name?: string, address?: string } }>({});
    const [resetKey, setResetKey] = useState(0);

    const form = useForm<HaulFormValues>({
        resolver: zodResolver(haulFormSchema),
        defaultValues: {
            senderName: "",
            senderGreeting: "",
            senderAddress: "",
        },
    });

    useEffect(() => {
        async function fetchSenders() {
            const names = await getSendersNameDistinct()
            setSendersName(names)
        }
        fetchSenders()
        async function fetchArwahs() {
            const names = await getArwahsNameDistinct()
            setArwahsName(names)
        }
        fetchArwahs()
        async function fetchAddress() {
            const address = await getAddressDistinct()
            setAddress(address)
        }
        fetchAddress()
    }, [])


    const [senderData, setSenderData] = useState({
        greeting: '',
        name: '',
        address: ''
    });


    const [arwahList, setArwahList] = useState([{
        id: 1,
        greeting: '',
        name: '',
        address: ''
    }]);

    const addArwah = () => {
        setArwahList([...arwahList, {
            id: Date.now(),
            greeting: '',
            name: '',
            address: ''
        }]);
    };

    const removeArwah = (id: number) => {
        setArwahList(arwahList.filter(item => item.id !== id));
        const newErrors = { ...arwahErrors };
        delete newErrors[id];
        setArwahErrors(newErrors);
    };


    const updateArwah = (id: number, field: string, value: string) => {
        setArwahList(arwahList.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));

        if (arwahErrors[id]?.[field as 'greeting' | 'name' | 'address']) {
            const newErrors = { ...arwahErrors };
            delete newErrors[id][field as 'greeting' | 'name' | 'address'];
            if (Object.keys(newErrors[id]).length === 0) {
                delete newErrors[id];
            }
            setArwahErrors(newErrors);
        }
    };


    const updateSender = (field: string, value: string) => {
        setSenderData({ ...senderData, [field]: value });
    };


    const resetAllForm = () => {
        form.reset();
        setSenderData({ greeting: '', name: '', address: '' });
        // eslint-disable-next-line react-hooks/purity
        setArwahList([{ id: Date.now(), greeting: '', name: '', address: '' }]);
        setArwahErrors({});
        setResetKey(prev => prev + 1);
    };

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: HaulFormValues) => {
        try {
            if (arwahList.length === 0) {

                toast.error("Minimal harus ada satu data arwah", {
                    position: "top-center",
                });
                return;
            }

            setArwahErrors({});

            const errors: { [key: number]: { greeting?: string, name?: string, address?: string } } = {};
            let hasError = false;

            arwahList.forEach((arwah) => {
                const validation = arwahSchema.safeParse({
                    greeting: arwah.greeting,
                    name: arwah.name,
                    address: arwah.address
                });

                if (!validation.success) {
                    hasError = true;
                    errors[arwah.id] = {};
                    validation.error.issues.forEach(issue => {
                        const field = issue.path[0] as 'greeting' | 'name' | 'address';
                        errors[arwah.id][field] = issue.message;
                    });
                }
            });

            if (hasError) {
                setArwahErrors(errors);

                toast.error("Pastikan semua data arwah terisi dengan lengkap", {
                    position: "top-center",
                });
                return;
            }

            const cap = (str: string) =>
                str.replace(/\b(\w)/g, (m) => m.toUpperCase());

            const formatted = {
                name: cap(`${data.senderGreeting} ${data.senderName}`.trim()),
                address: cap(data.senderAddress ?? ""),
                arwahs: arwahList.map((arwah) => ({
                    arwah_name: cap(`${arwah.greeting} ${arwah.name}`.trim()),
                    arwah_address: cap(arwah.address ?? ""),
                })),
            };



            toast.promise(
                insertDataHaul(formatted),
                {
                    loading: 'Menyimpan data haul...',
                    success: () => {


                        resetAllForm();

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
    };

    return <DashLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full px-2 md:px-0">
            <Card className="w-full min-h-[90vh] mb-4 py-0">
                <CardContent className="p-3 md:p-6">
                    <form onSubmit={form.handleSubmit(onSubmit)} key={resetKey}>
                        <FieldGroup className="gap-4 md:gap-6">
                            <div className="w-full md:max-w-xl">
                                <FieldSet>
                                    <FieldLegend className="text-base md:text-lg">Input Data Haul</FieldLegend>
                                    <FieldDescription className="text-xs md:text-sm">
                                        Pastikan data haul benar sebelum melakukan submit data.
                                    </FieldDescription>
                                    <FieldGroup className="gap-0 md:gap-6">
                                        <Field>
                                            <FieldLabel htmlFor="sender-name" className="text-sm md:text-base">
                                                Nama Pengirim <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Select
                                                    value={senderData.greeting || undefined}
                                                    onValueChange={(value) => {
                                                        updateSender("greeting", value);
                                                        form.setValue("senderGreeting", value, { shouldValidate: true });
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
                                                <p className="text-xs text-red-500 ms-2">
                                                    {form.formState.errors.senderGreeting?.message}
                                                </p>
                                                <div className="flex-1 w-full">
                                                    <AutoComplete
                                                        data={sendersName}
                                                        placeholder="Masukkan Nama Pengirim..."
                                                        onValueChange={(value) => {
                                                            form.setValue("senderName", value, { shouldValidate: true });
                                                            updateSender("name", value);
                                                        }}
                                                    />
                                                    <p className="text-xs text-red-500 ms-2">
                                                        {form.formState.errors.senderName?.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </Field>
                                        <Field >
                                            <FieldLabel htmlFor="sender-address" className="text-sm md:text-base">
                                                Alamat Pengirim <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <div className="flex flex-col gap-0">
                                                <AutoComplete
                                                    data={address}
                                                    placeholder="Alamat Pengirim..."
                                                    onValueChange={(value) => {
                                                        form.setValue("senderAddress", value, { shouldValidate: true });
                                                        updateSender('address', value)
                                                    }}
                                                />
                                                <p className="text-xs text-red-500 ms-2">
                                                    {form.formState.errors.senderAddress?.message}
                                                </p>
                                            </div>
                                        </Field>
                                    </FieldGroup>
                                </FieldSet>
                            </div>
                            <FieldSeparator />
                            <FieldSet>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <FieldLegend className="text-base md:text-lg font-semibold">
                                        Data Arwah
                                    </FieldLegend>
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
                                            className="relative border-2 rounded-lg p-3 md:p-5 my-4"
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
                            <div className="flex justify-end gap-3 p-2">
                                <Button
                                    type="submit"
                                    className="gap-2 w-full sm:w-auto"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Simpan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <Card className="w-full min-h-[90vh] mb-4 py-0 hidden md:block" >
                <CardContent className="p-3 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold mb-4">Preview Data Haul</h2>

                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead>Nama Pengirim</TableHead>
                                    <TableHead>Alamat</TableHead>
                                    <TableHead>Nama Arwah</TableHead>
                                    <TableHead>Makam</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {arwahList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            Belum ada data arwah
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    arwahList.map((arwah, index) => (
                                        <TableRow
                                            key={arwah.id}
                                            className={index === 0 ? "" : ""}
                                        >
                                            <TableCell className="font-medium">
                                                {index === 0 ? "1." : ""}
                                            </TableCell>

                                            <TableCell className="capitalize">
                                                {index === 0 ? (
                                                    <>
                                                        {senderData.greeting && `${senderData.greeting} `}
                                                        {senderData.name || '-'}
                                                    </>
                                                ) : ""}
                                            </TableCell>

                                            <TableCell className="capitalize">
                                                {index === 0 ? (senderData.address || '-') : ""}
                                            </TableCell>

                                            <TableCell className="capitalize">
                                                {index + 1}. {arwah.greeting && `${arwah.greeting} `}
                                                {arwah.name || '-'}
                                            </TableCell>

                                            <TableCell className="capitalize">
                                                {arwah.address || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                        <p>Total Arwah: <span className="font-semibold text-foreground">{arwahList.length}</span></p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </DashLayout>
}