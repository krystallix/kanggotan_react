// context/AuthProvider.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({
    children,
    User
}: {
    children: React.ReactNode
    User: User | null
}) {
    const [user, setUser] = useState<User | null>(User)
    const [isLoading, setIsLoading] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
    )

    useEffect(() => {
        // Listen untuk auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null)
                setIsLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase])

    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
