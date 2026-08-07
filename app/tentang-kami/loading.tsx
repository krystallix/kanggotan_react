import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="text-center space-y-3 mt-12">
      <Skeleton className="mx-auto h-6 w-56 rounded-full" />
      <Skeleton className="mx-auto h-9 w-80 max-w-full" />
      <Skeleton className="mx-auto h-4 w-full max-w-xl" />
      <Skeleton className="mx-auto h-4 w-full max-w-lg" />

      <div className="my-8 h-px bg-border" />

      <main className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border p-6">
              <Skeleton className="h-5 w-20" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>

        <div className="my-8 h-px bg-border" />

        <div className="space-y-6">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border p-6">
              <Skeleton className="h-5 w-40" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
            <div className="rounded-xl border border-border p-6">
              <Skeleton className="h-5 w-36" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-3 my-8">
          <Skeleton className="mx-auto h-4 w-80" />
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>
      </main>
    </div>
  )
}
