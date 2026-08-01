"use client"

import {
    LogOut,
    UserRound,
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/supabase/queries-client'

export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    const { isMobile } = useSidebar()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await signOut()
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="h-14 rounded-2xl bg-white px-3 border border-black/8 shadow-none transition-all duration-200 hover:bg-white data-[state=open]:bg-white"
                        >
                            <Avatar className="h-9 w-9 rounded-2xl">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-2xl bg-[oklch(0.457_0.24_277.023)] text-xs font-black text-white">R</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-bold text-black">RISMA Admin</span>
                                <span className="truncate text-xs text-black/45">Dashboard</span>
                            </div>
                            <UserRound className="ml-auto size-4 text-black/35" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl p-2"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="p-2 font-normal">
                            <div className="flex items-center gap-2 text-left text-sm">
                                <Avatar className="h-9 w-9 rounded-2xl">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-2xl bg-[oklch(0.457_0.24_277.023)] text-xs font-black text-white">R</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold">RISMA Admin</span>
                                    <span className="truncate text-xs text-muted-foreground">Kanggotan Lor</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="rounded-xl text-red-600 focus:text-red-600">
                            <LogOut className="size-4" />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
