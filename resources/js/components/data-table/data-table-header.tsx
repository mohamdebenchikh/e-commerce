import { useDataTable } from "./data-table-context"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTableFilterPopover } from "./data-table-filter-popover"

interface DataTableHeaderProps {
  column: string
  accessorKey: string
  columnId: string
}

export function DataTableHeader({ column, accessorKey, columnId }: DataTableHeaderProps) {
  const { sortColumn, sortDirection, setSorting, columns } = useDataTable()

  const columnDef = columns.find((col) => col.id === columnId)
  const isSorted = sortColumn === accessorKey
  const enableSorting = columnDef?.enableSorting !== false
  const enableFiltering = columnDef?.enableFiltering !== false

  const handleSort = () => {
    if (!enableSorting) return

    if (!isSorted) {
      setSorting(accessorKey, "asc")
    } else if (sortDirection === "asc") {
      setSorting(accessorKey, "desc")
    } else {
      // Reset sorting
      setSorting("", "asc")
    }
  }

  return (
    <div className="flex items-center">
      {enableSorting ? (
        <Button
          variant="ghost"
          onClick={handleSort}
          className={cn(
            "flex items-center gap-1 p-0 font-medium hover:bg-transparent hover:underline",
            isSorted && "underline",
          )}
        >
          {column}
          {isSorted ? (
            sortDirection === "asc" ? (
              <ArrowUp className="ml-1 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-1 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
          )}
        </Button>
      ) : (
        <span className="font-medium">{column}</span>
      )}

      {columnDef && enableFiltering && <DataTableFilterPopover column={columnDef} />}
    </div>
  )
}
