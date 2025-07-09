import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Book,
    Code,
    Settings,
    Download,
    Search,
    Eye,
    CheckSquare,
    MoreHorizontal,
    Table,
    LayoutGrid,
    ArrowUpDown,
    FileText,
    Zap,
} from "lucide-react"

export default function DataTableDocs() {
    const [activeSection, setActiveSection] = useState("overview")

    const sections = [
        { id: "overview", title: "Overview", icon: Book },
        { id: "installation", title: "Installation", icon: Download },
        { id: "basic-usage", title: "Basic Usage", icon: Code },
        { id: "api-reference", title: "API Reference", icon: Settings },
        { id: "features", title: "Features", icon: Zap },
        { id: "examples", title: "Examples", icon: FileText },
    ]

    function OverviewSection() {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            A powerful and flexible data table component built with React and TypeScript
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            The DataTable component provides a comprehensive solution for displaying and interacting with tabular
                            data. It supports both client-side and server-side data processing, making it suitable for applications of
                            any scale.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="font-semibold">Key Features</h4>
                                <ul className="space-y-1 text-sm">
                                    <li>• Search and filtering</li>
                                    <li>• Sorting and pagination</li>
                                    <li>• Row selection</li>
                                    <li>• Bulk actions</li>
                                    <li>• Export functionality</li>
                                    <li>• Responsive design</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold">Built With</h4>
                                <ul className="space-y-1 text-sm">
                                    <li>• React 18+</li>
                                    <li>• TypeScript</li>
                                    <li>• Tailwind CSS</li>
                                    <li>• Radix UI</li>
                                    <li>• Lucide Icons</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Architecture</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">The DataTable is built using a modular architecture with the following components:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-semibold mb-2">Core Components</h4>
                                <ul className="text-sm space-y-1">
                                    <li>• DataTable</li>
                                    <li>• DataTableProvider</li>
                                    <li>• DataTableContext</li>
                                </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-semibold mb-2">UI Components</h4>
                                <ul className="text-sm space-y-1">
                                    <li>• DataTableHeader</li>
                                    <li>• DataTableBody</li>
                                    <li>• DataTablePagination</li>
                                    <li>• DataTableSearch</li>
                                </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-semibold mb-2">Feature Components</h4>
                                <ul className="text-sm space-y-1">
                                    <li>• DataTableFilters</li>
                                    <li>• DataTableExport</li>
                                    <li>• DataTableSelection</li>
                                    <li>• DataTableBulkActions</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    function InstallationSection() {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Installation</CardTitle>
                        <CardDescription>Get started with the DataTable component</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Dependencies</h4>
                            <div className="bg-muted p-4 rounded-lg">
                                <code className="text-sm">
                                    npm install react react-dom @radix-ui/react-checkbox @radix-ui/react-dropdown-menu
                                    <br />
                                    @radix-ui/react-select @radix-ui/react-popover @radix-ui/react-tabs
                                    <br />
                                    lucide-react date-fns xlsx class-variance-authority clsx tailwind-merge
                                </code>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Copy Components</h4>
                            <p className="text-sm text-muted-foreground mb-2">Copy the DataTable components to your project:</p>
                            <div className="bg-muted p-4 rounded-lg">
                                <code className="text-sm">
                                    components/
                                    <br />
                                    ├── data-table/
                                    <br />│ ├── data-table.tsx
                                    <br />│ ├── data-table-context.tsx
                                    <br />│ ├── data-table-search.tsx
                                    <br />│ ├── data-table-pagination.tsx
                                    <br />│ ├── data-table-export.tsx
                                    <br />│ └── ... (other components)
                                    <br />
                                    └── ui/ (shadcn/ui components)
                                </code>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Tailwind Configuration</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                                Ensure your Tailwind CSS is configured with the required utilities.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    function BasicUsageSection() {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Usage</CardTitle>
                        <CardDescription>Get started with a simple DataTable implementation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">1. Define Your Data</h4>
                            <div className="bg-muted p-4 rounded-lg">
                                <pre className="text-sm overflow-x-auto">
                                    {`const data = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active"
  },
  // ... more data
]`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">2. Define Your Columns</h4>
                            <div className="bg-muted p-4 rounded-lg">
                                <pre className="text-sm overflow-x-auto">
                                    {`const columns = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    filterType: "text"
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    filterType: "text"
  },
  {
    id: "role",
    header: "Role",
    accessorKey: "role",
    filterType: "select"
  }
]`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">3. Render the DataTable</h4>
                            <div className="bg-muted p-4 rounded-lg">
                                <pre className="text-sm overflow-x-auto">
                                    {`import { DataTable } from "@/components/data-table/data-table"

export function MyComponent() {
  return (
    <DataTable
      data={data}
      columns={columns}
      perPage={10}
    />
  )
}`}
                                </pre>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Server-side Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                                {`<DataTable
  data={serverData}
  columns={columns}
  perPage={10}
  total={totalRecords}
  serverSide={true}
  onSearch={(term) => fetchData({ search: term })}
  onPaginate={(page) => fetchData({ page })}
  onSort={(column, direction) => fetchData({ sort: { column, direction } })}
  onFilter={(filters) => fetchData({ filters })}
  loading={isLoading}
/>`}
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    function ApiReferenceSection() {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>DataTable Props</CardTitle>
                        <CardDescription>Complete API reference for the DataTable component</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Core Props */}
                            <div>
                                <h4 className="font-semibold mb-3">Core Props</h4>
                                <div className="space-y-3">
                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-mono">data</code>
                                            <Badge variant="destructive">Required</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Type:</strong> <code>any[]</code>
                                            <br />
                                            The array of data objects to display in the table.
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-mono">columns</code>
                                            <Badge variant="destructive">Required</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Type:</strong> <code>Column[]</code>
                                            <br />
                                            Array of column definitions that specify how data should be displayed.
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-mono">perPage</code>
                                            <Badge variant="secondary">Optional</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Type:</strong> <code>number</code>
                                            <br />
                                            <strong>Default:</strong> <code>10</code>
                                            <br />
                                            Number of rows to display per page.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Server-side Props */}
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-3">Server-side Props</h4>
                                <div className="space-y-3">
                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-mono">serverSide</code>
                                            <Badge variant="secondary">Optional</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Type:</strong> <code>boolean</code>
                                            <br />
                                            <strong>Default:</strong> <code>false</code>
                                            <br />
                                            Enable server-side processing for large datasets.
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-mono">total</code>
                                            <Badge variant="secondary">Optional</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Type:</strong> <code>number</code>
                                            <br />
                                            Total number of records (required for server-side pagination).
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-mono">onSearch</code>
                                            <Badge variant="secondary">Optional</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Type:</strong> <code>(term: string) {"=>"} void</code>
                                            <br />
                                            Callback fired when search term changes.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Props */}
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-3">Feature Props</h4>
                                <div className="space-y-3">
                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-mono">enableExport</code>
                                            <Badge variant="secondary">Optional</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Type:</strong> <code>boolean</code>
                                            <br />
                                            <strong>Default:</strong> <code>true</code>
                                            <br />
                                            Enable export functionality.
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-mono">bulkActions</code>
                                            <Badge variant="secondary">Optional</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Type:</strong> <code>BulkAction[]</code>
                                            <br />
                                            Array of bulk actions available for selected rows.
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-sm font-mono">enableViewToggle</code>
                                            <Badge variant="secondary">Optional</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Type:</strong> <code>boolean</code>
                                            <br />
                                            <strong>Default:</strong> <code>true</code>
                                            <br />
                                            Enable toggle between table and card views.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Column Definition</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                                {`interface Column {
  id: string                    // Unique identifier
  header: string               // Display header
  accessorKey: string          // Data property key
  visible?: boolean            // Column visibility
  filterType?: FilterType      // Filter type
  render?: CellRenderer        // Custom cell renderer
  enableSorting?: boolean      // Enable/disable sorting (default: true)
  enableFiltering?: boolean    // Enable/disable filtering (default: true)
}`}
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    function FeaturesSection() {
        const features = [
            {
                icon: Search,
                title: "Search & Filtering",
                description:
                    "Global search with column-specific filters supporting text, number, date, select, and boolean types.",
                details: [
                    "Debounced search input",
                    "Multiple filter operators",
                    "Filter persistence",
                    "Visual filter indicators",
                ],
            },
            {
                icon: ArrowUpDown,
                title: "Sorting",
                description: "Click column headers to sort data in ascending or descending order.",
                details: ["Multi-column sorting", "Custom sort functions", "Sort indicators", "Server-side sorting support"],
            },
            {
                icon: CheckSquare,
                title: "Row Selection",
                description: "Select individual rows or all rows with checkbox controls.",
                details: [
                    "Individual row selection",
                    "Select all functionality",
                    "Indeterminate state",
                    "Selection persistence",
                ],
            },
            {
                icon: MoreHorizontal,
                title: "Bulk Actions",
                description: "Perform actions on multiple selected rows simultaneously.",
                details: ["Pre-built actions", "Custom actions", "Action grouping", "Confirmation dialogs"],
            },
            {
                icon: Download,
                title: "Export",
                description: "Export data to CSV or Excel formats with customizable options.",
                details: ["CSV export", "Excel export", "Selected rows export", "Custom formatting"],
            },
            {
                icon: Eye,
                title: "Column Visibility",
                description: "Show or hide columns based on user preferences.",
                details: ["Toggle column visibility", "Persistent preferences", "Responsive hiding", "Minimum visible columns"],
            },
            {
                icon: Table,
                title: "Responsive Design",
                description: "Automatically adapts to different screen sizes with card view for mobile.",
                details: [
                    "Mobile-first design",
                    "Card view for small screens",
                    "Horizontal scrolling",
                    "Touch-friendly controls",
                ],
            },
            {
                icon: LayoutGrid,
                title: "View Modes",
                description: "Switch between table and card views for optimal data presentation.",
                details: ["Table view", "Card view", "Auto-switching", "View persistence"],
            },
        ]

        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Features Overview</CardTitle>
                        <CardDescription>Comprehensive feature set for modern data tables</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <feature.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-2">{feature.title}</h4>
                                            <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                                            <ul className="text-xs space-y-1">
                                                {feature.details.map((detail, i) => (
                                                    <li key={i} className="flex items-center">
                                                        <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    function ExamplesSection() {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Usage Examples</CardTitle>
                        <CardDescription>Common patterns and advanced use cases</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="basic">Basic</TabsTrigger>
                                <TabsTrigger value="custom-renderers">Renderers</TabsTrigger>
                                <TabsTrigger value="bulk-actions">Bulk Actions</TabsTrigger>
                                <TabsTrigger value="column-config">Column Config</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4">
                                <h4 className="font-semibold">Basic DataTable</h4>
                                <div className="bg-muted p-4 rounded-lg">
                                    <pre className="text-sm overflow-x-auto">
                                        {`import { DataTable } from "@/components/data-table/data-table"

const data = [
  { id: 1, name: "John", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane", email: "jane@example.com", role: "User" }
]

const columns = [
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "email", header: "Email", accessorKey: "email" },
  { id: "role", header: "Role", accessorKey: "role" }
]

export function BasicExample() {
  return (
    <DataTable
      data={data}
      columns={columns}
      perPage={10}
    />
  )
}`}
                                    </pre>
                                </div>
                            </TabsContent>

                            <TabsContent value="custom-renderers" className="space-y-4">
                                <h4 className="font-semibold">Custom Cell Renderers</h4>
                                <div className="bg-muted p-4 rounded-lg">
                                    <pre className="text-sm overflow-x-auto">
                                        {`import { StatusBadgeRenderer, DateRenderer } from "@/components/data-table/cell-renderers"

const columns = [
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    render: StatusBadgeRenderer
  },
  {
    id: "createdAt",
    header: "Created",
    accessorKey: "createdAt",
    render: DateRenderer
  },
  {
    id: "custom",
    header: "Custom",
    accessorKey: "value",
    render: (value, row) => (
      <div className="flex items-center">
        <span className="font-medium">{value}</span>
        {row.isImportant && <Badge>Important</Badge>}
      </div>
    )
  }
]`}
                                    </pre>
                                </div>
                            </TabsContent>

                            <TabsContent value="bulk-actions" className="space-y-4">
                                <h4 className="font-semibold">Bulk Actions Configuration</h4>
                                <div className="bg-muted p-4 rounded-lg">
                                    <pre className="text-sm overflow-x-auto">
                                        {`import { createBulkActions } from "@/components/data-table/data-table-bulk-actions"

const bulkActions = [
  createBulkActions.exportCSV(columns, "users"),
  createBulkActions.exportExcel(columns, "users"),
  createBulkActions.sendEmail((rows) => {
    console.log("Sending email to:", rows)
  }),
  createBulkActions.delete((rows) => {
    console.log("Deleting:", rows)
  }),
  createBulkActions.custom(
    "archive",
    "Archive Selected",
    (rows) => console.log("Archiving:", rows),
    { icon: Archive, variant: "secondary" }
  )
]

<DataTable
  data={data}
  columns={columns}
  bulkActions={bulkActions}
/>`}
                                    </pre>
                                </div>
                            </TabsContent>

                            <TabsContent value="column-config" className="space-y-4">
                                <h4 className="font-semibold">Column Configuration</h4>
                                <div className="bg-muted p-4 rounded-lg">
                                    <pre className="text-sm overflow-x-auto">
                                        {`const columns = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    filterType: "text"
  },
  {
    id: "stock_status",
    header: "Stock",
    accessorKey: "stock_quantity",
    enableSorting: false,        // Disable sorting
    enableFiltering: false,      // Disable filtering
    render: (value) => (
      <Badge variant={value > 0 ? "default" : "destructive"}>
        {value > 0 ? "In Stock" : "Out of Stock"}
      </Badge>
    )
  },
  {
    id: "created_at",
    header: "Created",
    accessorKey: "created_at",
    enableSorting: false,        // Disable sorting for dates
    enableFiltering: false,      // Disable filtering for dates
    render: (value) => new Date(value).toLocaleDateString()
  },
  {
    id: "actions",
    header: "",
    accessorKey: "id",
    enableSorting: false,        // Actions column shouldn't be sortable
    enableFiltering: false,      // Actions column shouldn't be filterable
    render: (value, row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editRow(row)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteRow(row)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
]`}
                                    </pre>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Best Practices</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-green-600">✅ Do</h4>
                                <ul className="space-y-2 text-sm">
                                    <li>• Use server-side processing for large datasets ({">"}1000 rows)</li>
                                    <li>• Implement proper loading states</li>
                                    <li>• Provide meaningful column headers</li>
                                    <li>• Use appropriate filter types for each column</li>
                                    <li>• Implement error handling for server requests</li>
                                    <li>• Use memoization for expensive render functions</li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-red-600">❌ Don't</h4>
                                <ul className="space-y-2 text-sm">
                                    <li>• Load all data client-side for large datasets</li>
                                    <li>• Forget to handle empty states</li>
                                    <li>• Use complex objects as row IDs</li>
                                    <li>• Ignore accessibility requirements</li>
                                    <li>• Skip error boundaries</li>
                                    <li>• Render heavy components in every cell</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">DataTable Documentation</h1>
                <p className="text-xl text-muted-foreground">
                    A comprehensive, feature-rich data table component for React applications
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Navigation</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <Button
                                        key={section.id}
                                        variant={activeSection === section.id ? "secondary" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => setActiveSection(section.id)}
                                    >
                                        <section.icon className="mr-2 h-4 w-4" />
                                        {section.title}
                                    </Button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <ScrollArea>
                        {activeSection === "overview" && <OverviewSection />}
                        {activeSection === "installation" && <InstallationSection />}
                        {activeSection === "basic-usage" && <BasicUsageSection />}
                        {activeSection === "api-reference" && <ApiReferenceSection />}
                        {activeSection === "features" && <FeaturesSection />}
                        {activeSection === "examples" && <ExamplesSection />}
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
