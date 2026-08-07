import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="py-12">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-12 w-64" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />

      <div className="mt-8 flex flex-wrap items-center gap-4 pb-8 border-b border-border">
        <div className="flex gap-1.5">
          <Skeleton className="h-8 w-14 rounded-lg" />
          <Skeleton className="h-8 w-14 rounded-lg" />
          <Skeleton className="h-8 w-14 rounded-lg" />
        </div>
        <div className="hidden sm:block w-px h-6 bg-border" />
        <div className="flex gap-1.5">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`py-8 ${i !== 0 ? "border-t border-border" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-6 w-72 max-w-full" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-2/3" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
