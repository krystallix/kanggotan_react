"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type YearSelectProps = {
    years: number[];
    selectedYear: number;
}

export default function YearSelect({ years, selectedYear }: YearSelectProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleYearChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('year', value);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-25">
                <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Tahun</SelectLabel>
                    {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
