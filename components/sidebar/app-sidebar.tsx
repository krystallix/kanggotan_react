"use client"

import * as React from "react"
import {
    Newspaper,
    Grid2X2,
    DatabaseZap,
    Ghost,
    Activity,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Grid2X2,
        },
        {
            title: "Data",
            url: "/dashboard/data",
            icon: DatabaseZap,
            items: [
                {
                    title: "RISMA",
                    url: "/dashboard/data/risma",
                },
                {
                    title: "PLN",
                    url: "/dashboard/data/pln",
                },
                {
                    title: "Keuangan",
                    url: "/dashboard/data/keuangan",
                },
            ],
        },
        {
            title: "Haul",
            url: "/dashboard/haul/data",
            icon: Ghost,
            items: [
                {
                    title: "Input Arwah",
                    url: "/dashboard/haul/input",
                },
                {
                    title: "Arsip Data",
                    url: "/dashboard/haul/data",
                },
            ],
        },
        {
            title: "Artikel",
            url: "/dashboard/artikel",
            icon: Newspaper,
        },
        {
            title: "Kegiatan",
            url: "/dashboard/kegiatan",
            icon: Activity,
            isActive: true,
            items: [
                {
                    title: "Input Kegiatan",
                    url: "/dashboard/kegiatan/input",
                },
                {
                    title: "Kategori",
                    url: "/dashboard/kegiatan/kategori",
                },
                {
                    title: "Lomba",
                    url: "/dashboard/kegiatan/lomba",
                },
                {
                    title: "Pertandingan",
                    url: "/dashboard/kegiatan/pertandingan",
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="sidebar" className="border-r border-black/8 bg-white" {...props}>
            <SidebarHeader className="p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="h-14 rounded-2xl bg-white px-3 shadow-none border border-black/8 hover:bg-white">
                            <Link href="/">
                                <div className="flex aspect-square size-9 items-center justify-center overflow-hidden rounded-xl bg-[oklch(0.457_0.24_277.023)] shadow-sm shadow-black/10">
                                    <Image src="/logo-risma.png" alt="RISMA" width={28} height={28} className="object-contain" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold tracking-tight">RISMA</span>
                                    <span className="truncate text-xs text-muted-foreground">Kanggotan Lor</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="px-0">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="p-3">
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
