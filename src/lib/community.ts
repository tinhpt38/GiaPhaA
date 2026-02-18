import { createClient } from "@/utils/supabase/client"
import { getAnonymousId } from "./anonymous"

const supabase = createClient()

export async function incrementTreeView(treeId: string) {
    const { error } = await supabase.rpc('increment_tree_view', { tree_uuid: treeId })
    if (error) console.error('Error incrementing view:', error)
}

export async function getTreeStats(treeId: string) {
    const { data, error } = await supabase.rpc('get_tree_stats', { tree_uuid: treeId })
    if (error) {
        console.error('Error getting stats:', error)
        return { view_count: 0, vote_count: 0 }
    }
    return data as { view_count: number, vote_count: number }
}

export async function toggleTreeVote(treeId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    const anonymousId = getAnonymousId()

    const payload: any = {
        _tree_id: treeId,
        _user_id: user?.id || null,
        _anon_id: user?.id ? null : anonymousId
    }

    const { data, error } = await supabase.rpc('toggle_tree_vote', payload)

    if (error) throw error
    return data as { status: 'voted' | 'unvoted' }
}

export async function checkUserVote(treeId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    const anonymousId = getAnonymousId()

    let query = supabase.from('tree_votes').select('id', { count: 'exact', head: true }).eq('tree_id', treeId)

    if (user?.id) {
        query = query.eq('user_id', user.id)
    } else {
        query = query.eq('anonymous_identifier', anonymousId)
    }

    const { count, error } = await query
    if (error) {
        console.error("Error checking vote:", error)
        return false
    }
    return (count || 0) > 0
}

export async function getPublicTrees() {
    // Join with profiles to get owner info
    const { data, error } = await supabase
        .from('trees')
        .select(`
            *,
            profiles:owner_id (
                full_name,
                avatar_url
            ),
            tree_votes (count)
        `)
        .eq('is_public', true)
        .order('view_count', { ascending: false }) // Featured by most viewed
        .limit(20)

    if (error) throw error
    return data
}
