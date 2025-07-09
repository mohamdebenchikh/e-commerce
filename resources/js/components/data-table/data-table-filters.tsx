/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDataTable } from "./data-table-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function DataTableFilters() {
  const { filters, removeFilter, clearFilters, columns } = useDataTable()

  if (filters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <div className="text-sm text-muted-foreground">Filters:</div>

      {filters.map((filter) => {
        const column = columns.find((col) => col.id === filter.columnId)
        if (!column) return null

        return (
          <Badge key={filter.id} variant="secondary" className="flex items-center gap-1">
            <span className="font-medium">{column.header}</span>
            <span className="mx-1">:</span>
            <span>{formatFilterValue(filter)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              onClick={() => removeFilter(filter.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove filter</span>
            </Button>
          </Badge>
        )
      })}

      <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={clearFilters}>
        Clear all
      </Button>
    </div>
  )
}

// Helper function to format filter value for display
function formatFilterValue(filter: any): string {
  const { operator, value, additionalValue } = filter

  switch (operator) {
    // Text operators
    case "contains":
      return `contains "${value}"`
    case "equals":
      return `= "${value}"`
    case "startsWith":
      return `starts with "${value}"`
    case "endsWith":
      return `ends with "${value}"`

    // Number operators
    case "=":
      return `= ${value}`
    case ">":
      return `> ${value}`
    case ">=":
      return `≥ ${value}`
    case "<":
      return `< ${value}`
    case "<=":
      return `≤ ${value}`
    case "between":
      return `${value} to ${additionalValue}`

    // Date operators
    case "dateEquals":
      return `on ${formatDate(value)}`
    case "dateBefore":
      return `before ${formatDate(value)}`
    case "dateAfter":
      return `after ${formatDate(value)}`
    case "dateBetween":
      return `${formatDate(value)} to ${formatDate(additionalValue)}`

    // Boolean operators
    case "isTrue":
      return "is true"
    case "isFalse":
      return "is false"

    // Select operators
    case "in":
      return `is ${Array.isArray(value) ? value.length : 0} selected`

    default:
      return String(value)
  }
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return String(dateString)
  }
}
