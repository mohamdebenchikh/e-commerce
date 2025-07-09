/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "@/components/data-table/data-table"
import DataTableDocs from "@/components/data-table/data-table-docs"
import { useCallback, useState, useEffect } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createBulkActions, type BulkAction } from "@/components/data-table/data-table-bulk-actions"
import {
  StatusBadgeRenderer,
  RoleBadgeRenderer,
  DateRenderer,
  CurrencyRenderer,
  AvatarRenderer,
  LinkRenderer,
  BooleanRenderer,
  ProgressRenderer,
  ActionsRenderer,
  TruncateRenderer,
} from "@/components/data-table/data-table-cell-renderers"
import type { Filter } from "@/components/data-table/data-table-context"
import { FileText } from "lucide-react"

// Full dataset for client-side and server-side filtering
const fullData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 75000,
    progress: 85,
    isVerified: true,
    lastLogin: new Date("2024-01-15"),
    description: "Senior administrator with full system access and management capabilities",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 55000,
    progress: 92,
    isVerified: true,
    lastLogin: new Date("2024-01-14"),
    description: "Regular user with standard access permissions",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 48000,
    progress: 45,
    isVerified: false,
    lastLogin: new Date("2024-01-10"),
    description: "User account currently inactive pending verification",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Editor",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 62000,
    progress: 78,
    isVerified: true,
    lastLogin: new Date("2024-01-16"),
    description: "Content editor with publishing and moderation rights",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "User",
    status: "Pending",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 52000,
    progress: 60,
    isVerified: false,
    lastLogin: new Date("2024-01-12"),
    description: "New user account awaiting approval and setup completion",
  },
  {
    id: 6,
    name: "Diana Miller",
    email: "diana@example.com",
    role: "Admin",
    status: "Inactive",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 68000,
    progress: 73,
    isVerified: true,
    lastLogin: new Date("2024-01-11"),
    description: "System administrator with database and server management rights",
  },
  {
    id: 7,
    name: "Edward Davis",
    email: "edward@example.com",
    role: "User",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 51000,
    progress: 88,
    isVerified: true,
    lastLogin: new Date("2024-01-17"),
    description: "Active user with standard permissions and good engagement",
  },
  {
    id: 8,
    name: "Fiona Clark",
    email: "fiona@example.com",
    role: "Editor",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 59000,
    progress: 95,
    isVerified: true,
    lastLogin: new Date("2024-01-18"),
    description: "Senior content editor with publishing and review capabilities",
  },
  {
    id: 9,
    name: "George White",
    email: "george@example.com",
    role: "User",
    status: "Inactive",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 49000,
    progress: 35,
    isVerified: false,
    lastLogin: new Date("2024-01-05"),
    description: "User account with limited access due to inactivity",
  },
  {
    id: 10,
    name: "Hannah Green",
    email: "hannah@example.com",
    role: "User",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 53000,
    progress: 82,
    isVerified: true,
    lastLogin: new Date("2024-01-19"),
    description: "Regular user with standard permissions and active status",
  },
  {
    id: 11,
    name: "Ian Black",
    email: "ian@example.com",
    role: "Admin",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 72000,
    progress: 91,
    isVerified: true,
    lastLogin: new Date("2024-01-20"),
    description: "Technical administrator with system configuration access",
  },
  {
    id: 12,
    name: "Julia Reed",
    email: "julia@example.com",
    role: "Editor",
    status: "Pending",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 58000,
    progress: 67,
    isVerified: false,
    lastLogin: new Date("2024-01-08"),
    description: "Content editor awaiting additional permissions approval",
  },
  {
    id: 13,
    name: "Kevin Moore",
    email: "kevin@example.com",
    role: "User",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 54000,
    progress: 79,
    isVerified: true,
    lastLogin: new Date("2024-01-21"),
    description: "Active user with good engagement metrics",
  },
  {
    id: 14,
    name: "Laura Taylor",
    email: "laura@example.com",
    role: "User",
    status: "Inactive",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 50000,
    progress: 42,
    isVerified: true,
    lastLogin: new Date("2024-01-03"),
    description: "User account currently inactive due to extended absence",
  },
  {
    id: 15,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Admin",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
    salary: 78000,
    progress: 94,
    isVerified: true,
    lastLogin: new Date("2024-01-22"),
    description: "Senior system administrator with full access rights",
  },
]

