/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useDataTable } from "./data-table-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Download,
  Mail,
  Archive,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  FileText,
  FileSpreadsheet,
} from "lucide-react"
import { exportUtils } from "./data-table-export"

export interface BulkAction {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: "default" | "destructive" | "secondary"
  separator?: boolean
  onClick: (selectedRows: any[]) => void
}

interface DataTableBulkActionsProps {
  actions: BulkAction[]
}

export function DataTableBulkActions({ actions }: DataTableBulkActionsProps) {
  const { getSelectedRows, clearRowSelection } = useDataTable()

  const selectedRows = getSelectedRows()
  const selectedCount = selectedRows.length

  if (selectedCount === 0 || actions.length === 0) {
    return null
  }

  const handleAction = (action: BulkAction) => {
    action.onClick(selectedRows)
    // Optionally clear selection after action
    if (action.id === "delete" || action.id === "archive") {
      clearRowSelection()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          Bulk Actions
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
        </div>
        <DropdownMenuSeparator />
        {actions.map((action, index) => (
          <div key={action.id}>
            <DropdownMenuItem
              onClick={() => handleAction(action)}
              className={
                action.variant === "destructive"
                  ? "text-red-600 focus:text-red-600"
                  : action.variant === "secondary"
                    ? "text-muted-foreground"
                    : ""
              }
            >
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </DropdownMenuItem>
            {action.separator && index < actions.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Pre-built bulk actions for common use cases
export const createBulkActions = {
  delete: (onDelete: (rows: any[]) => void): BulkAction => ({
    id: "delete",
    label: "Delete selected",
    icon: Trash2,
    variant: "destructive",
    separator: true,
    onClick: onDelete,
  }),

  exportCSV: (columns: any[], filename?: string): BulkAction => ({
    id: "exportCSV",
    label: "Export as CSV",
    icon: FileText,
    onClick: (rows) => {
      const exportColumns = columns.filter((col) => col.id !== "actions")
      exportUtils.toCSV(rows, exportColumns, filename || "selected-data")
    },
  }),

  exportExcel: (columns: any[], filename?: string): BulkAction => ({
    id: "exportExcel",
    label: "Export as Excel",
    icon: FileSpreadsheet,
    onClick: async (rows) => {
      const exportColumns = columns.filter((col) => col.id !== "actions")
      try {
        await exportUtils.toExcel(rows, exportColumns, filename || "selected-data")
      } catch (error) {
        console.error("Export failed:", error)
        // Fallback to CSV
        exportUtils.toCSV(rows, exportColumns, filename || "selected-data")
      }
    },
  }),

  export: (onExport: (rows: any[]) => void): BulkAction => ({
    id: "export",
    label: "Export selected",
    icon: Download,
    onClick: onExport,
  }),

  sendEmail: (onSendEmail: (rows: any[]) => void): BulkAction => ({
    id: "sendEmail",
    label: "Send email",
    icon: Mail,
    onClick: onSendEmail,
  }),

  archive: (onArchive: (rows: any[]) => void): BulkAction => ({
    id: "archive",
    label: "Archive selected",
    icon: Archive,
    variant: "secondary",
    onClick: onArchive,
  }),

  activate: (onActivate: (rows: any[]) => void): BulkAction => ({
    id: "activate",
    label: "Activate selected",
    icon: CheckCircle,
    onClick: onActivate,
  }),

  deactivate: (onDeactivate: (rows: any[]) => void): BulkAction => ({
    id: "deactivate",
    label: "Deactivate selected",
    icon: XCircle,
    variant: "secondary",
    onClick: onDeactivate,
  }),

  edit: (onEdit: (rows: any[]) => void): BulkAction => ({
    id: "edit",
    label: "Edit selected",
    icon: Edit,
    onClick: onEdit,
  }),

  custom: (
    id: string,
    label: string,
    onClick: (rows: any[]) => void,
    options?: {
      icon?: React.ComponentType<{ className?: string }>
      variant?: "default" | "destructive" | "secondary"
      separator?: boolean
    },
  ): BulkAction => ({
    id,
    label,
    icon: options?.icon,
    variant: options?.variant || "default",
    separator: options?.separator,
    onClick,
  }),
}
