"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function HaulTableSkeleton() {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        )
    }


    return (
        <div className="rounded-md border overflow-auto max-h-205">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Pengirim</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Nama Arwah</TableHead>
                        <TableHead>Makam</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    <TableRow className="bg-input/20">
                        <TableCell>
                            <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-24" />
                        </TableCell>
                    </TableRow>


                    {Array.from({ length: 30 }).map((_, idx) => (
                        <TableRow key={idx} className="bg-input/20">
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-24" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}