/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDataTable } from "./data-table-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { useMemo } from "react"

interface ExportOptions {
  filename?: string
  includeHeaders?: boolean
  selectedOnly?: boolean
  visibleColumnsOnly?: boolean
  useRawValues?: boolean
}

interface DataTableExportProps {
  onExport?: (data: any[], format: "csv" | "excel", options: ExportOptions) => void
  filename?: string
}

export function DataTableExport({ onExport, filename = "data-export" }: DataTableExportProps) {
  const { data, columns, visibleColumns, getSelectedRows, searchTerm, filters } = useDataTable()

  // Get filtered data (same logic as the table)
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (searchTerm) {
      result = result.filter((item) => {
        return columns.some((column) => {
          const value = item[column.accessorKey]
          if (value == null) return false
          return String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      })
    }

    // Apply column filters
    if (filters.length > 0) {
      result = result.filter((row) => {
        return filters.every((filter) => {
          const column = columns.find((col) => col.id === filter.columnId)
          if (!column) return true

          const value = row[column.accessorKey]

          switch (filter.operator) {
            case "contains":
              return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
            case "equals":
              return String(value).toLowerCase() === String(filter.value).toLowerCase()
            case "startsWith":
              return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase())
            case "endsWith":
              return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase())
            case "=":
              return Number(value) === Number(filter.value)
            case ">":
              return Number(value) > Number(filter.value)
            case ">=":
              return Number(value) >= Number(filter.value)
            case "<":
              return Number(value) < Number(filter.value)
            case "<=":
              return Number(value) <= Number(filter.value)
            case "between":
              return Number(value) >= Number(filter.value) && Number(value) <= Number(filter.additionalValue)
            case "dateEquals":
              return new Date(value).setHours(0, 0, 0, 0) === new Date(filter.value).setHours(0, 0, 0, 0)
            case "dateBefore":
              return new Date(value) < new Date(filter.value)
            case "dateAfter":
              return new Date(value) > new Date(filter.value)
            case "dateBetween":
              return new Date(value) >= new Date(filter.value) && new Date(value) <= new Date(filter.additionalValue)
            case "isTrue":
              return Boolean(value) === true
            case "isFalse":
              return Boolean(value) === false
            case "in":
              return filter.value.includes(value)
            default:
              return true
          }
        })
      })
    }

    return result
  }, [data, columns, searchTerm, filters])

  const selectedRows = getSelectedRows()
  const hasSelection = selectedRows.length > 0

  const handleExport = (format: "csv" | "excel", selectedOnly = false) => {
    const exportData = selectedOnly ? selectedRows : filteredData
    const options: ExportOptions = {
      filename,
      includeHeaders: true,
      selectedOnly,
      visibleColumnsOnly: true,
      useRawValues: true,
    }

    if (onExport) {
      onExport(exportData, format, options)
    } else {
      // Default export implementation
      if (format === "csv") {
        exportToCSV(exportData, options)
      } else {
        exportToExcel(exportData, options)
      }
    }
  }

  const exportToCSV = (exportData: any[], options: ExportOptions) => {
    const exportColumns = options.visibleColumnsOnly
      ? columns.filter((col) => visibleColumns.includes(col.id) && col.id !== "actions")
      : columns.filter((col) => col.id !== "actions")

    // Create CSV content
    let csvContent = ""

    // Add headers
    if (options.includeHeaders) {
      const headers = exportColumns.map((col) => `"${col.header}"`)
      csvContent += headers.join(",") + "\n"
    }

    // Add data rows
    exportData.forEach((row) => {
      const values = exportColumns.map((col) => {
        let value = row[col.accessorKey]

        // Handle different data types
        if (value === null || value === undefined) {
          return '""'
        }

        if (value instanceof Date) {
          value = value.toISOString().split("T")[0] // Format as YYYY-MM-DD
        }

        if (typeof value === "boolean") {
          value = value ? "Yes" : "No"
        }

        // Escape quotes and wrap in quotes
        return `"${String(value).replace(/"/g, '""')}"`
      })

      csvContent += values.join(",") + "\n"
    })

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${options.filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = async (exportData: any[], options: ExportOptions) => {
    try {
      // Dynamic import to reduce bundle size
      const XLSX = await import("xlsx")

      const exportColumns = options.visibleColumnsOnly
        ? columns.filter((col) => visibleColumns.includes(col.id) && col.id !== "actions")
        : columns.filter((col) => col.id !== "actions")

      // Prepare data for Excel
      const worksheetData = exportData.map((row) => {
        const excelRow: any = {}
        exportColumns.forEach((col) => {
          let value = row[col.accessorKey]

          // Handle different data types
          if (value === null || value === undefined) {
            value = ""
          } else if (value instanceof Date) {
            value = value.toISOString().split("T")[0] // Format as YYYY-MM-DD
          } else if (typeof value === "boolean") {
            value = value ? "Yes" : "No"
          }

          excelRow[col.header] = value
        })
        return excelRow
      })

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(worksheetData)

      // Auto-size columns
      const columnWidths = exportColumns.map((col) => ({
        wch: Math.max(col.header.length, 15),
      }))
      worksheet["!cols"] = columnWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

      // Save file
      XLSX.writeFile(workbook, `${options.filename}.xlsx`)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      // Fallback to CSV if Excel export fails
      exportToCSV(exportData, options)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">Export All Data</div>
        <DropdownMenuItem onClick={() => handleExport("csv", false)}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel", false)}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>

        {hasSelection && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              Export Selected ({selectedRows.length})
            </div>
            <DropdownMenuItem onClick={() => handleExport("csv", true)}>
              <FileText className="mr-2 h-4 w-4" />
              Selected as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("excel", true)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Selected as Excel
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Export utilities that can be used independently
export const exportUtils = {
  toCSV: (data: any[], columns: any[], filename = "export") => {
    let csvContent = ""

    // Add headers
    const headers = columns.map((col) => `"${col.header || col.accessorKey}"`)
    csvContent += headers.join(",") + "\n"

    // Add data rows
    data.forEach((row) => {
      const values = columns.map((col) => {
        let value = row[col.accessorKey]

        if (value === null || value === undefined) {
          return '""'
        }

        if (value instanceof Date) {
          value = value.toISOString().split("T")[0]
        }

        if (typeof value === "boolean") {
          value = value ? "Yes" : "No"
        }

        return `"${String(value).replace(/"/g, '""')}"`
      })

      csvContent += values.join(",") + "\n"
    })

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  toExcel: async (data: any[], columns: any[], filename = "export") => {
    try {
      const XLSX = await import("xlsx")

      const worksheetData = data.map((row) => {
        const excelRow: any = {}
        columns.forEach((col) => {
          let value = row[col.accessorKey]

          if (value === null || value === undefined) {
            value = ""
          } else if (value instanceof Date) {
            value = value.toISOString().split("T")[0]
          } else if (typeof value === "boolean") {
            value = value ? "Yes" : "No"
          }

          excelRow[col.header || col.accessorKey] = value
        })
        return excelRow
      })

      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(worksheetData)

      const columnWidths = columns.map((col) => ({
        wch: Math.max((col.header || col.accessorKey).length, 15),
      }))
      worksheet["!cols"] = columnWidths

      XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      throw error
    }
  },
}
