"use client";

import SearchInput from "@/components/search-input";
import YearSelect from "@/components/year-select";

type HaulFiltersProps = {
    years: number[];
    selectedYear: number;
    totalResults?: number;
}

export default function HaulFilters({ years, selectedYear, totalResults }: HaulFiltersProps) {
    return (
        <div className="flex justify-between gap-2 items-center my-4">
            <div className="flex md:w-2/8 w-2/3">
                <SearchInput
                    totalResults={totalResults}
                    placeholder="Cari Nama Pengirim/Nama Arwah..."
                />
            </div>
            <div>
                <YearSelect years={years} selectedYear={selectedYear} />
            </div>
        </div>
    );
}