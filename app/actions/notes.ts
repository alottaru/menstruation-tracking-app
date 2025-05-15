"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { getSession } from "./auth"

export async function addNote(formData: FormData) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const date = formData.get("date") as string

  if (!title.trim() || !content.trim()) {
    return { success: false, error: "Please enter both title and content" }
  }

  try {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: userId,
        title,
        content,
        date,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error adding note:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateNote(formData: FormData) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id
  const noteId = formData.get("id") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const date = formData.get("date") as string

  if (!title.trim() || !content.trim()) {
    return { success: false, error: "Please enter both title and content" }
  }

  try {
    const { data, error } = await supabase
      .from("notes")
      .update({
        title,
        content,
        date,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error updating note:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteNote(formData: FormData) {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id
  const noteId = formData.get("id") as string

  try {
    const { error } = await supabase.from("notes").delete().eq("id", noteId).eq("user_id", userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting note:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getUserNotes() {
  const session = await getSession()

  if (!session) {
    return { success: false, error: "You must be logged in" }
  }

  const supabase = createServerSupabaseClient()
  const userId = session.user.id

  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user notes:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
