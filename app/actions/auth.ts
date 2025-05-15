"use server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  const supabase = createServerSupabaseClient()

  try {
    // Create a new user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (authData.user) {
      // Create a profile for the user
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        name,
        email,
      })

      if (profileError) {
        return { success: false, error: profileError.message }
      }

      return { success: true, user: authData.user }
    }

    return { success: false, error: "Something went wrong" }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function signOut() {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getSession() {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error || !data.session) {
      return null
    }

    return data.session
  } catch (error) {
    return null
  }
}

export async function getUserProfile() {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  if (!session) {
    return null
  }

  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    return null
  }
}
