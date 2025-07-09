"use client"

import { useDataTable } from "./data-table-context"
import { Button } from "@/components/ui/button"
import { Table, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

export function DataTableViewToggle() {
  const { viewMode, setViewMode } = useDataTable()

  return (
    <div className="flex items-center border rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode("table")}
        className={cn("h-7 px-2", viewMode === "table" && "bg-background shadow-sm")}
      >
        <Table className="h-4 w-4" />
        <span className="sr-only">Table view</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode("cards")}
        className={cn("h-7 px-2", viewMode === "cards" && "bg-background shadow-sm")}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Card view</span>
      </Button>
    </div>
  )
}
