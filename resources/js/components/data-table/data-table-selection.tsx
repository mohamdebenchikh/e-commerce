/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useDataTable } from "./data-table-context"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DataTableBulkActions, type BulkAction } from "./data-table-bulk-actions"

interface DataTableSelectionProps {
  onDelete?: (rows: any[]) => void
  bulkActions?: BulkAction[]
}

export function DataTableSelection({ onDelete, bulkActions = [] }: DataTableSelectionProps) {
  const { getSelectedRows, clearRowSelection } = useDataTable()

  const selectedRows = getSelectedRows()
  const selectedCount = selectedRows.length

  if (selectedCount === 0) {
    return null
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(selectedRows)
    }
    clearRowSelection()
  }

  return (
    <div className="flex items-center justify-between py-2 px-4 bg-muted/30 border-b">
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? "row" : "rows"} selected
        </div>
        <Button variant="outline" size="sm" onClick={clearRowSelection}>
          Clear selection
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Bulk Actions Dropdown */}
        {bulkActions.length > 0 && <DataTableBulkActions actions={bulkActions} />}

        {/* Legacy Delete Button (kept for backward compatibility) */}
        {onDelete && bulkActions.length === 0 && (
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
