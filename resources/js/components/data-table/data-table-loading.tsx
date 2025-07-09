import { Loader2 } from "lucide-react"

interface DataTableLoadingProps {
  loading: boolean
}

export function DataTableLoading({ loading }: DataTableLoadingProps) {
  if (!loading) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading data...</span>
      </div>
    </div>
  )
}
