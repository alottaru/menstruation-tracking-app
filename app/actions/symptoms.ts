"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { getSession } from "./auth"

export async function logSymptoms(formData: FormData) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id
  const date = formData.get("date") as string
  const symptoms = formData.getAll("symptoms") as string[]
  const severity = formData.get("severity") as string

  if (symptoms.length === 0) {
    return { success: false, error: "Please select at least one symptom" }
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

    // Insert symptoms
    const symptomsToInsert = symptoms.map((type) => ({
      user_id: userId,
      cycle_id: cycleId,
      date,
      type,
      severity,
    }))

    const { data, error } = await supabase.from("symptoms").insert(symptomsToInsert).select()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error logging symptoms:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getUserSymptoms() {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id

  try {
    const { data, error } = await supabase
      .from("symptoms")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user symptoms:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
