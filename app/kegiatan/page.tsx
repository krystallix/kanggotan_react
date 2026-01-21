import Layout from "@/components/layout/home-layout";
import { VerticalStepper } from "@/components/ui/vertical-stepper";

export default function KegiatanPage() {
    return (
        <Layout>
            <div className="mt-8 bg-white rounded-lg">

                <VerticalStepper
                    steps={[
                        {
                            label: "Rapat Akhir Tahun Pemuda",
                            description: "26 Desember 2025 - Evaluasi kegiatan selama tahun berjalan",
                            date: "2025-12-26"
                        },
                        {
                            label: "Bantu Persiapan Pengajian Malam Jumat",
                            description: "31 Desember 2025 - Menyiapkan tempat dan perlengkapan",
                            date: "2025-12-31"
                        },
                        {
                            label: "Kerja Bakti Lingkungan Masjid",
                            description: "5 Januari 2026 - Bersih-bersih area masjid",
                            date: "2026-01-04"
                        },
                        {
                            label: "Koordinasi Kegiatan Masjid",
                            description: "10 Januari 2026 - Koordinasi dengan Takmir",
                            date: "2026-01-10"
                        },
                        {
                            label: "Pendampingan Pengajian Remaja",
                            description: "15 Januari 2026 - Membantu pelaksanaan pengajian remaja",
                            date: "2026-01-15"
                        },
                        {
                            label: "Rapat Persiapan Kegiatan Sosial",
                            description: "22 Januari 2026 - Pembahasan rencana kegiatan sosial",
                            date: "2026-01-22"
                        },
                        {
                            label: "Evaluasi Bulanan & Silaturahmi",
                            description: "31 Januari 2026 - Evaluasi kegiatan bulan Januari",
                            date: "2026-01-31"
                        }
                    ]}
                />
            </div >
        </Layout>)
}