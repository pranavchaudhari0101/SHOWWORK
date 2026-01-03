import Link from 'next/link'
import { Plus, Folder, Pencil, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProjectsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Get user's profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

    // Get all user's projects
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', profile?.id)
        .order('created_at', { ascending: false })

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-medium mb-1">My Projects</h1>
                    <p className="text-gray-500">Manage all your projects</p>
                </div>
                <Link href="/upload" className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    New Project
                </Link>
            </div>

            {projects && projects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="card p-6 hover:border-gray-700 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                    <Folder className="w-6 h-6 text-gray-500" />
                                </div>
                                <div className="flex items-center gap-2">
                                    {project.visibility === 'DRAFT' && (
                                        <span className="tag text-yellow-500 border-yellow-500/20 bg-yellow-500/10">Draft</span>
                                    )}
                                    {project.visibility === 'PRIVATE' && (
                                        <span className="tag text-gray-400">Private</span>
                                    )}
                                    {project.visibility === 'PUBLIC' && (
                                        <span className="tag text-green-500 border-green-500/20 bg-green-500/10">Public</span>
                                    )}
                                </div>
                            </div>
                            <h3 className="font-medium mb-1">{project.title}</h3>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.short_desc}</p>
                            <div className="flex gap-4 text-xs text-gray-600 mb-4">
                                <span>{project.likes_count || 0} likes</span>
                                <span>{project.views_count || 0} views</span>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/dashboard/projects/${project.id}/edit`} className="btn btn-secondary flex-1 justify-center text-sm py-2">
                                    <Pencil className="w-3 h-3" />
                                    Edit
                                </Link>
                                <Link href={`/project/${project.id}`} className="btn btn-ghost flex-1 justify-center text-sm py-2">
                                    <Eye className="w-3 h-3" />
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <Folder className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <h2 className="text-xl font-medium mb-2">No projects yet</h2>
                    <p className="text-gray-500 mb-6">Upload your first project to get started</p>
                    <Link href="/upload" className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        Upload Project
                    </Link>
                </div>
            )}
        </>
    )
}
