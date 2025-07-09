import { useDataTable } from "./data-table-context"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useMemo } from "react"

export function DataTableBody() {
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
      <TableBody>
        <TableRow>
          <TableCell colSpan={visibleColumns.length + 1} className="h-24 text-center">
            No results found.
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {paginatedData.map((row, rowIndex) => {
        const rowId = row[rowIdField]
        return (
          <TableRow key={rowId || rowIndex} className={selectedRows[rowId] ? "bg-muted/50" : undefined}>
            <TableCell className="w-10">
              <Checkbox
                checked={!!selectedRows[rowId]}
                onCheckedChange={() => toggleRowSelection(rowId)}
                aria-label="Select row"
              />
            </TableCell>
            {columns
              .filter((column) => visibleColumns.includes(column.id))
              .map((column) => {
                const cellValue = row[column.accessorKey]
                return (
                  <TableCell key={`${rowIndex}-${column.id}`}>
                    {column.render ? column.render(cellValue, row, column) : cellValue}
                  </TableCell>
                )
              })}
          </TableRow>
        )
      })}
    </TableBody>
  )
}
