import { useDataTable } from "./data-table-context"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

export function DataTableCards() {
  const {
    data,
    columns,
    visibleColumns,
    searchTerm,
    sortColumn,
    sortDirection,
    currentPage,
    perPage,
    serverSide,
    // Row selection
    selectedRows,
    toggleRowSelection,
    rowIdField,
  } = useDataTable()

  // Memoize filtered data to prevent recalculation on every render
  const filteredData = useMemo(() => {
    if (serverSide) return data

    if (!searchTerm) return data

    return data.filter((item) => {
      return columns.some((column) => {
        const value = item[column.accessorKey]
        if (value == null) return false
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    })
  }, [data, columns, searchTerm, serverSide])

  // Memoize sorted data
  const sortedData = useMemo(() => {
    if (serverSide) return filteredData
    if (!sortColumn || !sortDirection) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue == null) return 1
      if (bValue == null) return -1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    })
  }, [filteredData, sortColumn, sortDirection, serverSide])

  // Memoize paginated data
  const paginatedData = useMemo(() => {
    if (serverSide) return sortedData

    const startIndex = (currentPage - 1) * perPage
    return sortedData.slice(startIndex, startIndex + perPage)
  }, [sortedData, currentPage, perPage, serverSide])

  if (paginatedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-center text-muted-foreground">No results found.</div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {paginatedData.map((row, rowIndex) => {
        const rowId = row[rowIdField]
        const isSelected = !!selectedRows[rowId]

        return (
          <Card
            key={rowId || rowIndex}
            className={cn(
              "relative transition-all duration-200 hover:shadow-md",
              isSelected && "ring-2 ring-primary bg-muted/30",
            )}
          >
            <CardContent className="p-4">
              {/* Selection checkbox */}
              <div className="absolute top-3 right-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleRowSelection(rowId)}
                  aria-label="Select card"
                />
              </div>

              {/* Card content */}
              <div className="space-y-3 pr-8">
                {columns
                  .filter((column) => visibleColumns.includes(column.id))
                  .map((column) => {
                    const cellValue = row[column.accessorKey]
                    const renderedValue = column.render ? column.render(cellValue, row, column) : cellValue

                    // Skip empty values
                    if (cellValue == null || cellValue === "") return null

                    return (
                      <div key={column.id} className="flex flex-col space-y-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {column.header}
                        </div>
                        <div className="text-sm">{renderedValue}</div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
