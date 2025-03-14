"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Calendar, FileText, Home, LogOut, Settings, Users, Video } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { signOut } from "next-auth/react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession({ required: true })

  if (!session) {
    return null // This will never render because of the middleware, but it's good practice
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AdminSidebar pathname={pathname} user={session.user} />
        <SidebarInset>
          <div className="flex flex-col h-full">
            <header className="h-16 border-b flex items-center px-6 sticky top-0 bg-background z-10">
              <SidebarTrigger />
              <div className="ml-auto flex items-center gap-4">
                <ThemeToggle />
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">View Website</Link>
                </Button>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function AdminSidebar({ pathname, user }: { pathname: string; user: any }) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <Link href="/admin" className="flex items-center gap-2 py-2">
            <span className="text-xl font-bold">City Harvest</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin"} tooltip="Dashboard">
                  <Link href="/admin">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/sermons")} tooltip="Sermons">
                  <Link href="/admin/sermons">
                    <Video className="h-4 w-4" />
                    <span>Sermons</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/events")} tooltip="Events">
                  <Link href="/admin/events">
                    <Calendar className="h-4 w-4" />
                    <span>Events</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/donations")} tooltip="Donations">
                  <Link href="/admin/donations">
                    <BarChart className="h-4 w-4" />
                    <span>Donations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/users")} tooltip="Users">
                  <Link href="/admin/users">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/pages")} tooltip="Pages">
                  <Link href="/admin/pages">
                    <FileText className="h-4 w-4" />
                    <span>Pages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname?.startsWith("/admin/settings")} tooltip="Settings">
                  <Link href="/admin/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image || ""} alt={user.name || "Admin User"} />
              <AvatarFallback>{user.name?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name || "Admin User"}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

