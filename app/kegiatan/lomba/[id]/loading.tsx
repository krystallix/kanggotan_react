import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="py-10 bg-background sm:px-4 rounded-3xl">
      <div className="mb-8 pb-6 flex flex-wrap items-end justify-between gap-4 px-4 sm:px-0">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-2 h-9 w-72 max-w-full" />
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-11 w-40 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr] px-4 sm:px-0">
        <div className="rounded-none sm:rounded-2xl border-y sm:border border-border overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="space-y-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 border-b border-border/60 px-4 py-4">
                <Skeleton className="size-6 rounded" />
                <Skeleton className="h-4 w-40" />
                <div className="ml-auto flex items-center gap-3">
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="p-4 space-y-3">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-10">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="mt-2 h-4 w-72" />
        <div className="mt-6 flex items-center gap-10 overflow-hidden py-6">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  )
}
