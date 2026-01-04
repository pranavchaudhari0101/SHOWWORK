import Link from 'next/link'
import { Bookmark, Folder, Heart, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function SavedPage() {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's profile to query saves
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!profile) {
        return <div>Profile not found</div>
    }

    // Fetch saved projects
    const { data: savedItems } = await supabase
        .from('project_saves')
        .select(`
            created_at,
            project:project_id (
                id,
                title,
                short_desc,
                likes_count,
                views_count,
                cover_image_url,
                profiles:profile_id (
                    full_name,
                    username,
                    avatar_url
                )
            )
        `)
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false })

    // Extract projects from the join structure and filter out any potentially null values
    const projects = savedItems?.map(item => item.project).filter(Boolean) || []

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-medium mb-1">Saved Projects</h1>
                <p className="text-gray-500">Projects you&apos;ve bookmarked</p>
            </div>

            {projects.length === 0 ? (
                <div className="card p-12 text-center">
                    <Bookmark className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <h2 className="text-xl font-medium mb-2">No saved projects</h2>
                    <p className="text-gray-500">
                        When you save projects, they&apos;ll appear here for easy access.
                    </p>
                    <Link href="/explore" className="btn btn-primary mt-6">
                        Explore Projects
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {projects.map((project: any) => (
                        <Link
                            key={project.id}
                            href={`/project/${project.id}`}
                            className="card p-4 flex flex-col md:flex-row gap-4 hover:border-gray-600 transition-colors group"
                        >
                            {/* Thumbnail */}
                            <div className="w-full md:w-48 aspect-video bg-gray-900 rounded-lg overflow-hidden relative flex-shrink-0">
                                {project.cover_image_url ? (
                                    <Image
                                        src={project.cover_image_url}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-700">
                                        <Folder className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-lg mb-1 group-hover:text-blue-400 transition-colors truncate pr-4">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-2 truncate">
                                            by {project.profiles?.full_name || 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-400 line-clamp-2 text-sm mb-4">
                                    {project.short_desc}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Heart className="w-4 h-4" />
                                        <span>{project.likes_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4" />
                                        <span>{project.views_count}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}
