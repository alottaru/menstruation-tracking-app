"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { getSession } from "./auth"

export async function addReminder(formData: FormData) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id
  const title = formData.get("title") as string
  const date = formData.get("date") as string
  const type = formData.get("type") as string

  if (!title.trim()) {
    return { success: false, error: "Please enter a reminder title" }
  }

  try {
    const { data, error } = await supabase
      .from("reminders")
      .insert({
        user_id: userId,
        title,
        date,
        type,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error adding reminder:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteReminder(formData: FormData) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id
  const reminderId = formData.get("id") as string

  try {
    const { error } = await supabase.from("reminders").delete().eq("id", reminderId).eq("user_id", userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting reminder:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getUserReminders() {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id

  try {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user reminders:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
