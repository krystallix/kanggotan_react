import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="py-6">
      <div className="flex flex-row justify-center">
        <Skeleton className="h-12 w-full max-w-lg rounded-lg" />
      </div>

      <div className="mt-4 flex gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex justify-between gap-2 items-center my-4">
        <div className="flex w-2/3 md:w-2/8">
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-6 gap-3 border-b border-border bg-muted/40 px-4 py-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="grid grid-cols-6 gap-3 border-b border-border/60 px-4 py-3.5">
            {[0, 1, 2, 3, 4, 5].map((j) => (
              <Skeleton key={j} className="h-3.5 w-full" />
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-end my-4">
        <Skeleton className="h-8 w-40 rounded-md" />
      </div>
    </div>
  )
}
