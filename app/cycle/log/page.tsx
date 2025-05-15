"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { logCycleStart, logCycleEnd } from "../actions/cycles"

export default function LogCycle() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [cycleType, setCycleType] = useState("start")
  const [date, setDate] = useState(new Date())
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData()

    if (cycleType === "start") {
      formData.append("startDate", date.toISOString())
      formData.append("notes", notes)

      try {
        const result = await logCycleStart(formData)

        if (result.success) {
          router.push("/dashboard")
        } else {
          setError(result.error || "Failed to log cycle start")
        }
      } catch (error) {
        setError("An unexpected error occurred")
      }
    } else {
      formData.append("endDate", date.toISOString())
      formData.append("notes", notes)

      try {
        const result = await logCycleEnd(formData)

        if (result.success) {
          router.push("/dashboard")
        } else {
          setError(result.error || "Failed to log cycle end")
        }
      } catch (error) {
        setError("An unexpected error occurred")
      }
    }

    setIsLoading(false)
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-pink-600 hover:text-pink-700 hover:bg-pink-50 -ml-2"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="border-pink-100">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Log Cycle</CardTitle>
            <CardDescription className="text-pink-100">Record the start or end of your menstrual cycle</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>What would you like to log?</Label>
                  <RadioGroup value={cycleType} onValueChange={setCycleType} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="start" id="start" />
                      <Label htmlFor="start" className="cursor-pointer">
                        Period Start Date
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="end" id="end" />
                      <Label htmlFor="end" className="cursor-pointer">
                        Period End Date
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal border-pink-200">
                        <CalendarIcon className="mr-2 h-4 w-4 text-pink-500" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => setDate(newDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about your cycle..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px] border-pink-200"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-6 bg-pink-500 hover:bg-pink-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-pink-100 pt-4 text-sm text-gray-500">
            {cycleType === "start"
              ? "Logging a start date will create a new cycle entry."
              : "Logging an end date will update your most recent cycle."}
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
