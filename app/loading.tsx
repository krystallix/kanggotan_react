import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      <section className="py-16 lg:py-20">
        <Skeleton className="h-16 w-72" />
        <Skeleton className="mt-4 h-4 w-96 max-w-full" />
        <div className="mt-10 rounded-[2rem] bg-white p-4 ring-1 ring-black/5">
          <div className="relative min-h-[560px] overflow-hidden rounded-[1.5rem] bg-muted">
            <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-14">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32 bg-white/30" />
                <Skeleton className="size-4 rounded-full bg-white/30" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-14 w-72 bg-white/30" />
                <Skeleton className="h-14 w-56 bg-white/30" />
                <Skeleton className="h-14 w-64 bg-white/30" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-12 w-40 rounded-2xl bg-white/30" />
                <Skeleton className="h-12 w-36 rounded-2xl bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-48" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Skeleton className="h-44 rounded-3xl" />
          <Skeleton className="h-44 rounded-3xl" />
          <Skeleton className="h-44 rounded-3xl" />
        </div>
      </section>

      <section className="py-24">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </section>

      <section className="py-20">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-8 w-40" />
        <div className="mt-8 overflow-hidden rounded-2xl border border-black/8">
          <Skeleton className="h-64 w-full lg:h-80" />
          <div className="space-y-3 p-6 lg:p-8">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-96 max-w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="rounded-3xl p-8 md:p-14 bg-muted">
          <Skeleton className="h-7 w-72" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
          <Skeleton className="mt-6 h-12 w-48 rounded-2xl" />
        </div>
      </section>
    </div>
  )
}
