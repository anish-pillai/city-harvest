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
import { Calendar, Edit, MoreHorizontal, Plus, Search, Trash, Users } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

type Event = {
  id: string
  title: string
  date: string
  endDate: string | null
  time: string | null
  location: string | null
  category: string | null
  featured: boolean
  registrationRequired: boolean
  _count: {
    attendees: number
  }
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

export default function EventsPage() {
  const { data: session } = useSession({ required: true })
  const [events, setEvents] = useState<Event[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [upcomingOnly, setUpcomingOnly] = useState(true)

  const fetchEvents = async (page = 1, search = searchQuery, category = categoryFilter, upcoming = upcomingOnly) => {
    try {
      setIsLoading(true)

      let url = `/api/admin/events?page=${page}&limit=${pagination.limit}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (category) url += `&category=${encodeURIComponent(category)}`
      if (upcoming) url += `&upcoming=true`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch events")

      const data = await response.json()
      setEvents(data.events)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    fetchEvents(1, searchQuery, categoryFilter, upcomingOnly)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    fetchEvents(1, searchQuery, value, upcomingOnly)
  }

  const handleUpcomingChange = (value: string) => {
    const isUpcoming = value === "upcoming"
    setUpcomingOnly(isUpcoming)
    fetchEvents(1, searchQuery, categoryFilter, isUpcoming)
  }

  const handlePageChange = (page: number) => {
    fetchEvents(page, searchQuery, categoryFilter, upcomingOnly)
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete event")

      // Remove from local state
      setEvents(events.filter((event) => event.id !== id))

      toast({
        title: "Success",
        description: "Event deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Management</CardTitle>
          <CardDescription>Manage your church's events. Add, edit, or delete events.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
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
                  <SelectItem value="Worship">Worship</SelectItem>
                  <SelectItem value="Prayer">Prayer</SelectItem>
                  <SelectItem value="Youth">Youth</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Outreach">Outreach</SelectItem>
                  <SelectItem value="Marriage">Marriage & Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={upcomingOnly ? "upcoming" : "all"} onValueChange={handleUpcomingChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming Events</SelectItem>
                  <SelectItem value="all">All Events</SelectItem>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading events...
                    </TableCell>
                  </TableRow>
                ) : events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="font-medium">{event.title}</div>
                        <div className="flex gap-1 mt-1">
                          {event.featured && <Badge variant="default">Featured</Badge>}
                          {event.registrationRequired && <Badge variant="outline">Registration Required</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{format(new Date(event.date), "MMM d, yyyy")}</div>
                        {event.time && <div className="text-sm text-muted-foreground">{event.time}</div>}
                      </TableCell>
                      <TableCell>{event.location || "TBD"}</TableCell>
                      <TableCell>
                        {event.category ? (
                          <Badge variant="outline">{event.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{event._count.attendees}</span>
                        </div>
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
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}/attendees`}>
                                <Users className="mr-2 h-4 w-4" />
                                View Attendees
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/events/${event.id}`} target="_blank">
                                <Calendar className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteEvent(event.id)}
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

