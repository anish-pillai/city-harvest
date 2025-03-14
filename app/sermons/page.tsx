import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Search } from "lucide-react"

// This would typically come from your database
const sermons = [
  {
    id: 1,
    title: "Finding Peace in Troubled Times",
    speaker: "Pastor John Smith",
    date: "March 10, 2024",
    category: "Faith",
    description: "Discover how to find God's peace even in the midst of life's storms.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "The Power of Faith",
    speaker: "Pastor Sarah Johnson",
    date: "March 3, 2024",
    category: "Spiritual Growth",
    description: "Learn how faith can move mountains in your life and circumstances.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Walking in God's Purpose",
    speaker: "Pastor Michael Brown",
    date: "February 25, 2024",
    category: "Purpose",
    description: "Understand how to discover and fulfill God's unique purpose for your life.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "The Heart of Worship",
    speaker: "Pastor Sarah Johnson",
    date: "February 18, 2024",
    category: "Worship",
    description: "Explore what true worship means and how it transforms our relationship with God.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 5,
    title: "Building Strong Families",
    speaker: "Pastor John Smith",
    date: "February 11, 2024",
    category: "Family",
    description: "Biblical principles for creating healthy, God-centered family relationships.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 6,
    title: "The Grace of Giving",
    speaker: "Pastor Michael Brown",
    date: "February 4, 2024",
    category: "Stewardship",
    description: "Discover the joy and blessing that comes from generous giving.",
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
]

export default function SermonsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sermons</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore our collection of sermons to grow in your faith and deepen your understanding of God's Word.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-12 bg-muted/40 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search sermons..." className="pl-10 bg-background" />
          </div>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select speaker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Speakers</SelectItem>
              <SelectItem value="john-smith">Pastor John Smith</SelectItem>
              <SelectItem value="sarah-johnson">Pastor Sarah Johnson</SelectItem>
              <SelectItem value="michael-brown">Pastor Michael Brown</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="faith">Faith</SelectItem>
              <SelectItem value="spiritual-growth">Spiritual Growth</SelectItem>
              <SelectItem value="purpose">Purpose</SelectItem>
              <SelectItem value="worship">Worship</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="stewardship">Stewardship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sermons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {sermons.map((sermon) => (
          <Card key={sermon.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src={sermon.thumbnail || "/placeholder.svg"} alt={sermon.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {sermon.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{sermon.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {sermon.speaker} • {sermon.date}
              </p>
              <p className="text-sm mb-4">{sermon.description}</p>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/sermons/${sermon.id}`}>Watch Sermon</Link>
              </Button>
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
        <Button variant="outline">3</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  )
}

