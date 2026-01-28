import Layout from "@/components/layout/home-layout";
import { getSendersWithArwahs } from '@/lib/supabase/queries-server'
import HaulFilters from "@/app/haul-massal/haul-filter";
import HaulTable from "./haul-table";
import { HaulPagination } from "./haul-pagination";
import { Suspense } from "react";
import HaulTableSkeleton from "./haul-table-skeleton";
import {
    CloseableAlert
} from "@/components/alert"
import { getArwahsCount, getSendersCount } from "@/lib/supabase/queries-client";

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
            name: idx === 0 ? item.sender : "",
            address: idx === 0 ? item.address : "",
            index: idx + 1,
            isMainRow: idx === 0 ? true : false,
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
            <HaulTable data={data} />
            <div className="flex my-4 justify-end">
                <HaulPagination currentPage={page} totalPages={totalPages} />
            </div>
        </>
    )
}

export default async function HaulMassalPage({ searchParams }: PageProps) {
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
    const sendersCount = await getSendersCount(YEAR)
    const arwahsCount = await getArwahsCount(YEAR)

    return (
        <Layout>
            <>
                <div className="flex flex-row justify-center">
                    <div className="py-2 max-w-lg">
                        <CloseableAlert />
                    </div>
                </div>

                <div className="flex gap-2">
                    <span>
                        Total Pengirim : {sendersCount}
                    </span>
                    <span>
                        Total Arwah : {arwahsCount}
                    </span>
                </div>
                <HaulFilters
                    years={years}
                    selectedYear={YEAR}
                    totalResults={response?.total}
                    search={SEARCH}
                />

                <div className="mt-8">
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
            </>
        </Layout>
    )
}