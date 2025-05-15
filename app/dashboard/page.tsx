"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Droplets, Heart } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)

      // Fetch user profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
      }

      setIsLoading(false)
    }

    fetchUser()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-pink-500 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pink-700">
            Welcome back, {profile?.name || user?.email?.split("@")[0] || "User"}
          </h1>
          <p className="text-gray-600">Track, monitor, and gain insights into your menstrual health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <QuickActionCard
            icon={<Calendar className="h-6 w-6 text-pink-500" />}
            title="Log Cycle"
            description="Record your period start or end date"
            buttonText="Log Now"
            onClick={() => router.push("/cycle/log")}
          />
          <QuickActionCard
            icon={<Droplets className="h-6 w-6 text-pink-500" />}
            title="Track Symptoms"
            description="Record any symptoms you're experiencing"
            buttonText="Add Symptoms"
            onClick={() => router.push("/symptoms/log")}
          />
          <QuickActionCard
            icon={<Heart className="h-6 w-6 text-pink-500" />}
            title="Log Mood"
            description="Keep track of your mood and emotions"
            buttonText="Log Mood"
            onClick={() => router.push("/mood/log")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card className="border-pink-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-pink-700">Your Cycle Calendar</CardTitle>
                <CardDescription>View and manage your menstrual cycle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 h-64 flex items-center justify-center">
                  <p className="text-gray-500">Calendar will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="border-pink-100 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-pink-700">Upcoming Reminders</CardTitle>
                <CardDescription>Stay on top of important dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 h-48 flex items-center justify-center">
                  <p className="text-gray-500">Reminders will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-pink-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-pink-700">Cycle Statistics</CardTitle>
                <CardDescription>Insights into your menstrual patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 h-48 flex items-center justify-center">
                  <p className="text-gray-500">Statistics will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="border-pink-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-pink-700">Recent Symptoms</CardTitle>
                <CardDescription>Your recently logged symptoms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 h-48 flex items-center justify-center">
                  <p className="text-gray-500">Symptoms will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function QuickActionCard({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  buttonText: string
  onClick: () => void
}) {
  return (
    <Card className="border-pink-100 hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start">
          <div className="bg-pink-50 p-3 rounded-full mr-4">{icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-pink-700">{title}</h3>
            <p className="text-gray-600 text-sm mb-4">{description}</p>
            <Button onClick={onClick} className="w-full bg-pink-500 hover:bg-pink-600">
              {buttonText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
