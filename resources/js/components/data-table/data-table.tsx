/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { DataTableProvider, type Column, useDataTable } from "./data-table-context"
import { DataTableSearch } from "./data-table-search"
import { DataTableColumns } from "./data-table-columns"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableHeader } from "./data-table-header"
import { DataTableBody } from "./data-table-body"
import { DataTableCards } from "./data-table-cards"
import { DataTableSelection } from "./data-table-selection"
import { DataTableViewToggle } from "./data-table-view-toggle"
import { DataTableFilters } from "./data-table-filters"
import { DataTableLoading } from "./data-table-loading"
import { DataTableExport } from "./data-table-export"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useEffect } from "react"
import type { BulkAction } from "./data-table-bulk-actions"

/**
 * DataTable Props Interface
 *
 * @interface DataTableProps
 */
interface DataTableProps {
  /** Array of data objects to display in the table */
  data: any[]
  /** Array of column definitions */
  columns: Column[]
  /** Number of rows to display per page @default 10 */
  perPage?: number
  /** Total number of records (required for server-side pagination) */
  total?: number
  /** Enable server-side processing @default false */
  serverSide?: boolean
  /** Field to use as unique row identifier @default "id" */
  rowIdField?: string
  /** Callback fired when search term changes */
  onSearch?: (term: string) => void
  /** Callback fired when page changes */
  onPaginate?: (page: number) => void
  /** Callback fired when sorting changes */
  onSort?: (column: string, direction: "asc" | "desc") => void
  /** Callback fired when filters change */
  onFilter?: (filters: any[]) => void
  /** Callback fired when row selection changes */
  onRowsSelected?: (rows: any[]) => void
  /** Callback fired when delete action is triggered */
  onDelete?: (rows: any[]) => void
  /** Custom export handler */
  onExport?: (data: any[], format: "csv" | "excel", options: any) => void
  /** Array of bulk actions for selected rows */
  bulkActions?: BulkAction[]
  /** Default view mode @default "table" */
  defaultViewMode?: "table" | "cards"
  /** Enable view toggle between table and cards @default true */
  enableViewToggle?: boolean
  /** Enable export functionality @default true */
  enableExport?: boolean
  /** Default filename for exports @default "data-export" */
  exportFilename?: string
  /** Loading state indicator @default false */
  loading?: boolean
}

/**
 * DataTable Component
 *
 * A comprehensive data table component with support for:
 * - Search and filtering
 * - Sorting and pagination
 * - Row selection and bulk actions
 * - Export functionality (CSV/Excel)
 * - Responsive design with card view
 * - Server-side and client-side processing
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={users}
 *   columns={userColumns}
 *   perPage={10}
 *   onRowsSelected={(rows) => console.log('Selected:', rows)}
 *   bulkActions={[
 *     createBulkActions.delete(handleDelete),
 *     createBulkActions.exportCSV(columns)
 *   ]}
 * />
 * ```
 */
export function DataTable({
  data,
  columns,
  perPage = 10,
  total = 0,
  serverSide = false,
  rowIdField = "id",
  onSearch,
  onPaginate,
  onSort,
  onFilter,
  onRowsSelected,
  onDelete,
  onExport,
  bulkActions = [],
  defaultViewMode = "table",
  enableViewToggle = true,
  enableExport = true,
  exportFilename = "data-export",
  loading = false,
}: DataTableProps) {
  return (
    <DataTableProvider
      data={data}
      columns={columns}
      perPage={perPage}
      total={serverSide ? total : data.length}
      serverSide={serverSide}
      rowIdField={rowIdField}
      onSearch={onSearch}
      onPaginate={onPaginate}
      onSort={onSort}
      onFilter={onFilter}
      onRowsSelected={onRowsSelected}
      defaultViewMode={defaultViewMode}
    >
      <DataTableContent
        onDelete={onDelete}
        onExport={onExport}
        bulkActions={bulkActions}
        enableViewToggle={enableViewToggle}
        enableExport={enableExport}
        exportFilename={exportFilename}
        columns={columns}
        loading={loading}
      />
    </DataTableProvider>
  )
}

/**
 * Internal DataTable Content Component
 * Handles the main table layout and view switching
 */
function DataTableContent({
  onDelete,
  onExport,
  bulkActions,
  enableViewToggle,
  enableExport,
  exportFilename,
  columns,
  loading,
}: {
  onDelete?: (rows: any[]) => void
  onExport?: (data: any[], format: "csv" | "excel", options: any) => void
  bulkActions: BulkAction[]
  enableViewToggle: boolean
  enableExport: boolean
  exportFilename: string
  columns: Column[]
  loading: boolean
}) {
  const { viewMode, setViewMode } = useDataTable()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Auto-switch to cards on mobile
  useEffect(() => {
    if (isMobile && viewMode === "table") {
      setViewMode("cards")
    }
  }, [isMobile, viewMode, setViewMode])

  return (
    <Card className="w-full relative">
      <DataTableLoading loading={loading} />

      {/* Header with search and controls */}
      <div className="flex items-center justify-between p-4">
        <DataTableSearch />
        <div className="flex items-center gap-2">
          {enableExport && <DataTableExport onExport={onExport} filename={exportFilename} />}
          {enableViewToggle && !isMobile && <DataTableViewToggle />}
          <DataTableColumns />
        </div>
      </div>

      {/* Selection and filters */}
      <DataTableSelection onDelete={onDelete} bulkActions={bulkActions} />
      <DataTableFilters />

      {/* Main content area */}
      {viewMode === "table" ? (
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <SelectAllCheckbox />
                </TableHead>
                {columns
                  .filter((column) => column.visible !== false)
                  .map((column) => (
                    <TableHead key={column.id}>
                      <DataTableHeader column={column.header} accessorKey={column.accessorKey} columnId={column.id} />
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <DataTableBody />
          </Table>
        </div>
      ) : (
        <div className="p-4">
          <DataTableCards />
        </div>
      )}

      {/* Footer with pagination */}
      <div className="p-4 border-t">
        <DataTablePagination />
      </div>
    </Card>
  )
}

/**
 * Select All Checkbox Component
 * Handles the header checkbox for selecting all rows
 */
function SelectAllCheckbox() {
  const { isAllRowsSelected, isIndeterminate, toggleAllRows } = useDataTable()

  return (
    <Checkbox
      checked={isAllRowsSelected}
      onCheckedChange={toggleAllRows}
      aria-label="Select all rows"
      className="translate-y-[2px]"
      // Forward the indeterminate state to the underlying input element
      ref={(el) => {
        // If your Checkbox component forwards the ref to an <input>, this works:
        if (el && "indeterminate" in el) {
          (el as HTMLInputElement).indeterminate = isIndeterminate
        }
      }}
    />
  )
}
