import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, LineChart, MessageCircle, Bell } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-pink-500 to-pink-400 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-6 z-10">
              <h1 className="text-4xl md:text-5xl font-bold">CycleSync</h1>
              <p className="text-xl md:text-2xl">
                Track your menstrual cycle, monitor symptoms, and gain valuable insights into your health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-pink-500 hover:bg-pink-50">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-pink-400">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative z-10">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Woman tracking her cycle"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Blooming flower image */}
        <div className="absolute bottom-0 right-0 p-4 md:p-8">
          <img src="/blooming-flower.png" alt="Blooming Flower" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-pink-500">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-pink-500" />}
              title="Cycle Tracking"
              description="Log your menstrual cycle start and end dates with ease. Keep a detailed record of your cycle information."
            />
            <FeatureCard
              icon={<MessageCircle className="h-10 w-10 text-pink-500" />}
              title="Symptom Tracking"
              description="Record and categorize symptoms experienced during your cycles, from cramps to mood swings."
            />
            <FeatureCard
              icon={<Bell className="h-10 w-10 text-pink-500" />}
              title="Reminders"
              description="Set personalized reminders for upcoming cycles and medication. Never be caught unprepared."
            />
            <FeatureCard
              icon={<LineChart className="h-10 w-10 text-pink-500" />}
              title="Statistics & Insights"
              description="Visualize your cycle patterns and gain insights into your menstrual health."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-pink-500">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create an Account"
              description="Sign up and create your personal profile to start tracking your menstrual health."
            />
            <StepCard
              number="2"
              title="Log Your Cycle"
              description="Record your period dates, symptoms, moods, and personal notes."
            />
            <StepCard
              number="3"
              title="Gain Insights"
              description="View statistics, set reminders, and understand your unique patterns."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CycleSync</h3>
              <p>Your personal menstrual health companion.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline">
                    Cycle Tracking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Symptom Monitoring
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Health Insights
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Reminders
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-pink-700 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} CycleSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-pink-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-pink-600">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
      <div className="bg-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-pink-600">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
