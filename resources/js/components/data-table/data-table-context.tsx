/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

/**
 * Column Definition Interface
 *
 * @interface Column
 */
export interface Column {
  /** Unique identifier for the column */
  id: string
  /** Display header text */
  header: string
  /** Key to access data from row object */
  accessorKey: string
  /** Whether column is visible by default @default true */
  visible?: boolean
  /** Custom cell renderer function */
  render?: (value: any, row: any, column: Column) => React.ReactNode
  /** Filter type for this column */
  filterType?: "text" | "number" | "date" | "select" | "boolean"
  /** Whether sorting is enabled for this column @default true */
  enableSorting?: boolean
  /** Whether filtering is enabled for this column @default true */
  enableFiltering?: boolean
}

/**
 * Filter Definition Interface
 *
 * @interface Filter
 */
export interface Filter {
  /** Unique filter identifier */
  id: string
  /** Column ID this filter applies to */
  columnId: string
  /** Filter operator (contains, equals, >, <, etc.) */
  operator: string
  /** Primary filter value */
  value: any
  /** Additional value for range filters */
  additionalValue?: any
}

/**
 * DataTable Context Interface
 * Provides all state and methods for DataTable functionality
 */
interface DataTableContextProps {
  // Core data
  data: any[]
  columns: Column[]

  // Search functionality
  searchTerm: string
  setSearchTerm: (term: string) => void

  // Sorting functionality
  sortColumn: string | null
  sortDirection: "asc" | "desc" | null
  setSorting: (column: string, direction: "asc" | "desc") => void

  // Column visibility
  visibleColumns: string[]
  toggleColumnVisibility: (columnId: string) => void

  // Pagination
  currentPage: number
  setCurrentPage: (page: number) => void
  perPage: number
  total: number

  // Server-side processing
  serverSide: boolean
  onSearch?: (term: string) => void
  onPaginate?: (page: number) => void
  onSort?: (column: string, direction: "asc" | "desc") => void

  // Row selection
  selectedRows: Record<string | number, boolean>
  toggleRowSelection: (rowId: string | number) => void
  toggleAllRows: (checked: boolean) => void
  clearRowSelection: () => void
  getSelectedRows: () => any[]
  isAllRowsSelected: boolean
  isIndeterminate: boolean
  rowIdField: string

  // View mode
  viewMode: "table" | "cards"
  setViewMode: (mode: "table" | "cards") => void

  // Filters
  filters: Filter[]
  addFilter: (filter: Filter) => void
  updateFilter: (filterId: string, filter: Partial<Filter>) => void
  removeFilter: (filterId: string) => void
  clearFilters: () => void
  getUniqueValuesForColumn: (columnId: string) => any[]
  onFilter?: (filters: Filter[]) => void
}

const DataTableContext = createContext<DataTableContextProps | undefined>(undefined)

/**
 * Hook to access DataTable context
 * @throws Error if used outside DataTableProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useDataTable = () => {
  const context = useContext(DataTableContext)
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider")
  }
  return context
}

/**
 * DataTable Provider Props Interface
 */
interface DataTableProviderProps {
  children: ReactNode
  data: any[]
  columns: Column[]
  perPage?: number
  total?: number
  serverSide?: boolean
  onSearch?: (term: string) => void
  onPaginate?: (page: number) => void
  onSort?: (column: string, direction: "asc" | "desc") => void
  onFilter?: (filters: Filter[]) => void
  rowIdField?: string
  onRowsSelected?: (rows: any[]) => void
  defaultViewMode?: "table" | "cards"
}

/**
 * DataTable Provider Component
 * Manages all DataTable state and provides context to child components
 */
