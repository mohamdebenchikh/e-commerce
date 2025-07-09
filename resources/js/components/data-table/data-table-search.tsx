import type React from "react"

import { useDataTable } from "./data-table-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export function DataTableSearch() {
  const { setSearchTerm } = useDataTable()
  const [value, setValue] = useState("")
  const debouncedValue = useDebounce(value, 300)

  // Use useCallback to prevent recreation of this function on every render
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [])

  // Only update search term when debounced value changes
  useEffect(() => {
    setSearchTerm(debouncedValue)
  }, [debouncedValue, setSearchTerm])

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search..." value={value} onChange={handleSearchChange} className="pl-8 max-w-sm" />
    </div>
  )
}