// Columns with custom renderers and filter types
const columns = [
  {
    id: "user",
    header: "User",
    accessorKey: "avatar",
    render: AvatarRenderer,
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    render: (value: string) => LinkRenderer(value),
    filterType: "text",
  },
  {
    id: "role",
    header: "Role",
    accessorKey: "role",
    render: RoleBadgeRenderer,
    filterType: "select",
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    render: StatusBadgeRenderer,
    filterType: "select",
  },
  {
    id: "salary",
    header: "Salary",
    accessorKey: "salary",
    render: (value: number) => CurrencyRenderer(value),
    filterType: "number",
  },
  {
    id: "progress",
    header: "Progress",
    accessorKey: "progress",
    render: ProgressRenderer,
    filterType: "number",
  },
  {
    id: "verified",
    header: "Verified",
    accessorKey: "isVerified",
    render: BooleanRenderer,
    filterType: "boolean",
  },
  {
    id: "lastLogin",
    header: "Last Login",
    accessorKey: "lastLogin",
    render: DateRenderer,
    filterType: "date",
  },
  {
    id: "description",
    header: "Description",
    accessorKey: "description",
    render: TruncateRenderer(60),
    filterType: "text",
  },
  {
    id: "actions",
    header: "Actions",
    accessorKey: "id",
    render: ActionsRenderer({
      onView: (row: { name: any }) => {
        toast(`Viewing details for ${row.name}`)
      },
      onEdit: (row: { name: any }) => {
        toast(`Editing ${row.name}`)
      },
      onDelete: (row: { name: any }) => {
        toast.error(`Would delete ${row.name}`)
      },
    }),
  },
]

