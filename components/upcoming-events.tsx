import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

// This would typically come from your database
const events = [
  {
    id: 1,
    title: "Sunday Worship Service",
    date: "March 17, 2024",
    time: "10:00 AM - 12:00 PM",
    location: "Main Sanctuary",
  },
  {
    id: 2,
    title: "Prayer & Fasting Week",
    date: "March 20-24, 2024",
    time: "7:00 PM - 9:00 PM",
    location: "Fellowship Hall",
  },
  {
    id: 3,
    title: "Youth Conference",
    date: "April 5-7, 2024",
    time: "All Day",
    location: "Community Center",
  },
]

export default function UpcomingEvents() {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {event.date} • {event.time}
                </p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

