"use server";

import { getSendersWithArwahs } from '@/lib/supabase/queries-server';

export async function exportHaulData(year: number, search: string = "") {
    // Ambil semua data tanpa pagination
    const response = await getSendersWithArwahs(year, 1, 10000, search);

    const exportData = response?.data?.flatMap((item, senderIdx) =>
        item.arwahs?.map((arwah, idx) => ({
            "No": idx === 0 ? `${senderIdx + 1}.` : "",
            "Nama Pengirim": idx === 0 ? item.sender : "",
            "Alamat": idx === 0 ? item.address : "",
            "Nama Arwah": `${idx + 1}. ${arwah.name}`,
            "Makam": arwah.address,
        })) || []
    ) || [];

    return exportData;
}