export const DataTableProvider: React.FC<DataTableProviderProps> = ({
  children,
  data,
  columns,
  perPage = 10,
  total = 0,
  serverSide = false,
  onSearch,
  onPaginate,
  onSort,
  onFilter,
  rowIdField = "id",
  onRowsSelected,
  defaultViewMode = "table",
}) => {
  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.filter((col) => col.visible !== false).map((col) => col.id),
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({})
  const [viewMode, setViewMode] = useState<"table" | "cards">(defaultViewMode)
  const [filters, setFilters] = useState<Filter[]>([])

  // Apply filters to data (client-side only)
  const applyFilters = (data: any[]) => {
    if (filters.length === 0) return data

    return data.filter((row) => {
      return filters.every((filter) => {
        const column = columns.find((col) => col.id === filter.columnId)
        if (!column) return true

        const value = row[column.accessorKey]

        switch (filter.operator) {
          // Text operators
          case "contains":
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
          case "equals":
            return String(value).toLowerCase() === String(filter.value).toLowerCase()
          case "startsWith":
            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase())
          case "endsWith":
            return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase())

          // Number operators
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

          // Date operators
          case "dateEquals":
            return new Date(value).setHours(0, 0, 0, 0) === new Date(filter.value).setHours(0, 0, 0, 0)
          case "dateBefore":
            return new Date(value) < new Date(filter.value)
          case "dateAfter":
            return new Date(value) > new Date(filter.value)
          case "dateBetween":
            return new Date(value) >= new Date(filter.value) && new Date(value) <= new Date(filter.additionalValue)

          // Boolean operators
          case "isTrue":
            return Boolean(value) === true
          case "isFalse":
            return Boolean(value) === false

          // Select operators
          case "in":
            return filter.value.includes(value)

          default:
            return true
        }
      })
    })
  }

  // Filter data based on search term and filters (client-side only)
  const filteredData = serverSide
    ? data
    : applyFilters(
        data.filter((item) => {
          if (!searchTerm) return true

          return columns.some((column) => {
            const value = item[column.accessorKey]
            if (value == null) return false
            return String(value).toLowerCase().includes(searchTerm.toLowerCase())
          })
        }),
      )

  // Get current page data
  const getCurrentPageData = () => {
    if (serverSide) return data

    // Sort data (client-side only)
    const sortedData =
      !sortColumn || !sortDirection
        ? filteredData
        : [...filteredData].sort((a, b) => {
            const aValue = a[sortColumn]
            const bValue = b[sortColumn]

            if (aValue == null) return 1
            if (bValue == null) return -1

            if (typeof aValue === "string" && typeof bValue === "string") {
              return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }

            return sortDirection === "asc" ? aValue - bValue : bValue - aValue
          })

    // Paginate data
    return sortedData.slice((currentPage - 1) * perPage, currentPage * perPage)
  }

  const currentPageData = getCurrentPageData()

  // Check if all rows on current page are selected
  const isAllRowsSelected = currentPageData.length > 0 && currentPageData.every((row) => selectedRows[row[rowIdField]])

  // Check if some (but not all) rows on current page are selected
  const isIndeterminate = !isAllRowsSelected && currentPageData.some((row) => selectedRows[row[rowIdField]])

  const handleSearchTerm = (term: string) => {
    if (term !== searchTerm) {
      setSearchTerm(term)
      setCurrentPage(1) // Reset to first page on search

      if (serverSide && onSearch) {
        // Call onSearch outside of the render cycle using setTimeout
        setTimeout(() => {
          onSearch(term)
        }, 0)
      }
    }
  }

  const handleSorting = (column: string, direction: "asc" | "desc") => {
    if (column !== sortColumn || direction !== sortDirection) {
      setSortColumn(column)
      setSortDirection(direction)

      if (serverSide && onSort) {
        // Call onSort outside of the render cycle using setTimeout
        setTimeout(() => {
          onSort(column, direction)
        }, 0)
      }
    }
  }

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page)

      if (serverSide && onPaginate) {
        // Call onPaginate outside of the render cycle using setTimeout
        setTimeout(() => {
          onPaginate(page)
        }, 0)
      }
    }
  }

  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId)
      } else {
        return [...prev, columnId]
      }
    })
  }

  // Row selection methods
  const toggleRowSelection = (rowId: string | number) => {
    setSelectedRows((prev) => {
      const newSelectedRows = { ...prev, [rowId]: !prev[rowId] }

      // Notify parent component about selection change
      if (onRowsSelected) {
        setTimeout(() => {
          const selectedItems = data.filter((row) => newSelectedRows[row[rowIdField]])
          onRowsSelected(selectedItems)
        }, 0)
      }

      return newSelectedRows
    })
  }

  const toggleAllRows = (checked: boolean) => {
    const newSelectedRows = { ...selectedRows }

    // Update selection state for all rows on current page
    currentPageData.forEach((row) => {
      newSelectedRows[row[rowIdField]] = checked
    })

    setSelectedRows(newSelectedRows)

    // Notify parent component about selection change
    if (onRowsSelected) {
      setTimeout(() => {
        const selectedItems = data.filter((row) => newSelectedRows[row[rowIdField]])
        onRowsSelected(selectedItems)
      }, 0)
    }
  }

  const clearRowSelection = () => {
    setSelectedRows({})

    // Notify parent component about selection change
    if (onRowsSelected) {
      setTimeout(() => {
        onRowsSelected([])
      }, 0)
    }
  }

  const getSelectedRows = () => {
    return data.filter((row) => selectedRows[row[rowIdField]])
  }

  // Filter methods
  const addFilter = (filter: Filter) => {
    const newFilters = [...filters, { ...filter, id: `${filter.columnId}-${Date.now()}` }]
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page on filter change

    if (serverSide && onFilter) {
      setTimeout(() => {
        onFilter(newFilters)
      }, 0)
    }
  }

  const updateFilter = (filterId: string, updatedFilter: Partial<Filter>) => {
    const newFilters = filters.map((filter) => (filter.id === filterId ? { ...filter, ...updatedFilter } : filter))
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page on filter change

    if (serverSide && onFilter) {
      setTimeout(() => {
        onFilter(newFilters)
      }, 0)
    }
  }

  const removeFilter = (filterId: string) => {
    const newFilters = filters.filter((filter) => filter.id !== filterId)
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page on filter change

    if (serverSide && onFilter) {
      setTimeout(() => {
        onFilter(newFilters)
      }, 0)
    }
  }

  const clearFilters = () => {
    setFilters([])
    setCurrentPage(1) // Reset to first page on filter change

    if (serverSide && onFilter) {
      setTimeout(() => {
        onFilter([])
      }, 0)
    }
  }

  // Get unique values for a column (for select filters)
  const getUniqueValuesForColumn = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId)
    if (!column) return []

    const values = data.map((row) => row[column.accessorKey])
    return [...new Set(values)].filter((value) => value != null)
  }

  return (
    <DataTableContext.Provider
      value={{
        data,
        columns,
        searchTerm,
        setSearchTerm: handleSearchTerm,
        sortColumn,
        sortDirection,
        setSorting: handleSorting,
        visibleColumns,
        toggleColumnVisibility,
        currentPage,
        setCurrentPage: handlePageChange,
        perPage,
        total: serverSide ? total : filteredData.length,
        serverSide,
        onSearch,
        onPaginate,
        onSort,
        // Row selection
        selectedRows,
        toggleRowSelection,
        toggleAllRows,
        clearRowSelection,
        getSelectedRows,
        isAllRowsSelected,
        isIndeterminate,
        rowIdField,
        // View mode
        viewMode,
        setViewMode,
        // Filters
        filters,
        addFilter,
        updateFilter,
        removeFilter,
        clearFilters,
        getUniqueValuesForColumn,
        onFilter,
      }}
    >
      {children}
    </DataTableContext.Provider>
  )
}
