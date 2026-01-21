import { getSendersWithArwahs } from '@/lib/supabase/queries-server'
import HaulTable from "@/app/haul-massal/haul-table";
import { HaulPagination } from "@/app/haul-massal/haul-pagination";
import { Suspense } from "react";
import HaulTableSkeleton from "@/app/haul-massal/haul-table-skeleton";
import DashLayout from "@/components/layout/dash-layout";
import { Metadata } from 'next';
import HaulFilters from '@/app/haul-massal/haul-filter';


export const metadata: Metadata = {
    title: 'Haul Massal - Dashboard',
    description: 'Kelola data pengirim dan arwah untuk haul massal',
};

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


async function HaulData({ year, page, pageSize, search }: {
    year: number;
    page: number;
    pageSize: number;
    search: string;
}) {
    const OFFSET = (page - 1) * pageSize

    const response = await getSendersWithArwahs(year, page, pageSize, search)
    const data = response?.data?.flatMap((item, senderIdx) =>
        item.arwahs?.map((arwah, idx) => ({
            no: OFFSET + senderIdx + 1,
            id: item.id,
            name: item.sender,
            address: item.address,
            isMainRow: idx === 0 ? true : false,
            index: idx + 1,
            arwahId: arwah.id,
            arwahName: arwah.name,
            arwahAddress: arwah.address,
            groupColor: senderIdx % 2 === 0 ? "bg-input/20" : "",
        })) || []
    ) || []

    const total = response.total
    const totalPages = Math.max(1, Math.ceil(total / response.page_size))

    return (
        <>
            <HaulTable data={data} variant="dashboard" />
            <div className="flex my-4 justify-end">
                <HaulPagination currentPage={page} totalPages={totalPages} />
            </div>
        </>
    )
}

export default async function HaulDashboardPage({ searchParams }: PageProps) {
    const params = await searchParams
    const YEAR = params.year ? Number(params.year) : new Date().getFullYear()
    const PAGE = params.page ? Number(params.page) : 1
    const PAGESIZE = params.page_size ? Number(params.page_size) : 50
    const SEARCH = params.search ? String(params.search) : ""

    const currentYear = new Date().getFullYear();
    const startYear = 2018;

    const years = Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => currentYear - i
    );


    const response = await getSendersWithArwahs(YEAR, PAGE, PAGESIZE, SEARCH)

    return (
        <DashLayout>
            <div className='px-10 py-4'>

                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        Haul Massal {YEAR}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Kelola data pengirim dan arwah untuk acara haul massal
                    </p>
                </div>


                <HaulFilters
                    years={years}
                    selectedYear={YEAR}
                    totalResults={response?.total}
                />


                <div className="bg-card rounded-lg border shadow-sm">
                    <Suspense
                        key={`${YEAR}-${PAGE}-${SEARCH}`}
                        fallback={<HaulTableSkeleton />}
                    >
                        <HaulData
                            year={YEAR}
                            page={PAGE}
                            pageSize={PAGESIZE}
                            search={SEARCH}
                        />
                    </Suspense>
                </div>
            </div>
        </DashLayout>
    )
}
