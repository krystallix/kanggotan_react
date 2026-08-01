"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="px-3 text-[10px] font-black uppercase tracking-[0.18em] text-black/35">Menu utama</SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const active = pathname === item.url || item.items?.some((subItem) => pathname === subItem.url)
                    return (
                        <Collapsible key={item.title} asChild defaultOpen={active || item.isActive}>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={active}
                                    className="h-10 rounded-xl px-3 text-sm font-semibold text-black/60 transition-all duration-200 hover:bg-black/5 hover:text-black data-active:bg-[oklch(0.457_0.24_277.023)/0.08] data-active:text-[oklch(0.457_0.24_277.023)]"
                                >
                                    <Link href={item.url}>
                                        <item.icon className="size-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuAction className="right-2 top-2.5 rounded-full text-black/35 transition-all hover:bg-black/5 hover:text-black data-[state=open]:rotate-90">
                                                <ChevronRight className="size-4" />
                                                <span className="sr-only">Toggle</span>
                                            </SidebarMenuAction>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub className="mx-3 my-2 border-l border-black/10 pl-3">
                                                {item.items.map((subItem) => {
                                                    const subActive = pathname === subItem.url
                                                    return (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={subActive}
                                                                className="h-8 rounded-lg px-3 text-xs font-semibold text-black/45 hover:bg-black/5 hover:text-black data-active:bg-black/5 data-active:text-black"
                                                            >
                                                                <Link href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </>
                                ) : null}
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
