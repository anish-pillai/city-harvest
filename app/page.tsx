import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Heart, MapPin, Mic, Users } from "lucide-react"
import UpcomingEvents from "@/components/upcoming-events"
import LatestSermons from "@/components/latest-sermons"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Church Gathering"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-start text-white px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to City Harvest</h1>
          <h2 className="text-2xl md:text-3xl mb-6">International Fellowship</h2>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            A place of worship, community, and spiritual growth. Join us as we journey together in faith.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/visit">
                Plan Your Visit <MapPin className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white" asChild>
              <Link href="/sermons">
                Watch Sermons <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Sunday Service</h3>
              <p>10:00 AM - 12:00 PM</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Wednesday Bible Study</h3>
              <p>7:00 PM - 8:30 PM</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">Youth Fellowship</h3>
              <p>Friday 6:00 PM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About Our Church</h2>
              <p className="text-lg mb-6">
                City Harvest International Fellowship is a vibrant, multicultural community of believers dedicated to
                sharing God's love and message of hope with the world.
              </p>
              <p className="text-lg mb-8">
                Founded in 2005, our church has grown from a small gathering to a thriving fellowship with members from
                all walks of life and cultural backgrounds.
              </p>
              <Button asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=800&width=600" alt="Church Community" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Ministries</h2>
            <p className="text-lg max-w-3xl mx-auto">
              We offer various ministries to serve our community and help you grow in your faith journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Outreach</h3>
              <p className="text-card-foreground">
                Serving our local community through various outreach programs and initiatives.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <Heart className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Family Ministry</h3>
              <p className="text-card-foreground">
                Supporting families through counseling, workshops, and fellowship activities.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <Mic className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Worship Ministry</h3>
              <p className="text-card-foreground">
                Enhancing our worship experience through music, arts, and technology.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link href="/ministries">View All Ministries</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Events & Sermons Section */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-8">
                <Calendar className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
              </div>
              <UpcomingEvents />
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link href="/events">View All Events</Link>
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-8">
                <Mic className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-2xl font-bold">Latest Sermons</h2>
              </div>
              <LatestSermons />
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link href="/sermons">View All Sermons</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            We invite you to be a part of our church family. Whether you're seeking spiritual growth, community, or a
            place to serve, there's a place for you at City Harvest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/visit">Visit Us</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white bg-white/10" asChild>
              <Link href="/giving">Support Our Mission</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

