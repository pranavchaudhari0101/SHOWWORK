'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    return (
        <nav className="navbar">
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="ShowWork" width={140} height={40} className="h-8 w-auto" />
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/explore" className="nav-link">Explore</Link>
                    <Link href="/categories" className="nav-link">Categories</Link>
                    <Link href="/trending" className="nav-link">Trending</Link>
                </div>

                <div className="flex items-center gap-4">
                    {loading ? (
                        <div className="w-20 h-8 bg-gray-800 rounded animate-pulse" />
                    ) : user ? (
                        <>
                            <Link href="/dashboard" className="nav-link flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="hidden md:inline">Dashboard</span>
                            </Link>
                            <div className="relative group">
                                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-medium">
                                    {user.email?.charAt(0).toUpperCase()}
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="p-3 border-b border-gray-800">
                                        <p className="text-sm font-medium truncate">{user.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded">
                                            <UserIcon className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 rounded">
                                            <LogOut className="w-4 h-4" />
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="nav-link">Sign in</Link>
                            <Link href="/register" className="btn btn-primary">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
