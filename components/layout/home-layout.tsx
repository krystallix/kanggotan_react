import { Nav } from "@/components/nav-menu";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {/* Header/Navbar - Shared */}
            <header className="sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 mt-2">
                    <div className="flex justify-between items-center">
                        <Link href="/">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kanggotan</h1>
                        </Link>
                        <Nav />
                    </div>
                </div>
            </header>

            {/* Main Content - Berubah per halaman */}
            <main className="container mx-auto px-4 py-2">
                {children}
            </main>
        </div>
    );
}
