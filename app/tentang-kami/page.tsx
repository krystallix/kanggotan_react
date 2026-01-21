
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/home-layout";
import { Calendar, Phone } from "lucide-react";

export default function TentangKamiPage() {
    return (
        <Layout>
            <section className="text-center space-y-3 mt-12">
                <Badge variant="outline" className="mx-auto">Organisasi Remaja Masjid</Badge>
                <h1 className="text-3xl font-semibold tracking-tight">
                    RISMA Kanggotan Lor
                </h1>
                <p className=" max-w-2xl mx-auto">
                    Organisasi berbasis keagamaan di bawah naungan Takmir Masjid At-Ta&apos;awun,
                    sekaligus aktif memberdayakan masyarakat di lingkungan Kanggotan Lor.
                </p>
            </section>

            <Separator className="my-8" />
            <main className="mx-auto max-w-5xl px-6">


                <section className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Visi</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm ">
                            Mewujudkan generasi muda yang beriman, berilmu, dan berdaya guna
                            bagi masjid dan masyarakat sekitar.
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Misi</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm  space-y-2">
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Pembinaan ibadah dan akhlak remaja masjid.</li>
                                <li>Penguatan literasi keagamaan dan keterampilan sosial.</li>
                                <li>Kolaborasi kegiatan sosial dengan warga Kanggotan Lor.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Naungan</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm ">
                            Berada dalam naungan Takmir Masjid At-Ta&apos;awun sebagai wadah pembinaan,
                            koordinasi, dan pelaksanaan kegiatan kemasjidan.
                        </CardContent>
                    </Card>
                </section>

                <Separator className="my-8" />


                <section>
                    <Tabs defaultValue="cerita" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="struktur">Struktur</TabsTrigger>
                            <TabsTrigger value="kegiatan">Kegiatan</TabsTrigger>
                        </TabsList>



                        <TabsContent value="kegiatan" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Pendukung Kegiatan Masjid</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm ">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mendukung pelaksanaan kegiatan masjid seperti persiapan dan pelayanan pengajian,
                                        termasuk pengaturan perlengkapan dan koordinasi teknis bersama Takmir.
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Sosial Masyarakat</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm ">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bakti lingkungan, sinoman, dan kolaborasi kepemudaan
                                        untuk memperkuat solidaritas warga Kanggotan Lor.
                                    </CardContent>
                                </Card>


                            </div>
                        </TabsContent>

                        <TabsContent value="struktur" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Struktur Inti</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm ">
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Pelindung : Takmir Masjid At-Ta&apos;awun</li>
                                        <li>Ketua : Febri Faini</li>
                                        <li>Wakil Ketua : Hera</li>
                                        <li>Sekretaris : Annisa Eka</li>
                                        <li>Bendahara :  Sifa</li>
                                    </ul>
                                    <p className="mt-3">
                                        Struktur dapat disesuaikan dengan arahan Takmir Masjid At-Ta&apos;awun
                                        dan kebutuhan program berjalan.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </section>



                <section className="text-center space-y-3 my-8">
                    <p className="">
                        Ingin bergabung atau kolaborasi kegiatan di Kanggotan Lor?
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Button>
                            <Phone />
                            Hubungi Kami</Button>
                        <Button variant="outline">
                            <Calendar />
                            Lihat Agenda</Button>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
