import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="py-10">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-12 w-72" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />

      <div className="mt-10 flex flex-col">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`flex items-center gap-4 py-6 ${i !== 0 ? "border-t border-border" : ""}`}>
            <Skeleton className="size-14 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="size-4 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
