import Layout from "@/components/layout/home-layout";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <Layout>
            <main className="py-6 md:py-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="mt-4 md:mt-4">
                        <div className="flex flex-col gap-2 text-5xl md:text-6xl font-bold leading-none mb-8">
                            <span className="py-2"> Building Stronger </span>
                            <span className="py-2"> Communities </span>
                            <span className="py-2"> Through </span>
                            <span className="py-2"> Islamic Values </span>
                        </div>
                        <div>
                            <p className="italic text-muted-foreground"> RISMA Kanggotan was founded with the purpose of supporting all religious activities in Kanggotan Lor. Additionally, this organization is also active in community development. RISMA Kanggotan operates under the guidance of the Takmir of At-Ta’awun Mosque in Kanggotan Lor. </p>
                        </div>
                        <Button variant="default" className="mt-10 transition-colors"> Explore More </Button>
                    </div>
                    <div className="relative hidden md:block">
                        <div className="relative">
                            <div className="flex items-center mt-32 justify-center">
                                <Image src="https://pvzcbbmajzlitskhujgn.supabase.co/storage/v1/object/public/risewise/people.svg" alt="group of people" width={500} height={300} priority />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
