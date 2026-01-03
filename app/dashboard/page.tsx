import Link from 'next/link'
import { Plus, Eye, Heart, Folder, Trophy, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Get user's projects
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(5)

    const displayName = profile?.full_name || user.email?.split('@')[0] || 'there'
    const projectCount = projects?.length || 0

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-medium mb-1">Welcome back, {displayName}</h1>
                    <p className="text-gray-500">Here&apos;s what&apos;s happening with your portfolio</p>
                </div>
                <Link href="/upload" className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    New Project
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500">Profile Views</span>
                        <Eye className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-3xl font-medium">0</p>
                    <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500">Total Likes</span>
                        <Heart className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-3xl font-medium">0</p>
                    <p className="text-xs text-gray-500 mt-1">Start uploading projects</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500">Projects</span>
                        <Folder className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-3xl font-medium">{projectCount}</p>
                    <p className="text-xs text-gray-500 mt-1">{projectCount === 0 ? 'Upload your first project' : `${projectCount} published`}</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500">Ranking</span>
                        <Trophy className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-3xl font-medium">--</p>
                    <p className="text-xs text-gray-500 mt-1">Build your portfolio</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Projects */}
                <div className="lg:col-span-2 card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-medium">Your Projects</h2>
                        {projectCount > 0 && (
                            <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:text-white">View all →</Link>
                        )}
                    </div>

                    {projectCount === 0 ? (
                        <div className="text-center py-12">
                            <Upload className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                            <p className="text-gray-500 mb-6">Upload your first project to showcase your work</p>
                            <Link href="/upload" className="btn btn-primary">
                                <Plus className="w-4 h-4" />
                                Upload Project
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projects?.map((project) => (
                                <Link key={project.id} href={`/project/${project.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-900 transition-colors">
                                    <div className="w-12 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                                        <Folder className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-0.5">{project.title}</p>
                                        <p className="text-xs text-gray-500">{project.short_desc}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm">{project.likes_count} likes</p>
                                        <p className="text-xs text-gray-500">{project.views_count} views</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="card p-6">
                    <h2 className="font-medium mb-6">Quick Actions</h2>

                    <div className="space-y-3">
                        <Link href="/upload" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900 transition-colors">
                            <Plus className="w-5 h-5 text-gray-400" />
                            <span className="text-sm">Upload new project</span>
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900 transition-colors">
                            <Eye className="w-5 h-5 text-gray-400" />
                            <span className="text-sm">Edit profile</span>
                        </Link>
                        <Link href={`/profile/${profile?.username || 'me'}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900 transition-colors">
                            <Heart className="w-5 h-5 text-gray-400" />
                            <span className="text-sm">View public profile</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
