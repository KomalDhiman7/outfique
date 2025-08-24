// src/supabase.js
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Enhanced auth functions
export const authHelpers = {
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: metadata.display_name,
          theme_preference: 'light',
          ...metadata
        }
      }
    })
    return { data, error }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async updateProfile(updates) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    return { data, error }
  }
}

// Wardrobe functions
export const wardrobeHelpers = {
  async uploadClothingItem(file, userId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('wardrobe-items')
      .upload(fileName, file)

    if (uploadError) return { error: uploadError }

    const { data, error } = await supabase
      .from('wardrobe_items')
      .insert({
        user_id: userId,
        image_path: fileName,
        category: 'unclassified',
        created_at: new Date()
      })
      .select()

    return { data, error }
  },

  async getWardrobeItems(userId) {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  }
}
