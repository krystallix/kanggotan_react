"use client";

import * as React from "react";
import Link from "next/link";
import { User } from '@supabase/supabase-js';
import { useIsMobile } from "@/hooks/use-mobile";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Activity, Grid, Home, LogIn, Menu, Newspaper, User as UserIcon } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useAuth } from "@/context/AuthProvider";

const LIST_KEGIATAN = [
    {
        title: "Haul Massal",
        description: "Haul massal setiap bulan sya'ban",
        href: "/haul-massal",
    },
    {
        title: "Kegiatan",
        description: "Aktivitas yang sedang berlangsung atau baru saja dilakukan",
        href: "/kegiatan",
    },
    {
        title: "Galeri Kegiatan",
        description: "Galeri foto kegiatan-kegiatan RISMA Kanggotan Lor",
        href: "/galeri",
    },
];


export function Nav() {
    const { user, isLoading } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);

    if (isLoading) {
        return (
            <nav className="p-4 bg-gray-800 text-white">
                <div>Loading...</div>
            </nav>
        )
    }
    return (
        <>
            {/* Mobile Nav - Hidden on desktop */}
            <div className="block md:hidden">
                <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
            </div>

            {/* Desktop Nav - Hidden on mobile */}
            <div className="hidden md:block">
                <DesktopNav user={user} />
            </div>
        </>
    );
}


interface MobileNavProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    user: User | null;
}

function MobileNav({ isOpen, setIsOpen, user }: MobileNavProps) {
    const navLinkClass = "flex flex-row gap-2 items-center font-medium text-lg  text-gray-800 hover:text-primary transition-colors";
    const iconClass = "size-4 text-gray-500 group-hover:text-primary";

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-62.5">
                <SheetHeader>
                    <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 p-6 pt-2">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={`${navLinkClass} group`}
                    >
                        <Home className={iconClass} />
                        Beranda
                    </Link>

                    <div className="flex flex-col gap-2">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="p-0 hover:no-underline hover:bg-transparent hover:text-primary text-gray-800 gap-2 items-center flex flex-row group">
                                    <Activity className={iconClass} />
                                    <span className="font-medium text-lg">Kegiatan</span>
                                </AccordionTrigger>
                                <AccordionContent className="mt-4 p-0">
                                    <div className="flex flex-col gap-3 ml-2">
                                        {LIST_KEGIATAN.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="text-lg font-medium hover:text-primary text-gray-800 transition-colors"
                                            >
                                                {item.title}
                                            </Link>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <Link
                        href="/blog"
                        onClick={() => setIsOpen(false)}
                        className={`${navLinkClass} group`}
                    >
                        <Newspaper className={iconClass} />
                        Blog
                    </Link>

                    <Link
                        href="/tentang-kami"
                        onClick={() => setIsOpen(false)}
                        className={`${navLinkClass} group`}
                    >
                        <UserIcon className={iconClass} />
                        Tentang Kami
                    </Link>
                    {user ? (<>
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className={`${navLinkClass} group`}
                        >
                            <Grid className={iconClass} />
                            Dashboard
                        </Link>
                    </>) : (<>
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className={`${navLinkClass} group`}
                        >
                            <LogIn className={iconClass} />
                            Login
                        </Link>
                    </>)}
                </nav>
            </SheetContent>
        </Sheet>
    );
}


function DesktopNav({ user }: { user: User | null }) {
    const isMobile = useIsMobile();
    return (
        <NavigationMenu viewport={isMobile}>
            <NavigationMenuList className="flex-wrap">
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/">Beranda</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Kegiatan</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="flex flex-col gap-2 md:w-62.5 lg:w-87.5 lg:grid-cols-1">
                            {LIST_KEGIATAN.map((item) => (
                                <ListItem
                                    key={item.title}
                                    href={item.href}
                                    title={item.title}
                                >
                                    {item.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/blog">Blog</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/tentang-kami">Tentang Kami</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                {user ? (
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/dashboard">Dashboard</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>) : (
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/login">Login</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="flex flex-col gap-1.5">
                        <div className="text-sm leading-none font-medium">{title}</div>
                        <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                            {children}
                        </p>
                    </div>

                </Link>

            </NavigationMenuLink>
        </li>
    );
}
