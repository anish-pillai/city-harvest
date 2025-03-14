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
import { Download, Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

type Donation = {
  id: string
  amount: number
  currency: string
  status: string
  paymentMethod: string | null
  description: string | null
  anonymous: boolean
  createdAt: string
  user: {
    id: string | null
    name: string | null
    email: string | null
  } | null
  fund: {
    id: string
    name: string
  } | null
}

type PaginationData = {
  total: number
  pages: number
  page: number
  limit: number
}

type Stats = {
  totalAmount: number
}

export default function DonationsPage() {
  const { data: session } = useSession({ required: true })
  const [donations, setDonations] = useState<Donation[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  })
  const [stats, setStats] = useState<Stats>({
    totalAmount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [fundFilter, setFundFilter] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [funds, setFunds] = useState<{ id: string; name: string }[]>([])

  const fetchDonations = async (page = 1) => {
    try {
      setIsLoading(true)

      let url = `/api/admin/donations?page=${page}&limit=${pagination.limit}`
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`
      if (fundFilter) url += `&fundId=${encodeURIComponent(fundFilter)}`
      if (startDate) url += `&startDate=${encodeURIComponent(startDate)}`
      if (endDate) url += `&endDate=${encodeURIComponent(endDate)}`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch donations")

      const data = await response.json()
      setDonations(data.donations)
      setPagination(data.pagination)
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching donations:", error)
      toast({
        title: "Error",
        description: "Failed to load donations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFunds = async () => {
    try {
      const response = await fetch("/api/admin/funds?activeOnly=true")
      if (!response.ok) throw new Error("Failed to fetch funds")

      const data = await response.json()
      setFunds(data)
    } catch (error) {
      console.error("Error fetching funds:", error)
    }
  }

  useEffect(() => {
    fetchDonations()
    fetchFunds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilter = () => {
    fetchDonations(1)
  }

  const handlePageChange = (page: number) => {
    fetchDonations(page)
  }

  const handleDeleteDonation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) return

    try {
      const response = await fetch(`/api/admin/donations/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete donation")

      // Remove from local state
      setDonations(donations.filter((donation) => donation.id !== id))

      toast({
        title: "Success",
        description: "Donation deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting donation:", error)
      toast({
        title: "Error",
        description: "Failed to delete donation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Donations</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/donations/export">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/donations/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Donation
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount, "USD")}</div>
            <p className="text-xs text-muted-foreground">
              {statusFilter ? `Status: ${statusFilter}` : "All statuses"}
              {fundFilter ? `, Fund: ${funds.find((f) => f.id === fundFilter)?.name}` : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation Management</CardTitle>
          <CardDescription>Manage donations to your church. View, add, or delete donations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={fundFilter} onValueChange={setFundFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Funds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Funds</SelectItem>
                  {funds.map((fund) => (
                    <SelectItem key={fund.id} value={fund.id}>
                      {fund.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            <div className="md:col-span-4">
              <Button onClick={handleFilter}>Apply Filters</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fund</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading donations...
                    </TableCell>
                  </TableRow>
                ) : donations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No donations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        {donation.anonymous ? (
                          <span className="text-muted-foreground">Anonymous</span>
                        ) : donation.user ? (
                          <div>
                            <div className="font-medium">{donation.user.name || "Unnamed"}</div>
                            <div className="text-sm text-muted-foreground">{donation.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No user data</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(donation.amount, donation.currency)}
                      </TableCell>
                      <TableCell>
                        {donation.fund ? (
                          <Badge variant="outline">{donation.fund.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">General</span>
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(donation.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            donation.status === "COMPLETED"
                              ? "default"
                              : donation.status === "PENDING"
                                ? "outline"
                                : donation.status === "FAILED"
                                  ? "destructive"
                                  : "secondary"
                          }
                        >
                          {donation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{donation.paymentMethod || "N/A"}</TableCell>
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
                              <Link href={`/admin/donations/${donation.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteDonation(donation.id)}
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

