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

export default function NewSermonPage() {
  const router = useRouter()
  const { data: session } = useSession({ required: true })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    audioUrl: "",
    category: "",
    tags: "",
    featured: false,
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

      // Process tags
      const processedTags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const response = await fetch("/api/admin/sermons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: processedTags,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create sermon")
      }

      toast({
        title: "Success",
        description: "Sermon created successfully.",
      })

      router.push("/admin/sermons")
    } catch (error) {
      console.error("Error creating sermon:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create sermon. Please try again.",
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
        <h1 className="text-3xl font-bold">Add New Sermon</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Sermon Details</CardTitle>
            <CardDescription>Enter the details for the new sermon.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speaker">Speaker *</Label>
                <Input id="speaker" name="speaker" value={formData.speaker} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Faith">Faith</SelectItem>
                    <SelectItem value="Spiritual Growth">Spiritual Growth</SelectItem>
                    <SelectItem value="Purpose">Purpose</SelectItem>
                    <SelectItem value="Worship">Worship</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Stewardship">Stewardship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audioUrl">Audio URL</Label>
                <Input
                  id="audioUrl"
                  name="audioUrl"
                  type="url"
                  placeholder="https://example.com/sermon.mp3"
                  value={formData.audioUrl}
                  onChange={handleChange}
                />
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

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="faith, prayer, hope (comma separated)"
                  value={formData.tags}
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

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
              />
              <Label htmlFor="featured">Feature this sermon on the homepage</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/admin/sermons")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Sermon"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

