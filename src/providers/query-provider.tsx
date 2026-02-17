'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export default function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Dữ liệu sẽ được coi là "cũ" sau 1 phút, nhưng vẫn hiển thị từ cache
                        staleTime: 60 * 1000,
                        // Giữ dữ liệu trong cache kể cả khi không sử dụng
                        gcTime: 1000 * 60 * 60 * 24, // 24 hours
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
