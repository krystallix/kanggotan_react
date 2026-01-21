"use client"

import * as React from "react"
import {
    Newspaper,
    Command,
    LifeBuoy,
    Send,
    File,
    Grid2X2,
    DatabaseZap,
    Ghost,
    Activity,
    Triangle,
    Zap,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
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
            url: "/dashboard/data",  // Tambahkan /dashboard
            icon: DatabaseZap,
            isActive: true,
            items: [
                {
                    title: "RISMA",
                    url: "/dashboard/data/risma",  // Sekarang /dashboard/data/risma
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
            url: "/dashboard/haul",  // Tambahkan /dashboard
            icon: Ghost,
            isActive: true,
            items: [
                {
                    title: "Input Arwah",
                    url: "/dashboard/haul/input",  // Sekarang /dashboard/haul/input
                },
                {
                    title: "Arsip Data",
                    url: "/dashboard/haul/data",
                },
                {
                    title: "Log",
                    url: "/dashboard/haul/log",
                },
            ],
        },
        {
            title: "Artikel",
            url: "/dashboard/artikel",  // Tambahkan /dashboard
            icon: Newspaper,
        },
        {
            title: "Kegiatan",
            url: "/dashboard/kegiatan",  // Tambahkan /dashboard
            icon: Activity,
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Undangan",
            url: "#",
            icon: File,
        },
        {
            name: "Lelayu",
            url: "#",
            icon: Triangle,
        },
        {
            name: "Tagihan Listrik",
            url: "#",
            icon: Zap,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="bg-zinc-800 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">RISMA</span>
                                    <span className="truncate text-xs">Kanggotan Lor</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
