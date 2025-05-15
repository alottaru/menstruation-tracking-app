"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { getSession } from "./auth"

export async function logMood(formData: FormData) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id
  const date = formData.get("date") as string
  const mood = formData.get("mood") as string
  const notes = formData.get("notes") as string

  if (!mood) {
    return { success: false, error: "Please select a mood" }
  }

  try {
    // Find the current cycle (if any)
    const { data: currentCycle } = await supabase
      .from("cycles")
      .select("id")
      .eq("user_id", userId)
      .lte("start_date", date)
      .or(`end_date.is.null,end_date.gte.${date}`)
      .order("start_date", { ascending: false })
      .limit(1)
      .single()

    const cycleId = currentCycle?.id || null

    // Insert mood
    const { data, error } = await supabase
      .from("moods")
      .insert({
        user_id: userId,
        cycle_id: cycleId,
        date,
        mood,
        notes,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error logging mood:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getUserMoods() {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id

  try {
    const { data, error } = await supabase
      .from("moods")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user moods:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
