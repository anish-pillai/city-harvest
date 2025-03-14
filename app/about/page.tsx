import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Globe, BookOpen } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Our Church</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn more about City Harvest International Fellowship, our mission, vision, and the people who make our
          community special.
        </p>
      </div>

      {/* Our Story */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=800&width=600" alt="Church History" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg mb-4">
              City Harvest International Fellowship was founded in 2005 with a vision to create a welcoming community
              where people from all walks of life could experience God's love and grow in their faith journey.
            </p>
            <p className="text-lg mb-4">
              What began as a small gathering of 30 people in a living room has grown into a vibrant, multicultural
              congregation of over 500 members, united by our shared faith and commitment to serving others.
            </p>
            <p className="text-lg">
              Throughout our history, we have remained dedicated to our founding principles of authentic worship,
              biblical teaching, compassionate outreach, and meaningful community.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mb-16 bg-muted/40 py-12 rounded-lg">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
            <p className="text-lg max-w-3xl mx-auto">
              We are guided by a clear mission and vision that shapes everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Heart className="h-6 w-6 text-primary mr-2" />
                  Our Mission
                </h3>
                <p className="text-lg">
                  To love God, love people, and make disciples who transform communities with the message and love of
                  Jesus Christ.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Globe className="h-6 w-6 text-primary mr-2" />
                  Our Vision
                </h3>
                <p className="text-lg">
                  To be a diverse, growing community of faith that brings hope, healing, and transformation to our city
                  and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-lg max-w-3xl mx-auto">
            These values define who we are and guide how we live out our faith together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Biblical Truth</h3>
              <p>We are committed to teaching and living according to God's Word.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Authentic Community</h3>
              <p>We foster genuine relationships where people can belong and grow.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Compassionate Service</h3>
              <p>We demonstrate God's love through practical acts of service.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
              <p>We are committed to sharing the gospel locally and globally.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
          <p className="text-lg max-w-3xl mx-auto">Meet the dedicated individuals who guide our church community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pastor 1 */}
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Pastor John Smith"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Pastor John Smith</h3>
            <p className="text-muted-foreground">Senior Pastor</p>
            <p className="mt-2 max-w-md mx-auto">
              Pastor John has been leading our church since its founding in 2005. He is passionate about teaching God's
              Word and helping people grow in their faith.
            </p>
          </div>

          {/* Pastor 2 */}
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Pastor Sarah Johnson"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Pastor Sarah Johnson</h3>
            <p className="text-muted-foreground">Associate Pastor</p>
            <p className="mt-2 max-w-md mx-auto">
              Pastor Sarah oversees our worship and creative ministries. She is dedicated to creating meaningful worship
              experiences that connect people with God.
            </p>
          </div>

          {/* Pastor 3 */}
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Pastor Michael Brown"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Pastor Michael Brown</h3>
            <p className="text-muted-foreground">Youth Pastor</p>
            <p className="mt-2 max-w-md mx-auto">
              Pastor Michael leads our vibrant youth ministry. He is passionate about helping young people discover
              their purpose and develop a personal relationship with Jesus.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button asChild>
            <a href="/leadership">Meet Our Full Team</a>
          </Button>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-xl max-w-3xl mx-auto mb-6">
          We'd love to welcome you to our church family. Join us for a service or connect with one of our ministries.
        </p>
        <Button variant="secondary" size="lg" asChild>
          <a href="/visit">Plan Your Visit</a>
        </Button>
      </section>
    </div>
  )
}

