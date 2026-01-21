"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type HaulPaginationProps = {
    currentPage: number
    totalPages: number
}

export function HaulPagination({ currentPage, totalPages }: HaulPaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const createPageURL = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", page.toString())
        return `${pathname}?${params.toString()}`
    }

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return
        router.push(createPageURL(page))
    }

    const pagesToShow = (() => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
        if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages]
        if (currentPage >= totalPages - 2)
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
    })()

    return (
        <Pagination>
            <PaginationContent>
                {currentPage === 1 ? null : (
                    <PaginationItem>
                        <PaginationPrevious
                            href={createPageURL(Math.max(1, currentPage - 1))}
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(currentPage - 1)
                            }}
                        />
                    </PaginationItem>)}

                {pagesToShow.map((page, index) =>
                    page === "..." ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href={createPageURL(page as number)}
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(page as number)
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}
                {currentPage != totalPages ? (
                    <PaginationItem>
                        <PaginationNext
                            href={createPageURL(Math.min(totalPages, currentPage + 1))}
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(currentPage + 1)
                            }}
                        />
                    </PaginationItem>) : null}
            </PaginationContent>
        </Pagination>
    )
}
