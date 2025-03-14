"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Plus, Search, Trash, Video } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

type Sermon = {
  id: string
  title: string
  speaker: string
  date: string
  category: string | null
  featured: boolean
  videoUrl: string | null
  thumbnailUrl: string | null
  views: number
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

type PaginationData = {
  total: number
  pages: number
  page: number
  limit: number
}

export default function SermonsPage() {
  const { data: session } = useSession({ required: true })
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")

  const fetchSermons = async (page = 1, search = searchQuery, category = categoryFilter) => {
    try {
      setIsLoading(true)

      let url = `/api/admin/sermons?page=${page}&limit=${pagination.limit}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (category) url += `&category=${encodeURIComponent(category)}`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch sermons")

      const data = await response.json()
      setSermons(data.sermons)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching sermons:", error)
      toast({
        title: "Error",
        description: "Failed to load sermons. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSermons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    fetchSermons(1, searchQuery, categoryFilter)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    fetchSermons(1, searchQuery, value)
  }

  const handlePageChange = (page: number) => {
    fetchSermons(page, searchQuery, categoryFilter)
  }

  const handleDeleteSermon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sermon?")) return

    try {
      const response = await fetch(`/api/admin/sermons/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete sermon")

      // Remove from local state
      setSermons(sermons.filter((sermon) => sermon.id !== id))

      toast({
        title: "Success",
        description: "Sermon deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting sermon:", error)
      toast({
        title: "Error",
        description: "Failed to delete sermon. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sermons</h1>
        <Button asChild>
          <Link href="/admin/sermons/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Sermon
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sermon Management</CardTitle>
          <CardDescription>Manage your church's sermons. Add, edit, or delete sermons.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sermons..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Faith">Faith</SelectItem>
                  <SelectItem value="Spiritual Growth">Spiritual Growth</SelectItem>
                  <SelectItem value="Purpose">Purpose</SelectItem>
                  <SelectItem value="Worship">Worship</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Stewardship">Stewardship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Speaker</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading sermons...
                    </TableCell>
                  </TableRow>
                ) : sermons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No sermons found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sermons.map((sermon) => (
                    <TableRow key={sermon.id}>
                      <TableCell>
                        <div className="font-medium">{sermon.title}</div>
                        {sermon.featured && (
                          <Badge variant="default" className="mt-1">
                            Featured
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{sermon.speaker}</TableCell>
                      <TableCell>{format(new Date(sermon.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {sermon.category ? (
                          <Badge variant="outline">{sermon.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>{sermon.views}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/sermons/${sermon.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/sermons/${sermon.id}`} target="_blank">
                                <Video className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteSermon(sermon.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || isLoading}
              >
                Previous
              </Button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={pagination.page === page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

