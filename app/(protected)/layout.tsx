import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/lib/hooks/use-user"
import { SidebarProvider, SidebarInset, SidebarOverlay } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { MobileHeader } from "@/components/mobile-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Grocery App",
  description: "Discover and manage local grocery stores",
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <SidebarProvider>
              <div className="flex min-h-screen flex-col">
                <MobileHeader />
                <div className="flex flex-1">
                  <SidebarNav />
                  <SidebarOverlay />
                  <SidebarInset className="flex-1">
                    <main className="p-4 md:p-6">{children}</main>
                  </SidebarInset>
                </div>
              </div>
            </SidebarProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
