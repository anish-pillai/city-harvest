"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We'd love to hear from you! Reach out with any questions, prayer requests, or to learn more about our church.
        </p>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Our Location</h3>
            <p className="text-muted-foreground">
              123 Church Street
              <br />
              City, State 12345
            </p>
            <Button variant="link" className="mt-2" asChild>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Service Times</h3>
            <p className="text-muted-foreground">
              <span className="font-medium">Sunday:</span> 10:00 AM - 12:00 PM
              <br />
              <span className="font-medium">Wednesday:</span> 7:00 PM - 8:30 PM
            </p>
            <Button variant="link" className="mt-2" asChild>
              <a href="/visit">Plan Your Visit</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
            <p className="text-muted-foreground">
              <span className="font-medium">Phone:</span> (123) 456-7890
              <br />
              <span className="font-medium">Email:</span> info@cityharvest.org
            </p>
            <Button variant="link" className="mt-2" asChild>
              <a href="mailto:info@cityharvest.org">Email Us</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

          {isSuccess ? (
            <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
              <p className="font-medium">Thank you for your message!</p>
              <p>We've received your inquiry and will get back to you soon.</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={formData.subject} onValueChange={handleSelectChange}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="prayer">Prayer Request</SelectItem>
                    <SelectItem value="visit">Planning a Visit</SelectItem>
                    <SelectItem value="volunteer">Volunteering</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Find Us</h2>
          <div className="aspect-video w-full h-auto rounded-lg overflow-hidden border">
            {/* Replace with actual Google Maps embed */}
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Google Maps Embed</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Office Hours</h3>
            <p className="text-muted-foreground mb-4">
              Our church office is open Monday through Friday from 9:00 AM to 5:00 PM.
            </p>

            <h3 className="text-lg font-semibold mb-2">Parking Information</h3>
            <p className="text-muted-foreground">
              Free parking is available in our church parking lot. Additional street parking is available on Church
              Street and surrounding areas.
            </p>
          </div>
        </div>
      </div>

      {/* Connect Section */}
      <section className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Connect With Us</h2>
        <p className="text-xl max-w-3xl mx-auto mb-6">
          Follow us on social media to stay updated with the latest news, events, and sermons.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" size="lg" asChild>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}

