import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
    const { data, error } = await supabase.from('members').select('*').eq('tree_id', '7d1ac9c9-b546-4f77-b239-add1827325a4')
    if (error) {
        console.error(error)
    } else {
        console.log("Total members:", data?.length)
        data?.forEach(m => {
            console.log(`- ID: ${m.id.substring(0, 8)} | Name: ${m.full_name} | Rel: ${m.relationship} | Parent: ${m.parent_id?.substring(0, 8) || null} | Spouse: ${m.spouse_id?.substring(0, 8) || null}`)
        })
    }
}

checkData()
