'use client'

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import NextTopLoader from 'nextjs-toploader';
import { SpeedInsights } from "@vercel/speed-insights/next"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import DashBreadcrumb from "@/components/layout/dash-breadcrumb"
import { memo, ReactNode } from "react"

const DashContent = memo(({ children }: { children: ReactNode }) => {
    return (
        <SidebarInset className="relative overflow-hidden bg-white">
            <SpeedInsights />
            <NextTopLoader color="oklch(0.457 0.24 277.023)" showSpinner={false} height={2} />
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-black/8 bg-white/80 backdrop-blur-xl">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-6 mt-1"
                    />
                    <DashBreadcrumb />
                </div>
            </header>
            <main className="relative z-10 px-3 pb-8 pt-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
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
