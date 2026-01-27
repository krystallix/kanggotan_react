"use client";

import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import YearSelect from "@/components/year-select";
import { FileDown } from "lucide-react";
import { useState } from "react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { exportHaulData } from "@/lib/supabase/actions";

type HaulFiltersProps = {
    years: number[];
    selectedYear: number;
    totalResults?: number;
    search?: string;
}

export default function HaulFilters({ years, selectedYear, totalResults, search = "" }: HaulFiltersProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        toast.promise(
            (async () => {
                try {
                    // Ambil data dari server action
                    const data = await exportHaulData(selectedYear, search);

                    if (!data || data.length === 0) {
                        throw new Error("Tidak ada data untuk di-export");
                    }

                    // Buat worksheet dari data
                    const worksheet = XLSX.utils.json_to_sheet(data);

                    // Set column widths
                    worksheet['!cols'] = [
                        { wch: 5 },  // No
                        { wch: 25 }, // Nama Pengirim
                        { wch: 30 }, // Alamat
                        { wch: 30 }, // Nama Arwah
                        { wch: 25 }, // Makam
                    ];

                    // Buat workbook baru
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, `Haul ${selectedYear}`);

                    // Download file
                    const filename = search
                        ? `Haul_Massal_${selectedYear}_filtered.xlsx`
                        : `Haul_Massal_${selectedYear}.xlsx`;

                    XLSX.writeFile(workbook, filename);

                    return { count: data.length, filename };
                } finally {
                    setIsExporting(false);
                }
            })(),
            {
                loading: 'Mengekspor data...',
                success: (result) => `Berhasil export ${result.count} data ke ${result.filename}`,
                error: (err) => err.message || 'Gagal export data',
            }
        );
    };

    return (
        <div className="flex justify-between gap-2 items-center my-4">
            <div className="flex md:w-2/8 w-2/3">
                <SearchInput
                    totalResults={totalResults}
                    placeholder="Cari Nama Pengirim/Nama Arwah..."
                />
            </div>
            <div className="flex gap-2">
                <Button className="hidden md:flex"
                    type="button"
                    onClick={handleExport}
                    disabled={isExporting}
                >
                    <FileDown className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Export"}
                </Button>
                <YearSelect years={years} selectedYear={selectedYear} />
            </div>
        </div>
    );
}
