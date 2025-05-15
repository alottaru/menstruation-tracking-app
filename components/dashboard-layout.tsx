"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, LineChart, Droplets, Heart, FileText, Bell, Settings, LogOut, Menu, X } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        // Fetch user profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profile) {
          setProfile(profile)
        }
      } else {
        router.push("/login")
      }

      setIsLoading(false)
    }

    fetchUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Calendar className="h-5 w-5" /> },
    { href: "/cycle", label: "Cycle Tracking", icon: <Calendar className="h-5 w-5" /> },
    { href: "/symptoms", label: "Symptoms", icon: <Droplets className="h-5 w-5" /> },
    { href: "/mood", label: "Mood", icon: <Heart className="h-5 w-5" /> },
    { href: "/notes", label: "Notes", icon: <FileText className="h-5 w-5" /> },
    { href: "/statistics", label: "Statistics", icon: <LineChart className="h-5 w-5" /> },
    { href: "/reminders", label: "Reminders", icon: <Bell className="h-5 w-5" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-pink-500 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-pink-100 p-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-pink-600">
          CycleSync
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-pink-600">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white w-full border-b border-pink-100">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg ${
                      pathname === item.href ? "bg-pink-100 text-pink-700" : "text-gray-600 hover:bg-pink-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-pink-50 w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-pink-100">
        <div className="p-6">
          <Link href="/dashboard" className="text-2xl font-bold text-pink-600">
            CycleSync
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg ${
                    pathname === item.href ? "bg-pink-100 text-pink-700" : "text-gray-600 hover:bg-pink-50"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-pink-100">
          {profile && (
            <div className="mb-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-semibold mr-3">
                {profile.name ? profile.name.charAt(0) : user.email.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{profile.name || "User"}</p>
                <p className="text-sm text-gray-500">{profile.email || user.email}</p>
              </div>
            </div>
          )}

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
