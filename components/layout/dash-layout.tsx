'use client'

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import DashBreadcrumb from "@/components/layout/dash-breadcrumb"
import { memo, ReactNode } from "react"

// Isolate content dari sidebar context
const DashContent = memo(({ children }: { children: ReactNode }) => {
    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-6 mt-1"
                    />
                    <DashBreadcrumb />
                </div>
            </header>
            <div className="px-4">
                {children}
            </div>
        </SidebarInset>
    );
});

DashContent.displayName = 'DashContent';

export default function DashLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Toaster position="bottom-right" />
            <SidebarProvider>
                <AppSidebar />
                <DashContent>
                    {children}
                </DashContent>
            </SidebarProvider>
        </>
    )
}