'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Heart, Bookmark, Share2, ExternalLink, Github, ChevronLeft, Eye, Calendar, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/client'

interface Project {
    id: string
    title: string
    short_desc: string
    full_desc: string
    cover_image_url: string | null
    github_url: string | null
    live_url: string | null
    visibility: string
    profile_id: string
    likes_count: number
    saves_count: number
    views_count: number
    created_at: string
    profiles: {
        username: string
        full_name: string
        avatar_url: string | null
        headline: string | null
    } | null
    project_skills: Array<{
        skills: {
            name: string
        } | null
    }>
}

export default function ProjectPage() {
    const params = useParams()
    const projectId = params.id as string
    const supabase = createClient()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [_isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        async function fetchProject() {
            try {
                // Get current user
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

                // Fetch project - try standard query first
                let { data: projectData } = await supabase
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

                // If no project found and user is authenticated, try fetching as owner
                if (!projectData && currentProfileId) {
                    const { data: ownerProject } = await supabase
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
                        .eq('profile_id', currentProfileId)
                        .single()

                    projectData = ownerProject as typeof projectData
                }

                if (!projectData) {
                    setError('Project not found')
                    return
                }

                // Access control: DRAFT and PRIVATE only visible to owner
                const ownerCheck = currentProfileId && currentProfileId === projectData.profile_id
                setIsOwner(!!ownerCheck)

                if ((projectData.visibility === 'DRAFT' || projectData.visibility === 'PRIVATE') && !ownerCheck) {
                    setError('Project not found')
                    return
                }

                setProject(projectData)
            } catch {
                setError('Failed to load project')
            } finally {
                setLoading(false)
            }
        }

        fetchProject()
    }, [projectId, supabase])

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="pt-24 pb-16">
                    <div className="container max-w-4xl flex items-center justify-center min-h-[50vh]">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                    </div>
                </main>
            </>
        )
    }

    if (error || !project) {
        return (
            <>
                <Navbar />
                <main className="pt-24 pb-16">
                    <div className="container max-w-4xl text-center py-20">
                        <h1 className="text-2xl font-medium mb-4">Project Not Found</h1>
                        <p className="text-gray-500 mb-8">The project you&apos;re looking for doesn&apos;t exist or is not accessible.</p>
                        <Link href="/explore" className="btn btn-primary">
                            Back to Explore
                        </Link>
                    </div>
                </main>
            </>
        )
    }

    // Extract skills
    const skills = project.project_skills
        ? project.project_skills.map(ps => ps.skills?.name).filter(Boolean) as string[]
        : []

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
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button className="btn btn-secondary flex-1 sm:flex-none justify-center">
                                <Heart className="w-4 h-4" />
                                <span className="ml-2">{project.likes_count || 0}</span>
                            </button>
                            <button className="btn btn-secondary flex-1 sm:flex-none justify-center">
                                <Bookmark className="w-4 h-4" />
                                <span className="ml-2">{project.saves_count || 0}</span>
                            </button>
                            <button className="btn btn-ghost flex-1 sm:flex-none justify-center">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>

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
                                <Link href={`/profile/${project.profiles?.username}`} className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden relative border border-gray-700">
                                        {project.profiles?.avatar_url ? (
                                            <Image
                                                src={project.profiles.avatar_url}
                                                alt={project.profiles.full_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs font-bold text-gray-400">
                                                {project.profiles?.full_name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium group-hover:text-blue-400 transition-colors">{project.profiles?.full_name}</p>
                                        <p className="text-sm text-gray-500 line-clamp-1">{project.profiles?.headline || 'Member'}</p>
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
