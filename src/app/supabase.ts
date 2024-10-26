import { Database } from '@/app/database.types'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://enljtnmwgsfhpsekdulz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export { supabase }