export default function Home() {
  // Client-side example
  const handleRowsSelected = useCallback((rows: any[]) => {
    console.log("Selected rows:", rows)
  }, [])

  const handleDelete = useCallback((rows: any[]) => {
    toast(`${rows.length} rows would be deleted in a real application.`)
    console.log("Rows to delete:", rows)
  }, [])

  // Export handler
  const handleExport = useCallback((data: any[], format: "csv" | "excel", options: any) => {
    toast(`Exporting ${data.length} rows as ${format.toUpperCase()}...`,
    )
    console.log("Export:", { data, format, options })
  }, [])

  // Bulk action handlers
  const handleBulkEmail = useCallback((rows: any[]) => {
    toast.success(`Sending email to ${rows.length} users...`,
    )
    console.log("Sending email to rows:", rows)
  }, [])

  const handleBulkActivate = useCallback((rows: any[]) => {
    toast(`${rows.length} users have been activated.`)
    console.log("Activating rows:", rows)
  }, [])

  const handleBulkDeactivate = useCallback((rows: any[]) => {
    toast(`${rows.length} users have been deactivated.`)
    console.log("Deactivating rows:", rows)
  }, [])

  const handleBulkArchive = useCallback((rows: any[]) => {
    toast(`${rows.length} users have been archived.`)
    console.log("Archiving rows:", rows)
  }, [])

  const handleGenerateReport = useCallback((rows: any[]) => {
    toast(`Generating report for ${rows.length} users...`)
    console.log("Generating report for rows:", rows)
  }, [])

  // Define bulk actions with export functionality
  const bulkActions: BulkAction[] = [
    createBulkActions.exportCSV(columns, "selected-users"),
    createBulkActions.exportExcel(columns, "selected-users"),
    createBulkActions.sendEmail(handleBulkEmail),
    createBulkActions.custom("report", "Generate Report", handleGenerateReport, {
      icon: FileText,
      separator: true,
    }),
    createBulkActions.activate(handleBulkActivate),
    createBulkActions.deactivate(handleBulkDeactivate),
    createBulkActions.archive(handleBulkArchive),
    createBulkActions.delete(handleDelete),
  ]

  // Server-side example state
  const [serverData, setServerData] = useState<any[]>([])
  const [serverTotal, setServerTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSort, setCurrentSort] = useState({ column: "", direction: "asc" as "asc" | "desc" })
  const [currentSearch, setCurrentSearch] = useState("")
  const [currentFilters, setCurrentFilters] = useState<Filter[]>([])
  const perPage = 5

  // Simulate API call with filtering, sorting, and pagination
  const fetchData = useCallback(
    async (page: number, sort: { column: string; direction: "asc" | "desc" }, search: string, filters: Filter[]) => {
      setLoading(true)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Filter data based on search term
      let filteredData = [...fullData]

      // Apply search
      if (search) {
        filteredData = filteredData.filter((item) =>
          Object.values(item).some((val) => {
            if (val === null || val === undefined) return false
            return String(val).toLowerCase().includes(search.toLowerCase())
          }),
        )
      }

      // Apply filters
      if (filters.length > 0) {
        filteredData = filteredData.filter((row) => {
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

      // Apply sorting
      if (sort.column) {
        filteredData.sort((a, b) => {
          const aValue = a[sort.column]
          const bValue = b[sort.column]

          if (aValue == null) return 1
          if (bValue == null) return -1

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sort.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
          }

          return sort.direction === "asc" ? aValue - bValue : bValue - aValue
        })
      }

      // Get total count
      const total = filteredData.length

      // Apply pagination
      const startIndex = (page - 1) * perPage
      const paginatedData = filteredData.slice(startIndex, startIndex + perPage)

      // Update state
      setServerData(paginatedData)
      setServerTotal(total)
      setLoading(false)

      // Log server-side operations for demonstration
      console.log("Server-side operation:", {
        page,
        sort,
        search,
        filters,
        totalResults: total,
        returnedResults: paginatedData.length,
      })
    },
    [],
  )

  // Initial data fetch
  useEffect(() => {
    fetchData(currentPage, currentSort, currentSearch, currentFilters)
  }, [fetchData, currentPage, currentSort, currentSearch, currentFilters])

  // Server-side handlers
  const handleServerPaginate = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleServerSort = useCallback((column: string, direction: "asc" | "desc") => {
    setCurrentSort({ column, direction })
  }, [])

  const handleServerSearch = useCallback((term: string) => {
    setCurrentSearch(term)
    setCurrentPage(1) // Reset to first page on search
  }, [])

  const handleServerFilter = useCallback((filters: Filter[]) => {
    setCurrentFilters(filters)
    setCurrentPage(1) // Reset to first page on filter change
  }, [])

  return (
    <main className="container mx-auto py-10 px-8 space-y-10">
      <Tabs defaultValue="documentation">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="export-demo">Export Demo</TabsTrigger>
          <TabsTrigger value="bulk-actions">Bulk Actions</TabsTrigger>
          <TabsTrigger value="client-side">Client-side</TabsTrigger>
          <TabsTrigger value="server-side">Server-side</TabsTrigger>
        </TabsList>

        <TabsContent value="documentation">
          <DataTableDocs />
        </TabsContent>

        <TabsContent value="export-demo">
          <div>
            <h2 className="text-2xl font-bold mb-4">DataTable with Export Functionality</h2>
            <p className="text-muted-foreground mb-6">
              This DataTable includes comprehensive export functionality. Use the Export button to download all data or
              select specific rows and use bulk actions to export only selected data. Supports both CSV and Excel
              formats.
            </p>
            <DataTable
              data={fullData}
              columns={columns}
              perPage={8}
              onRowsSelected={handleRowsSelected}
              onExport={handleExport}
              bulkActions={bulkActions}
              enableExport={true}
              exportFilename="users-export"
              enableViewToggle={true}
            />

            <div className="mt-8 p-4 border rounded-md bg-muted/30">
              <h3 className="text-lg font-medium mb-2">Export Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Export All Data</p>
                  <p className="text-sm text-muted-foreground">
                    Export all filtered data (respects current search and filters)
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Export Selected</p>
                  <p className="text-sm text-muted-foreground">Export only the rows you've selected</p>
                </div>
                <div>
                  <p className="text-sm font-medium">CSV Format</p>
                  <p className="text-sm text-muted-foreground">Comma-separated values for universal compatibility</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Excel Format</p>
                  <p className="text-sm text-muted-foreground">Native Excel format with auto-sized columns</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data Processing</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically formats dates, booleans, and handles nulls
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Column Filtering</p>
                  <p className="text-sm text-muted-foreground">
                    Excludes action columns and respects visibility settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bulk-actions">
          <div>
            <h2 className="text-2xl font-bold mb-4">DataTable with Bulk Actions</h2>
            <p className="text-muted-foreground mb-6">
              Select multiple rows to see the bulk actions dropdown. This example includes export functionality within
              bulk actions along with other common operations.
            </p>
            <DataTable
              data={fullData}
              columns={columns}
              perPage={8}
              onRowsSelected={handleRowsSelected}
              bulkActions={bulkActions}
              enableViewToggle={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="client-side">
          <div>
            <h2 className="text-2xl font-bold mb-4">Client-side DataTable</h2>
            <p className="text-muted-foreground mb-6">
              This DataTable processes all operations (filtering, sorting, pagination) on the client side.
            </p>
            <DataTable
              data={fullData}
              columns={columns}
              perPage={5}
              onRowsSelected={handleRowsSelected}
              bulkActions={bulkActions}
              enableViewToggle={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="server-side">
          <div>
            <h2 className="text-2xl font-bold mb-4">Server-side DataTable</h2>
            <p className="text-muted-foreground mb-6">
              This DataTable simulates server-side processing with API calls for filtering, sorting, and pagination.
              Notice the loading indicator when operations are performed.
            </p>
            <DataTable
              data={serverData}
              columns={columns}
              perPage={perPage}
              total={serverTotal}
              serverSide={true}
              onSearch={handleServerSearch}
              onPaginate={handleServerPaginate}
              onSort={handleServerSort}
              onFilter={handleServerFilter}
              onRowsSelected={handleRowsSelected}
              bulkActions={bulkActions}
              enableViewToggle={true}
              loading={loading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
