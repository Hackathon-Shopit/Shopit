"use client"

import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

// Create a context for the sidebar
interface SidebarContextType {
  isOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleSidebar = () => setIsOpen((prev) => !prev)
  const openSidebar = () => setIsOpen(true)
  const closeSidebar = () => setIsOpen(false)

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, openSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

// Sidebar component
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sidebar({ className, open, onOpenChange, ...props }: SidebarProps) {
  const { isOpen } = useSidebar()
  const openState = open !== undefined ? open : isOpen

  React.useEffect(() => {
    if (onOpenChange) {
      onOpenChange(openState)
    }
  }, [openState, onOpenChange])

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-background transition-transform duration-300 ease-in-out md:static",
        openState ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className,
      )}
      {...props}
    />
  )
}

// Sidebar components
export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-auto", className)} {...props} />
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <nav className={cn("space-y-1 p-2", className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

const menuButtonVariants = cva(
  "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
  {
    variants: {
      isActive: {
        true: "bg-accent text-accent-foreground",
        false: "transparent",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
)

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof menuButtonVariants> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, tooltip, asChild, ...props }, ref) => {
    // Explicitly remove asChild from props to avoid passing it to the DOM element
    // This prevents the React warning
    return <button ref={ref} className={cn(menuButtonVariants({ isActive }), className)} title={tooltip} {...props} />
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

// Sidebar inset (main content area)
export function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar()

  return (
    <div
      className={cn(
        "relative flex-1 overflow-auto transition-all duration-300 ease-in-out",
        isOpen && "md:ml-64",
        className,
      )}
      {...props}
    />
  )
}

// Overlay for mobile
export function SidebarOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen, closeSidebar } = useSidebar()

  if (!isOpen) return null

  return (
    <div
      className={cn("fixed inset-0 z-10 bg-background/80 backdrop-blur-sm md:hidden", className)}
      onClick={closeSidebar}
      {...props}
    />
  )
}
