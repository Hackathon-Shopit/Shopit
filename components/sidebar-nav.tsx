"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Heart, Settings, Search, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import { useUser } from "@/lib/hooks/use-user" // Updated import path
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Search",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    title: "AI Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { user, signOut, userProfile } = useUser()
  const { isOpen, closeSidebar } = useSidebar()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleSignOut = async () => {
    await signOut()
    closeSidebar()
  }

  return (
    <Sidebar open={isOpen} onOpenChange={closeSidebar} className="border-r">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center space-x-2" onClick={closeSidebar}>
          <span className="text-xl font-bold">GroceryApp</span>
        </Link>
      </SidebarHeader>

      {user && (
        <div className="border-b p-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{getInitials(userProfile.name || "User")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{userProfile.name}</p>
              <p className="text-sm text-muted-foreground">{userProfile.email}</p>
            </div>
          </div>
        </div>
      )}

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title} onClick={closeSidebar}>
                <Link href={item.href} className="flex items-center">
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-4">
        <ModeToggle />
        {user && (
          <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
