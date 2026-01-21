"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"


export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            // Update this route to redirect to an authenticated route. The user already has an active session.
            router.push('/dashboard')
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleLogin}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Login ke Akun Anda</h1>
                    <p className="text-muted-foreground text-sm">
                        Masukkan Kredensial untuk akses dashboard Anda
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">email</FieldLabel>
                    <Input id="email" type="email" placeholder="email" required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Lupa Password?
                        </a>
                    </div>
                    <Input id="password" type="password" required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </Field>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Field>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
