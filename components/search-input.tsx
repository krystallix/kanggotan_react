"use client";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";

type SearchInputProps = {
    totalResults?: number;
    placeholder?: string;
}

export default function SearchInput({ totalResults, placeholder = "Cari..." }: SearchInputProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [isPending, startTransition] = useTransition();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync dengan URL saat URL berubah dari luar (misal: navigasi browser)
    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        setSearch(urlSearch);
    }, [searchParams]);

    // Handle perubahan input dengan debounce
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const currentSearch = searchParams.get("search") || "";

        // Skip jika search sama dengan URL
        if (currentSearch === search) return;

        timeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (search) {
                params.set("search", search);
                params.set("page", "1");
            } else {
                params.delete("search");
            }

            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, {
                    scroll: false
                });
            });
        }, 1000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]); // Hanya trigger saat search berubah dari input user

    return (
        <InputGroup>
            <InputGroupInput
                className="text-xs md:text-sm"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
                <Search className={isPending ? "animate-pulse" : ""} />
            </InputGroupAddon>
            {totalResults !== undefined && (
                <InputGroupAddon className="hidden md:block" align="inline-end">
                    {totalResults} Hasil
                </InputGroupAddon>
            )}
        </InputGroup>
    );
}