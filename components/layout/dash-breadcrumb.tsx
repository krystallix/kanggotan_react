'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { memo } from "react"

function DashBreadcrumb() {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter((segment) => segment)

    const formatLabel = (segment: string) => {
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                    const href = '/' + pathSegments.slice(0, index + 1).join('/')
                    const isLast = index === pathSegments.length - 1
                    const isFirst = index === 0

                    return (
                        <div key={href} className="flex items-center gap-2 text-lg">
                            {!isFirst && <BreadcrumbSeparator className="hidden md:block" />}
                            <BreadcrumbItem className={isFirst ? "hidden md:block" : ""}>
                                {isLast ? (
                                    <BreadcrumbPage>{formatLabel(segment)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild className="hidden md:block">
                                        <Link href={href}>{formatLabel(segment)}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </div>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default memo(DashBreadcrumb)