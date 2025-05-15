"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { getSession } from "./auth"

export async function logCycleStart(formData: FormData) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id
  const startDate = formData.get("startDate") as string
  const notes = formData.get("notes") as string

  try {
    // Insert new cycle
    const { data, error } = await supabase
      .from("cycles")
      .insert({
        user_id: userId,
        start_date: startDate,
        notes: notes,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Create a reminder for the next expected period (28 days later)
    const nextPeriodDate = new Date(startDate)
    nextPeriodDate.setDate(nextPeriodDate.getDate() + 28)

    const { error: reminderError } = await supabase.from("reminders").insert({
      user_id: userId,
      title: "Period expected",
      date: nextPeriodDate.toISOString(),
      type: "cycle",
    })

    if (reminderError) {
      console.error("Failed to create reminder:", reminderError)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error logging cycle start:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function logCycleEnd(formData: FormData) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id
  const endDate = formData.get("endDate") as string
  const notes = formData.get("notes") as string

  try {
    // Get the most recent cycle without an end date
    const { data: latestCycle, error: fetchError } = await supabase
      .from("cycles")
      .select("*")
      .eq("user_id", userId)
      .is("end_date", null)
      .order("start_date", { ascending: false })
      .limit(1)
      .single()

    if (fetchError) {
      return { success: false, error: "No active cycle found" }
    }

    // Update the cycle with end date
    const { data, error } = await supabase
      .from("cycles")
      .update({
        end_date: endDate,
        notes: notes ? (latestCycle.notes ? `${latestCycle.notes}\n${notes}` : notes) : latestCycle.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", latestCycle.id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error logging cycle end:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getUserCycles() {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id

  try {
    const { data, error } = await supabase
      .from("cycles")
      .select("*")
      .eq("user_id", userId)
      .order("start_date", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user cycles:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
