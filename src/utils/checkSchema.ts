import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
    // Just select one row to get the keys
    const { data, error } = await supabase.from('members').select('*').limit(1)
    if (error) {
        console.error(error)
    } else if (data && data.length > 0) {
        console.log("Columns:", Object.keys(data[0]))
    } else {
        console.log("No data, try inserting or use RPC.")
        // Also can query information schema via RPC if we had it, but this is simpler for anon key
    }
}

checkSchema()
