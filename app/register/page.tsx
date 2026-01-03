'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        category: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const supabase = createClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        username: formData.username,
                        category: formData.category,
                    },
                },
            })

            if (error) {
                setError(error.message)
            } else {
                setSuccess(true)
            }
        } catch (err) {
            console.error('Registration error:', err)
            setError('Failed to fetch - Check browser console for details')
        } finally {
            setLoading(false)
        }
    }

    const handleOAuth = async (provider: 'google' | 'github') => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) setError(error.message)
        } catch {
            setError('Could not connect to provider')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-black">
                <div className="card p-8 bg-gray-900 border border-gray-800 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                    <p className="text-gray-400 mb-6">
                        We&apos;ve sent a confirmation link to <span className="text-white font-medium">{formData.email}</span>.
                        Please click the link to verify your account.
                    </p>
                    <Link href="/login" className="btn btn-primary w-full justify-center">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 py-12 bg-black">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex justify-center">
                        <Image src="/logo.png" alt="ShowWork" width={140} height={40} className="h-8 w-auto" />
                    </Link>
                </div>


                {/* Card */}
                <div className="card p-8 bg-gray-900 border border-gray-800">
                    <h1 className="text-2xl font-medium mb-2 text-center text-white">Create your account</h1>
                    <p className="text-gray-500 text-center mb-8">Start showcasing your projects today</p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* OAuth Buttons */}
                    <div className="flex flex-col gap-3 mb-6">
                        <button
                            onClick={() => handleOAuth('google')}
                            disabled={loading}
                            className="btn btn-secondary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={() => handleOAuth('github')}
                            disabled={loading}
                            className="btn btn-secondary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Github className="w-5 h-5" />
                            Continue with GitHub
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gray-800" />
                        <span className="text-xs text-gray-600 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label className="form-label text-gray-300" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-gray-300" htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="johndoe"
                                required
                            />
                            <p className="text-xs text-gray-600 mt-1">showwork.dev/username</p>
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-gray-300" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-gray-300" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                            <p className="text-xs text-gray-600 mt-1">Minimum 8 characters</p>
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-gray-300" htmlFor="category">I am a</label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input w-full cursor-pointer"
                                required
                            >
                                <option value="">Select your specialty</option>
                                <option value="fullstack">Full-Stack Developer</option>
                                <option value="frontend">Frontend Developer</option>
                                <option value="backend">Backend Developer</option>
                                <option value="ml">AI/ML Engineer</option>
                                <option value="data">Data Scientist</option>
                                <option value="mobile">Mobile Developer</option>
                                <option value="devops">DevOps Engineer</option>
                                <option value="design">UX/UI Designer</option>
                            </select>
                        </div>

                        <div className="flex items-start gap-3 mb-6">
                            <input type="checkbox" id="terms" className="mt-0.5 w-4 h-4 rounded bg-gray-900 border-gray-700 text-accent-blue focus:ring-accent-blue focus:ring-offset-0" required />
                            <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer">
                                I agree to the <Link href="/terms" className="text-white hover:underline">Terms</Link> and <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center mt-6 text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-white hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

