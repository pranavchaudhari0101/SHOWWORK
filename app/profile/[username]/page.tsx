import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, Briefcase, Github, Linkedin, Globe, Heart, Eye, Folder } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: { params: { username: string } }) {
    const supabase = await createClient()

    // Fetch profile by username
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', params.username)
        .single()

    if (profileError || !profile) {
        notFound()
    }

    // Fetch user's PUBLIC projects
    const { data: projects } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            short_desc,
            cover_image_url,
            likes_count,
            views_count,
            created_at
        `)
        .eq('profile_id', profile.id)
        .eq('visibility', 'PUBLIC')
        .order('created_at', { ascending: false })
        .limit(10)

    // Calculate stats
    const projectCount = projects?.length || 0
    const totalLikes = projects?.reduce((sum, p) => sum + (p.likes_count || 0), 0) || 0
    const totalViews = projects?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0

    // Get initials for avatar fallback
    const initials = profile.full_name
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'

    return (
        <>
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="container max-w-4xl">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row gap-8 mb-12">
                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold shrink-0 overflow-hidden relative border-4 border-gray-800">
                            {profile.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.full_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl font-medium mb-1">{profile.full_name}</h1>
                                    <p className="text-gray-400">@{profile.username}</p>
                                </div>
                                {profile.is_open_to_work && (
                                    <span className="tag tag-accent">Open to Work</span>
                                )}
                            </div>

                            {(profile.headline || profile.bio) && (
                                <p className="text-gray-300 mb-4 max-w-lg">
                                    {profile.headline || profile.bio}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                {profile.location && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" /> {profile.location}
                                    </span>
                                )}
                                {profile.headline && (
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase className="w-4 h-4" /> {profile.headline}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {profile.github_url && (
                                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost p-2">
                                        <Github className="w-5 h-5" />
                                    </a>
                                )}
                                {profile.linkedin_url && (
                                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost p-2">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {profile.website_url && (
                                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost p-2">
                                        <Globe className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-12">
                        <div className="card p-4 text-center">
                            <p className="text-2xl font-medium">{projectCount}</p>
                            <p className="text-xs text-gray-500">Projects</p>
                        </div>
                        <div className="card p-4 text-center">
                            <p className="text-2xl font-medium">{totalLikes}</p>
                            <p className="text-xs text-gray-500">Likes</p>
                        </div>
                        <div className="card p-4 text-center">
                            <p className="text-2xl font-medium">{totalViews}</p>
                            <p className="text-xs text-gray-500">Views</p>
                        </div>
                    </div>

                    {/* Projects */}
                    <h2 className="text-xl font-medium mb-6">Projects</h2>

                    {projects && projects.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {projects.map((project) => (
                                <Link key={project.id} href={`/project/${project.id}`} className="card overflow-hidden group">
                                    {/* Cover Image */}
                                    <div className="aspect-video bg-gray-900 relative overflow-hidden">
                                        {project.cover_image_url ? (
                                            <Image
                                                src={project.cover_image_url}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Folder className="w-12 h-12 text-gray-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="font-medium mb-1 group-hover:text-blue-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                            {project.short_desc}
                                        </p>
                                        <div className="flex gap-4 text-xs text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-3.5 h-3.5" /> {project.likes_count || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" /> {project.views_count || 0}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 card">
                            <Folder className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500">No public projects yet</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
