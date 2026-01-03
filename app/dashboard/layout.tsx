import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Folder, BarChart2, Bookmark, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('user_id', user.id)
        .single()

    const displayName = profile?.full_name || user.email?.split('@')[0] || 'User'
    const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="sidebar hidden lg:block">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="ShowWork" width={140} height={40} className="h-8 w-auto" />
                </Link>


                <nav className="mt-8">
                    <Link href="/dashboard" className="sidebar-link active">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/projects" className="sidebar-link">
                        <Folder className="w-4 h-4" />
                        My Projects
                    </Link>
                    <Link href="/dashboard/analytics" className="sidebar-link">
                        <BarChart2 className="w-4 h-4" />
                        Analytics
                    </Link>
                    <Link href="/dashboard/saved" className="sidebar-link">
                        <Bookmark className="w-4 h-4" />
                        Saved
                    </Link>
                    <Link href="/dashboard/settings" className="sidebar-link">
                        <Settings className="w-4 h-4" />
                        Settings
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-900">
                    <Link href={`/profile/${profile?.username || 'me'}`} className="sidebar-link">
                        <div className="avatar w-8 h-8 text-xs">{initials}</div>
                        <span>{displayName}</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
