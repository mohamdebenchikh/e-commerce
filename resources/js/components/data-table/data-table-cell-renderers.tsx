/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"

// Status Badge Renderer
export const StatusBadgeRenderer = (value: string) => {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "pending":
        return "outline"
      case "suspended":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return <Badge variant={getStatusVariant(value)}>{value}</Badge>
}

// Role Badge Renderer
export const RoleBadgeRenderer = (value: string) => {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "editor":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "user":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return <Badge className={getRoleColor(value)}>{value}</Badge>
}

// Date Renderer
export const DateRenderer = (value: string | Date) => {
  if (!value) return null

  try {
    const date = typeof value === "string" ? new Date(value) : value
    return <span className="text-sm">{format(date, "MMM dd, yyyy")}</span>
  } catch {
    return <span className="text-sm text-muted-foreground">Invalid date</span>
  }
}

// Currency Renderer
export const CurrencyRenderer = (value: number, currency = "USD") => {
  if (value == null) return null

  return (
    <span className="font-medium">
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(value)}
    </span>
  )
}

// Avatar Renderer
export const AvatarRenderer = (value: any, row: any) => {
  const name = row.name || row.firstName || row.username || "User"
  const email = row.email || ""
  const avatarUrl = value || row.avatar || row.profileImage

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="text-xs">
          {name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        {email && <span className="text-xs text-muted-foreground">{email}</span>}
      </div>
    </div>
  )
}

// Link Renderer
export const LinkRenderer = (value: string, href?: string) => {
  if (!value) return null

  return (
    <a
      href={href || `mailto:${value}`}
      className="text-blue-600 hover:text-blue-800 hover:underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {value}
    </a>
  )
}

// Boolean Renderer
export const BooleanRenderer = (value: boolean) => {
  return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
}

// Progress Bar Renderer
export const ProgressRenderer = (value: number) => {
  if (value == null) return null

  const percentage = Math.min(Math.max(value, 0), 100)

  return (
    <div className="flex items-center gap-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-xs text-muted-foreground min-w-[3rem]">{percentage}%</span>
    </div>
  )
}

// Actions Renderer
interface ActionsRendererProps {
  onView?: (row: any) => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
}

export const ActionsRenderer = ({ onView, onEdit, onDelete }: ActionsRendererProps) => {
  return (value: any, row: any) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={() => onView(row)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(row)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={() => onDelete(row)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Truncate Text Renderer
export const TruncateRenderer = (maxLength = 50) => {
  return (value: string) => {
    if (!value) return null

    if (value.length <= maxLength) return value

    return <span title={value}>{value.substring(0, maxLength)}...</span>
  }
}

// Number Formatter
export const NumberRenderer = (value: number, options?: Intl.NumberFormatOptions) => {
  if (value == null) return null

  return <span className="font-mono">{new Intl.NumberFormat("en-US", options).format(value)}</span>
}
