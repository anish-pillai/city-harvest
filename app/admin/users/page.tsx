"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, UserPlus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  createdAt?: string
}

export default function UsersPage() {
  const { data: session } = useSession({ required: true })
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users")
        if (!response.ok) throw new Error("Failed to fetch users")
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/promote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to promote user")

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: "ADMIN" } : user)))

      toast({
        title: "Success",
        description: "User has been promoted to admin.",
      })
    } catch (error) {
      console.error("Error promoting user:", error)
      toast({
        title: "Error",
        description: "Failed to promote user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDemoteToUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/demote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to demote user")

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: "USER" } : user)))

      toast({
        title: "Success",
        description: "User has been demoted to regular user.",
      })
    } catch (error) {
      console.error("Error demoting user:", error)
      toast({
        title: "Error",
        description: "Failed to demote user. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users and their permissions. Promote users to admin or demote them to regular users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image || ""} alt={user.name || ""} />
                            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name || "Unnamed User"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => (window.location.href = `/admin/users/${user.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            {user.role === "USER" ? (
                              <DropdownMenuItem onClick={() => handlePromoteToAdmin(user.id)}>
                                Promote to Admin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleDemoteToUser(user.id)}>
                                Demote to User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

