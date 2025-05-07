"use client"

import { Search, X } from "lucide-react"
import { useContext, useEffect, useState } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { authLocalization } from "../../lib/auth-localization"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { CreateUserDialog } from "./create-user-dialog"
import { UserActionMenu } from "./user-action-menu"

export type AdminPageClassNames = {
  base?: string
  card?: string
  header?: string
  title?: string
  searchContainer?: string
  searchInput?: string
  table?: string
  tableHeader?: string
  tableRow?: string
  tableCell?: string
  statusBadge?: string
  actionButton?: string
  pagination?: string
  dialog?: {
    content?: string
    header?: string
    footer?: string
  }
}

export interface AdminPageProps {
  className?: string
  classNames?: AdminPageClassNames
  title?: string
  pageSize?: number
}

type User = {
  id: string
  name: string
  email: string
  role: string | string[]
  verified: boolean
  status: "active" | "banned"
  createdAt: string
}

type SortDirection = "asc" | "desc"
type SortField = "name" | "email" | "role" | "createdAt"

export function AdminPage({
  className,
  classNames,
  title = authLocalization.users,
  pageSize = 10,
}: AdminPageProps) {
  const { authClient, toast: renderToast } = useContext(AuthUIContext)
  const [users, setUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [filterRole, setFilterRole] = useState<string | null>(null)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const query: any = {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        sortBy,
        sortDirection,
      }

      if (searchQuery) {
        query.searchField = "email"
        query.searchOperator = "contains"
        query.searchValue = searchQuery
      }

      if (filterRole) {
        query.filterField = "role"
        query.filterOperator = "eq"
        query.filterValue = filterRole
      }

      const response = await authClient.admin.listUsers({ query })
      
      // Map the response to our User type
      const formattedUsers = response.users.map((user: any) => ({
        id: user.id,
        name: user.name || "N/A",
        email: user.email,
        role: user.role || "user",
        verified: !!user.emailVerified,
        status: user.banned ? "banned" : "active",
        createdAt: new Date(user.createdAt).toLocaleDateString(),
      }))
      
      setUsers(formattedUsers)
      setTotalUsers(response.total)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      renderToast({
        variant: "error",
        message: authLocalization.fetchUsersError,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchQuery, sortBy, sortDirection, filterRole])

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchUsers()
  }

  const clearSearch = () => {
    setSearchQuery("")
    setCurrentPage(1)
  }

  const handleBanUser = async (userId: string) => {
    try {
      await authClient.admin.banUser({ userId })
      renderToast({
        variant: "success",
        message: authLocalization.userBannedSuccess,
      })
      fetchUsers()
    } catch (error) {
      console.error("Failed to ban user:", error)
      renderToast({
        variant: "error",
        message: authLocalization.userBannedError,
      })
    }
  }

  const handleUnbanUser = async (userId: string) => {
    try {
      await authClient.admin.unbanUser({ userId })
      renderToast({
        variant: "success",
        message: authLocalization.userUnbannedSuccess,
      })
      fetchUsers()
    } catch (error) {
      console.error("Failed to unban user:", error)
      renderToast({
        variant: "error",
        message: authLocalization.userUnbannedError,
      })
    }
  }

  const handleRemoveUser = async (userId: string) => {
    try {
      await authClient.admin.removeUser({ userId })
      renderToast({
        variant: "success",
        message: authLocalization.userRemovedSuccess,
      })
      fetchUsers()
    } catch (error) {
      console.error("Failed to remove user:", error)
      renderToast({
        variant: "error",
        message: authLocalization.userRemovedError,
      })
    }
  }

  const totalPages = Math.ceil(totalUsers / pageSize)

  return (
    <Card className={cn("p-6", classNames?.card, className)}>
      <div className={cn("flex justify-between items-center mb-6", classNames?.header)}>
        <h2 className={cn("text-2xl font-semibold", classNames?.title)}>{title}</h2>
        <Button onClick={() => setShowCreateDialog(true)}>{authLocalization.createUser}</Button>
      </div>

      <div className={cn("flex mb-4", classNames?.searchContainer)}>
        <form onSubmit={handleSearch} className="relative flex-1 mr-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn("pl-10 pr-10", classNames?.searchInput)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>

      <div className="overflow-x-auto">
        <Table className={classNames?.table}>
          <TableHeader className={classNames?.tableHeader}>
            <TableRow>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("name")}
              >
                Name
                {sortBy === "name" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("email")}
              >
                Email
                {sortBy === "email" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("role")}
              >
                Role
                {sortBy === "role" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Status</TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("createdAt")}
              >
                Joined
                {sortBy === "createdAt" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className={classNames?.tableRow}>
                  <TableCell className={classNames?.tableCell}>{user.name}</TableCell>
                  <TableCell className={classNames?.tableCell}>{user.email}</TableCell>
                  <TableCell className={classNames?.tableCell}>
                    {Array.isArray(user.role) ? user.role.join(", ") : user.role}
                  </TableCell>
                  <TableCell className={classNames?.tableCell}>
                    {user.verified ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className={classNames?.tableCell}>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        user.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
                        classNames?.statusBadge
                      )}
                    >
                      {user.status === "active" ? "Active" : "Banned"}
                    </span>
                  </TableCell>
                  <TableCell className={classNames?.tableCell}>{user.createdAt}</TableCell>
                  <TableCell className={cn("text-right", classNames?.tableCell)}>
                    <UserActionMenu
                      userId={user.id}
                      status={user.status}
                      onBan={() => handleBanUser(user.id)}
                      onUnban={() => handleUnbanUser(user.id)}
                      onRemove={() => handleRemoveUser(user.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className={cn("flex justify-between items-center mt-4", classNames?.pagination)}>
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <CreateUserDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onUserCreated={fetchUsers}
      />
    </Card>
  )
}
