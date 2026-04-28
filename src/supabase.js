import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lhvdvfmtjpeyumbybavo.supabase.co'
const supabaseKey = 'sb_publishable_Nc-2z8SR84QV-_lPUqph3g_OTp9AiUh'

export const supabase = createClient(supabaseUrl, supabaseKey)
