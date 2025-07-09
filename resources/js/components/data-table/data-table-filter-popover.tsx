/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDataTable, type Column, type Filter } from "./data-table-context"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, FilterIcon, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface DataTableFilterPopoverProps {
  column: Column
}

export function DataTableFilterPopover({ column }: DataTableFilterPopoverProps) {
  const { filters, /*addFilter,*/ removeFilter } = useDataTable()
  const [open, setOpen] = useState(false)

  // Check if this column has an active filter
  const activeFilter = filters.find((filter) => filter.columnId === column.id)

  // Determine filter type based on column configuration or try to infer it
  const filterType = column.filterType || inferFilterType(column)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0 ml-1", activeFilter && "text-primary bg-primary/10")}
        >
          <FilterIcon className="h-4 w-4" />
          <span className="sr-only">Filter {column.header}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter: {column.header}</h4>
            {activeFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground"
                onClick={() => {
                  removeFilter(activeFilter.id)
                  setOpen(false)
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove filter</span>
              </Button>
            )}
          </div>

          {filterType === "text" && (
            <TextFilter column={column} activeFilter={activeFilter} onApply={() => setOpen(false)} />
          )}

          {filterType === "number" && (
            <NumberFilter column={column} activeFilter={activeFilter} onApply={() => setOpen(false)} />
          )}

          {filterType === "date" && (
            <DateFilter column={column} activeFilter={activeFilter} onApply={() => setOpen(false)} />
          )}

          {filterType === "select" && (
            <SelectFilter column={column} activeFilter={activeFilter} onApply={() => setOpen(false)} />
          )}

          {filterType === "boolean" && (
            <BooleanFilter column={column} activeFilter={activeFilter} onApply={() => setOpen(false)} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Helper function to infer filter type from column data
function inferFilterType(column: Column): "text" | "number" | "date" | "select" | "boolean" {
  if (column.filterType) return column.filterType

  // Default to text filter
  return "text"
}

// Text Filter Component
function TextFilter({
  column,
  activeFilter,
  onApply,
}: {
  column: Column
  activeFilter?: Filter
  onApply: () => void
}) {
  const { addFilter } = useDataTable()
  const [operator, setOperator] = useState<string>(activeFilter?.operator || "contains")
  const [value, setValue] = useState<string>(activeFilter?.value || "")

  const handleApply = () => {
    if (!value.trim()) return

    if (activeFilter) {
      // Update existing filter
      addFilter({
        ...activeFilter,
        operator,
        value,
      })
    } else {
      // Add new filter
      addFilter({
        id: `${column.id}-${Date.now()}`,
        columnId: column.id,
        operator,
        value,
      })
    }

    onApply()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Operator</Label>
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger>
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="startsWith">Starts with</SelectItem>
            <SelectItem value="endsWith">Ends with</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Value</Label>
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Filter value..." />
      </div>

      <Button onClick={handleApply} className="w-full">
        Apply Filter
      </Button>
    </div>
  )
}

// Number Filter Component
function NumberFilter({
  column,
  activeFilter,
  onApply,
}: {
  column: Column
  activeFilter?: Filter
  onApply: () => void
}) {
  const { addFilter } = useDataTable()
  const [operator, setOperator] = useState<string>(activeFilter?.operator || "=")
  const [value, setValue] = useState<string>(activeFilter?.value?.toString() || "")
  const [additionalValue, setAdditionalValue] = useState<string>(activeFilter?.additionalValue?.toString() || "")

  const handleApply = () => {
    if (!value) return

    if (activeFilter) {
      // Update existing filter
      addFilter({
        ...activeFilter,
        operator,
        value: Number(value),
        additionalValue: operator === "between" ? Number(additionalValue) : undefined,
      })
    } else {
      // Add new filter
      addFilter({
        id: `${column.id}-${Date.now()}`,
        columnId: column.id,
        operator,
        value: Number(value),
        additionalValue: operator === "between" ? Number(additionalValue) : undefined,
      })
    }

    onApply()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Operator</Label>
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger>
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="=">=</SelectItem>
            <SelectItem value=">">{">"}</SelectItem>
            <SelectItem value=">=">{"≥"}</SelectItem>
            <SelectItem value="<">{"<"}</SelectItem>
            <SelectItem value="<=">{"≤"}</SelectItem>
            <SelectItem value="between">Between</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{operator === "between" ? "Minimum value" : "Value"}</Label>
        <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter number..." />
      </div>

      {operator === "between" && (
        <div className="space-y-2">
          <Label>Maximum value</Label>
          <Input
            type="number"
            value={additionalValue}
            onChange={(e) => setAdditionalValue(e.target.value)}
            placeholder="Enter number..."
          />
        </div>
      )}

      <Button onClick={handleApply} className="w-full">
        Apply Filter
      </Button>
    </div>
  )
}

// Date Filter Component
function DateFilter({
  column,
  activeFilter,
  onApply,
}: {
  column: Column
  activeFilter?: Filter
  onApply: () => void
}) {
  const { addFilter } = useDataTable()
  const [operator, setOperator] = useState<string>(activeFilter?.operator || "dateEquals")
  const [date, setDate] = useState<Date | undefined>(activeFilter?.value ? new Date(activeFilter.value) : undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(
    activeFilter?.additionalValue ? new Date(activeFilter.additionalValue) : undefined,
  )

  const handleApply = () => {
    if (!date) return

    if (activeFilter) {
      // Update existing filter
      addFilter({
        ...activeFilter,
        operator,
        value: date,
        additionalValue: operator === "dateBetween" ? endDate : undefined,
      })
    } else {
      // Add new filter
      addFilter({
        id: `${column.id}-${Date.now()}`,
        columnId: column.id,
        operator,
        value: date,
        additionalValue: operator === "dateBetween" ? endDate : undefined,
      })
    }

    onApply()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Operator</Label>
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger>
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dateEquals">Equals</SelectItem>
            <SelectItem value="dateBefore">Before</SelectItem>
            <SelectItem value="dateAfter">After</SelectItem>
            <SelectItem value="dateBetween">Between</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{operator === "dateBetween" ? "Start date" : "Date"}</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {operator === "dateBetween" && (
        <div className="space-y-2">
          <Label>End date</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      <Button onClick={handleApply} className="w-full">
        Apply Filter
      </Button>
    </div>
  )
}

// Select Filter Component
function SelectFilter({
  column,
  activeFilter,
  onApply,
}: {
  column: Column
  activeFilter?: Filter
  onApply: () => void
}) {
  const { addFilter, getUniqueValuesForColumn } = useDataTable()
  const [selectedValues, setSelectedValues] = useState<any[]>(activeFilter?.value || [])

  const uniqueValues = getUniqueValuesForColumn(column.id)

  const handleValueToggle = (value: any) => {
    setSelectedValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const handleApply = () => {
    if (selectedValues.length === 0) return

    if (activeFilter) {
      // Update existing filter
      addFilter({
        ...activeFilter,
        operator: "in",
        value: selectedValues,
      })
    } else {
      // Add new filter
      addFilter({
        id: `${column.id}-${Date.now()}`,
        columnId: column.id,
        operator: "in",
        value: selectedValues,
      })
    }

    onApply()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select values</Label>
        <div className="max-h-60 overflow-y-auto border rounded-md p-2">
          {uniqueValues.length === 0 ? (
            <div className="text-sm text-muted-foreground py-2 text-center">No values available</div>
          ) : (
            uniqueValues.map((value, index) => (
              <div key={index} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`${column.id}-${index}`}
                  checked={selectedValues.includes(value)}
                  onCheckedChange={() => handleValueToggle(value)}
                />
                <Label htmlFor={`${column.id}-${index}`} className="text-sm cursor-pointer">
                  {String(value)}
                </Label>
              </div>
            ))
          )}
        </div>
      </div>

      <Button onClick={handleApply} className="w-full">
        Apply Filter ({selectedValues.length} selected)
      </Button>
    </div>
  )
}

// Boolean Filter Component
function BooleanFilter({
  column,
  activeFilter,
  onApply,
}: {
  column: Column
  activeFilter?: Filter
  onApply: () => void
}) {
  const { addFilter } = useDataTable()
  const [value, setValue] = useState<string>(activeFilter?.operator || "isTrue")

  const handleApply = () => {
    if (activeFilter) {
      // Update existing filter
      addFilter({
        ...activeFilter,
        operator: value,
        value: value === "isTrue",
      })
    } else {
      // Add new filter
      addFilter({
        id: `${column.id}-${Date.now()}`,
        columnId: column.id,
        operator: value,
        value: value === "isTrue",
      })
    }

    onApply()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Value</Label>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="isTrue">True</SelectItem>
            <SelectItem value="isFalse">False</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleApply} className="w-full">
        Apply Filter
      </Button>
    </div>
  )
}
