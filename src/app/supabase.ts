import { Database } from '@/app/database.types'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://enljtnmwgsfhpsekdulz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_KEY is required.')
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export { supabase }
