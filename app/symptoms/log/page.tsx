"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { logSymptoms } from "../actions/symptoms"

export default function LogSymptoms() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState(new Date())
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [severity, setSeverity] = useState("moderate")
  const [error, setError] = useState("")

  const symptoms = [
    { id: "cramps", label: "Cramps" },
    { id: "headache", label: "Headache" },
    { id: "fatigue", label: "Fatigue" },
    { id: "bloating", label: "Bloating" },
    { id: "backache", label: "Back Pain" },
    { id: "nausea", label: "Nausea" },
    { id: "breastTenderness", label: "Breast Tenderness" },
    { id: "moodSwings", label: "Mood Swings" },
  ]

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptomId)) {
        return prev.filter((id) => id !== symptomId)
      } else {
        return [...prev, symptomId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom")
      return
    }

    setIsLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("date", date.toISOString())
    formData.append("severity", severity)

    selectedSymptoms.forEach((symptom) => {
      formData.append("symptoms", symptom)
    })

    try {
      const result = await logSymptoms(formData)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Failed to log symptoms")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
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
            <CardTitle className="text-2xl">Log Symptoms</CardTitle>
            <CardDescription className="text-pink-100">Track symptoms you're experiencing</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
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

                <div className="space-y-3">
                  <Label>Select Symptoms</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {symptoms.map((symptom) => (
                      <div key={symptom.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom.id}
                          checked={selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={() => toggleSymptom(symptom.id)}
                          className="border-pink-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                        />
                        <Label htmlFor={symptom.id} className="cursor-pointer">
                          {symptom.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Severity</Label>
                  <RadioGroup value={severity} onValueChange={setSeverity} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mild" id="mild" />
                      <Label htmlFor="mild" className="cursor-pointer">
                        Mild
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate" className="cursor-pointer">
                        Moderate
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severe" id="severe" />
                      <Label htmlFor="severe" className="cursor-pointer">
                        Severe
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-pink-500 hover:bg-pink-600"
                disabled={isLoading || selectedSymptoms.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Symptoms"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-pink-100 pt-4 text-sm text-gray-500">
            Tracking symptoms helps identify patterns in your menstrual health.
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
