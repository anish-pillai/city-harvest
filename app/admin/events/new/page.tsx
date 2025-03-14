"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function NewEventPage() {
  const router = useRouter()
  const { data: session } = useSession({ required: true })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    endDate: "",
    time: "",
    location: "",
    description: "",
    thumbnailUrl: "",
    category: "",
    featured: false,
    registrationRequired: false,
    registrationUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create event")
      }

      toast({
        title: "Success",
        description: "Event created successfully.",
      })

      router.push("/admin/events")
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Add New Event</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Enter the details for the new event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Start Date *</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  placeholder="e.g. 10:00 AM - 12:00 PM"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Worship">Worship</SelectItem>
                    <SelectItem value="Prayer">Prayer</SelectItem>
                    <SelectItem value="Youth">Youth</SelectItem>
                    <SelectItem value="Women">Women</SelectItem>
                    <SelectItem value="Outreach">Outreach</SelectItem>
                    <SelectItem value="Marriage">Marriage & Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  type="url"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
                <Label htmlFor="featured">Feature this event on the homepage</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="registrationRequired"
                  checked={formData.registrationRequired}
                  onCheckedChange={(checked) => handleSwitchChange("registrationRequired", checked)}
                />
                <Label htmlFor="registrationRequired">Registration required</Label>
              </div>

              {formData.registrationRequired && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="registrationUrl">Registration URL</Label>
                  <Input
                    id="registrationUrl"
                    name="registrationUrl"
                    type="url"
                    placeholder="https://example.com/register"
                    value={formData.registrationUrl}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/admin/events")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

