import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'gia_pha_anonymous_id'

export function getAnonymousId(): string {
    if (typeof window === 'undefined') return ''

    let id = localStorage.getItem(STORAGE_KEY)
    if (!id) {
        id = uuidv4()
        localStorage.setItem(STORAGE_KEY, id)
    }
    return id
}
