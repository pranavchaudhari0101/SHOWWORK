import Link from 'next/link'
import Image from 'next/image'
import { Search, Heart, Eye, Folder } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'

export default async function ExplorePage() {
    const supabase = await createClient()

    // Fetch public projects with profile info
    const { data: projects } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            short_desc,
            cover_image_url,
            likes_count,
            views_count,
            created_at,
            profiles (
                username,
                full_name,
                avatar_url
            )
        `)
        .eq('visibility', 'PUBLIC')
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <>
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="container">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-3xl font-medium mb-2">Explore Projects</h1>
                            <p className="text-gray-500">Discover amazing work from talented students</p>
                        </div>

                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="input pl-10 w-full md:w-80"
                            />
                        </div>
                    </div>

                    {/* Projects Grid */}
                    {projects && projects.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => {
                                const profile = Array.isArray(project.profiles)
                                    ? project.profiles[0]
                                    : project.profiles

                                return (
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

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {profile?.avatar_url ? (
                                                        <Image
                                                            src={profile.avatar_url}
                                                            alt={profile.full_name || 'User'}
                                                            width={24}
                                                            height={24}
                                                            className="rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-medium">
                                                            {profile?.full_name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                    <span className="text-sm text-gray-400">
                                                        {profile?.full_name || profile?.username || 'Anonymous'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="w-3 h-3" />
                                                        {project.likes_count || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {project.views_count || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Folder className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <h2 className="text-xl font-medium mb-2">No projects yet</h2>
                            <p className="text-gray-500 mb-6">Be the first to share your work!</p>
                            <Link href="/upload" className="btn btn-primary">
                                Upload a Project
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
