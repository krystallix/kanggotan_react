"use client"

import { DataTable } from "@/components/ui/data-table";
import { HaulType } from "@/types/haul";
import { DataTableMobile } from "@/components/ui/data-table-mobile";
import { HaulColumns, HaulColumnsMobile, HaulColumnsDashboard, HaulColumnsMobileDashboard } from "./columns";
import { useIsMobile } from "@/hooks/use-mobile";

type HaulTableProps = {
    data: HaulType[]
    variant?: 'public' | 'dashboard'
}

export default function HaulTable({ data, variant = 'public' }: HaulTableProps) {
    const isMobile = useIsMobile()

    const desktopColumns = variant === 'dashboard' ? HaulColumnsDashboard : HaulColumns
    const mobileColumns = variant === 'dashboard' ? HaulColumnsMobileDashboard : HaulColumnsMobile

    if (isMobile) {
        return <DataTableMobile columns={mobileColumns} data={data} />
    }

    return <DataTable columns={desktopColumns} data={data} />
}
