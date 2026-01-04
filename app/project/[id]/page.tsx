import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ExternalLink, Github, ChevronLeft, Eye, Calendar, Heart, Bookmark } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'
import ProjectActions from './ProjectActions'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

interface ProjectPageProps {
    params: { id: string }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const supabase = await createClient()
    const projectId = params.id

    // Get current user (may be null for anonymous)
    const { data: { user } } = await supabase.auth.getUser()

    // Get user's profile ID if authenticated
    let currentProfileId: string | null = null
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()
        currentProfileId = profile?.id || null
    }

    // STEP 1: Fetch project by ID first (no visibility filter)
    // RLS policies will allow: PUBLIC projects OR owner's own projects
    const { data: project, error } = await supabase
        .from('projects')
        .select(`
            *,
            profiles:profile_id (
                username,
                full_name,
                avatar_url,
                headline
            ),
            project_skills (
                skills (
                    name
                )
            )
        `)
        .eq('id', projectId)
        .single()

    // STEP 2: Resolve access
    // If project doesn't exist or RLS blocked it, show 404
    if (error || !project) {
        notFound()
    }

    // STEP 3: Additional access control for non-PUBLIC projects
    // Check if user is the owner for DRAFT/PRIVATE projects
    const isOwner = currentProfileId && currentProfileId === project.profile_id
    const isPublic = project.visibility === 'PUBLIC'

    // If not public and not owner, deny access
    if (!isPublic && !isOwner) {
        notFound()
    }

    // Extract skills
    const skills = project.project_skills
        ? project.project_skills.map((ps: { skills: { name: string } | null }) => ps.skills?.name).filter(Boolean) as string[]
        : []

    // Get profile data with type safety
    const profile = project.profiles as {
        username: string
        full_name: string
        avatar_url: string | null
        headline: string | null
    } | null

    return (
        <>
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container max-w-4xl">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                            <ChevronLeft className="w-4 h-4" /> Back to Explore
                        </Link>
                        {project.visibility === 'DRAFT' && (
                            <span className="tag text-yellow-500 border-yellow-500/20 bg-yellow-500/10">Draft</span>
                        )}
                        {project.visibility === 'PRIVATE' && (
                            <span className="tag text-gray-400 border-gray-500/20 bg-gray-500/10">Private</span>
                        )}
                    </div>

                    {/* Project Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">{project.title}</h1>
                        <p className="text-xl text-gray-400">{project.short_desc}</p>
                    </div>

                    {/* Cover Image */}
                    <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 border border-gray-800 bg-gray-900 relative">
                        {project.cover_image_url ? (
                            <Image
                                src={project.cover_image_url}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-700">
                                No Cover Image
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-gray-800">
                        {/* Client Component for interactive actions */}
                        <ProjectActions
                            projectId={project.id}
                            initialLikeCount={project.likes_count || 0}
                            initialSaveCount={project.saves_count || 0}
                        />

                        <div className="flex gap-3 w-full sm:w-auto">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary flex-1 sm:flex-none justify-center"
                                >
                                    <Github className="w-4 h-4" /> Source Code
                                </a>
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary flex-1 sm:flex-none justify-center"
                                >
                                    <ExternalLink className="w-4 h-4" /> Live Demo
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                About this project
                            </h2>
                            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                                <p className="whitespace-pre-wrap">{project.full_desc || project.short_desc}</p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Author Card */}
                            <div className="card p-5 hover:border-gray-700 transition-colors">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-semibold">Created by</p>
                                <Link href={`/profile/${profile?.username}`} className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden relative border border-gray-700">
                                        {profile?.avatar_url ? (
                                            <Image
                                                src={profile.avatar_url}
                                                alt={profile.full_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs font-bold text-gray-400">
                                                {profile?.full_name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium group-hover:text-blue-400 transition-colors">{profile?.full_name}</p>
                                        <p className="text-sm text-gray-500 line-clamp-1">{profile?.headline || 'Member'}</p>
                                    </div>
                                </Link>
                            </div>

                            {/* Tech Stack */}
                            {skills.length > 0 && (
                                <div className="card p-5">
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-semibold">Tech Stack</p>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((tech) => (
                                            <span key={tech} className="tag bg-gray-900 border-gray-700 text-gray-300">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="card p-5">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-semibold">Stats</p>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center py-1 border-b border-gray-800/50">
                                        <span className="text-gray-500 flex items-center gap-2"><Eye className="w-3 h-3" /> Views</span>
                                        <span className="font-mono">{project.views_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-gray-800/50">
                                        <span className="text-gray-500 flex items-center gap-2"><Heart className="w-3 h-3" /> Likes</span>
                                        <span className="font-mono">{project.likes_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-gray-800/50">
                                        <span className="text-gray-500 flex items-center gap-2"><Bookmark className="w-3 h-3" /> Saves</span>
                                        <span className="font-mono">{project.saves_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-3 h-3" /> Published</span>
                                        <span className="font-mono text-xs">
                                            {new Date(project.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
