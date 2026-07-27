import { Nav } from "@/components/nav-menu";
import NextTopLoader from 'nextjs-toploader';
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Footer } from "@/components/layout/footer";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <NextTopLoader />
            <SpeedInsights />
            {/* Header/Navbar - Shared */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kanggotan</h1>
                        </Link>
                        <Nav />
                    </div>
                </div>
            </header>

            {/* Main Content - Berubah per halaman */}
            <main className="container mx-auto px-4 py-2 flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}
