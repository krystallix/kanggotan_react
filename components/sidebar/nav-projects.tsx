"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type LucideIcon } from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavProjects({
    projects,
}: {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden px-3 py-2">
            <SidebarGroupLabel className="px-3 text-[10px] font-black uppercase tracking-[0.18em] text-black/35">Generate</SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname === item.url}
                            className="h-10 rounded-2xl px-3 font-semibold text-black/55 transition-all duration-200 hover:bg-black/5 hover:text-black data-active:bg-black data-active:text-white"
                        >
                            <Link href={item.url}>
                                <item.icon className="size-4" />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
