import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Search } from "lucide-react"

// This would typically come from your database
const events = [
  {
    id: 1,
    title: "Sunday Worship Service",
    date: "March 17, 2024",
    time: "10:00 AM - 12:00 PM",
    location: "Main Sanctuary",
    description: "Join us for our weekly worship service with praise, prayer, and teaching from God's Word.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Prayer & Fasting Week",
    date: "March 20-24, 2024",
    time: "7:00 PM - 9:00 PM",
    location: "Fellowship Hall",
    description: "A special week of prayer and fasting as we seek God's direction for our church and community.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Youth Conference",
    date: "April 5-7, 2024",
    time: "All Day",
    location: "Community Center",
    description: "An exciting weekend for youth ages 13-18 with worship, teaching, and activities.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Women's Retreat",
    date: "April 12-14, 2024",
    time: "Friday 6 PM - Sunday 2 PM",
    location: "Mountain Retreat Center",
    description: "A weekend of refreshment, fellowship, and spiritual growth for women of all ages.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 5,
    title: "Community Outreach Day",
    date: "April 20, 2024",
    time: "9:00 AM - 3:00 PM",
    location: "City Park",
    description: "Join us as we serve our community through various projects and share God's love in practical ways.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 6,
    title: "Marriage Enrichment Workshop",
    date: "April 27, 2024",
    time: "9:00 AM - 4:00 PM",
    location: "Fellowship Hall",
    description: "A day of teaching and activities designed to strengthen marriages and build healthy relationships.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
]

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Events</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Stay connected with what's happening at City Harvest and join us for our upcoming events.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-12 bg-muted/40 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-10 bg-background" />
          </div>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="march">March 2024</SelectItem>
              <SelectItem value="april">April 2024</SelectItem>
              <SelectItem value="may">May 2024</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="worship">Worship</SelectItem>
              <SelectItem value="prayer">Prayer</SelectItem>
              <SelectItem value="youth">Youth</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="outreach">Outreach</SelectItem>
              <SelectItem value="marriage">Marriage & Family</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src={event.thumbnail || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{event.date}</p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <p className="text-sm">{event.location}</p>
                </div>
              </div>
              <p className="text-sm mb-4">{event.description}</p>
              <div className="flex gap-2">
                <Button variant="default" asChild className="flex-1">
                  <Link href={`/events/${event.id}`}>Details</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href={`/events/${event.id}#register`}>Register</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <Button variant="outline" className="bg-primary text-primary-foreground">
          1
        </Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">Next</Button>
      </div>

      {/* Calendar Download */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Download our church calendar to keep track of all upcoming events.
        </p>
        <Button asChild>
          <a href="#" download>
            <Calendar className="mr-2 h-4 w-4" />
            Download Calendar
          </a>
        </Button>
      </div>
    </div>
  )
}

