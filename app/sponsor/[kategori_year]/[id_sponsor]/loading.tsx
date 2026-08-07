import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="py-6 sm:py-10">
      <div className="-mx-3 sm:mx-0 mb-5 px-2 sm:px-0">
        <Skeleton className="h-8 w-44 rounded-full" />
      </div>

      <div className="-mx-6 sm:mx-auto sm:max-w-md">
        <div className="rounded-none sm:rounded-3xl border-0 sm:border border-border/60 overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full rounded-none bg-muted" />
          <div className="flex items-center gap-4 p-5 sm:p-6">
            <Skeleton className="size-20 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-md" />
              </div>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="space-y-3 px-6 pb-6">
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
          </div>
        </div>
        <div className="mt-6 px-6 sm:px-0">
          <Skeleton className="mx-auto h-3 w-64" />
        </div>
      </div>
    </div>
  )
}
