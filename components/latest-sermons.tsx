import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

// This would typically come from your database
const sermons = [
  {
    id: 1,
    title: "Finding Peace in Troubled Times",
    speaker: "Pastor John Smith",
    date: "March 10, 2024",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "The Power of Faith",
    speaker: "Pastor Sarah Johnson",
    date: "March 3, 2024",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Walking in God's Purpose",
    speaker: "Pastor Michael Brown",
    date: "February 25, 2024",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

export default function LatestSermons() {
  return (
    <div className="space-y-4">
      {sermons.map((sermon) => (
        <Link key={sermon.id} href={`/sermons/${sermon.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="relative h-16 w-24 rounded-md overflow-hidden flex-shrink-0">
                <Image src={sermon.thumbnail || "/placeholder.svg"} alt={sermon.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{sermon.title}</h3>
                <p className="text-sm text-muted-foreground">{sermon.speaker}</p>
                <p className="text-sm text-muted-foreground">{sermon.date}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

