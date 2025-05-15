"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUserCycles } from "@/app/actions/cycles"
import { getUserSymptoms } from "@/app/actions/symptoms"

export function CycleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [cycles, setCycles] = useState([])
  const [symptoms, setSymptoms] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        // Fetch cycles
        const cyclesResult = await getUserCycles()
        if (cyclesResult.success) {
          setCycles(cyclesResult.data || [])
        }

        // Fetch symptoms
        const symptomsResult = await getUserSymptoms()
        if (symptomsResult.success) {
          setSymptoms(symptomsResult.data || [])
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    const today = new Date()

    // Create array for days of the week
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Create array for all days in the month
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    // Check if a date is in a period
    const isInPeriod = (day) => {
      if (!cycles || cycles.length === 0) return false

      const date = new Date(year, month, day)
      date.setHours(0, 0, 0, 0)

      return cycles.some((cycle) => {
        const startDate = new Date(cycle.start_date)
        startDate.setHours(0, 0, 0, 0)

        const endDate = cycle.end_date ? new Date(cycle.end_date) : null
        if (endDate) endDate.setHours(0, 0, 0, 0)

        if (!endDate) {
          // If no end date, assume period lasts 5 days
          const estimatedEndDate = new Date(startDate)
          estimatedEndDate.setDate(startDate.getDate() + 4)
          return date >= startDate && date <= estimatedEndDate
        }

        return date >= startDate && date <= endDate
      })
    }

    // Check if a date has symptoms
    const hasSymptoms = (day) => {
      if (!symptoms || symptoms.length === 0) return false

      const date = new Date(year, month, day)
      date.setHours(0, 0, 0, 0)

      return symptoms.some((symptom) => {
        const symptomDate = new Date(symptom.date)
        symptomDate.setHours(0, 0, 0, 0)

        return date.getTime() === symptomDate.getTime()
      })
    }

    // Check if a date is today
    const isToday = (day) => {
      return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="border-pink-200 text-pink-700 hover:bg-pink-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h3 className="text-lg font-medium text-pink-700">
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </h3>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="border-pink-200 text-pink-700 hover:bg-pink-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Days of the week */}
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square p-1 relative
                ${day ? "cursor-pointer hover:bg-pink-50 rounded-lg" : ""}
              `}
            >
              {day && (
                <div
                  className={`
                    h-full w-full flex flex-col items-center justify-center rounded-lg
                    ${isToday(day) ? "bg-pink-100 font-bold text-pink-700" : ""}
                    ${isInPeriod(day) ? "bg-pink-200" : ""}
                  `}
                >
                  <span className={`text-sm ${isInPeriod(day) ? "text-pink-800" : "text-gray-700"}`}>{day}</span>

                  {hasSymptoms(day) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-200 rounded-full mr-2"></div>
            <span className="text-gray-600">Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-100 rounded-full mr-2"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Symptoms</span>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 flex items-center justify-center h-80">
        <div className="text-pink-500 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
          <p>Loading calendar...</p>
        </div>
      </div>
    )
  }

  return <div className="bg-white rounded-lg p-4">{renderCalendar()}</div>
}
