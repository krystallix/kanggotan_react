"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleYearChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('year', value);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (!mounted) {
        return <div className="w-25 h-9 rounded-md border border-input bg-transparent" />;
    }

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
