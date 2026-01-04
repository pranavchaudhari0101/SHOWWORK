import Link from 'next/link'
import { TrendingUp, Heart, Eye, Folder } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function TrendingPage() {
    const supabase = await createClient()

    // Fetch top 20 public projects sorted by likes then views
    const { data: rawProjects } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            likes_count,
            views_count,
            profiles:profile_id (
                full_name,
                username
            )
        `)
        .eq('visibility', 'PUBLIC')
        .order('likes_count', { ascending: false })
        .order('views_count', { ascending: false })
        .limit(20)

    // Normalize data to handle Supabase join array/object ambiguity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projects = rawProjects?.map((p: any) => ({
        ...p,
        author: Array.isArray(p.profiles) ? p.profiles[0]?.full_name : p.profiles?.full_name,
        username: Array.isArray(p.profiles) ? p.profiles[0]?.username : p.profiles?.username
    })) || []

    const top3 = projects.slice(0, 3)
    const rest = projects.slice(3)

    return (
        <>
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="container">
                    {/* Header */}
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-accent-green" />
                                <span className="text-sm text-accent-green font-medium">Live Rankings</span>
                            </div>
                            <h1 className="text-headline">Trending Projects</h1>
                        </div>

                        <div className="flex gap-2">
                            <button className="btn btn-primary">All Time</button>
                            {/* <button className="btn btn-ghost">This Week</button> */}
                        </div>
                    </div>

                    {/* Top 3 Podium */}
                    {top3.length > 0 && (
                        <div className="grid md:grid-cols-3 gap-4 mb-12">
                            {top3.map((project, i) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.id}`}
                                    className={`card p-6 flex flex-col justify-between ${i === 0 ? 'md:order-2 border-accent-blue/30 bg-accent-blue/5' : i === 1 ? 'md:order-1' : 'md:order-3'}`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-4xl font-bold ${i === 0 ? 'text-accent-blue' : i === 1 ? 'text-gray-300' : 'text-amber-700'}`}>
                                                #{i + 1}
                                            </span>
                                            {i === 0 && <span className="badge badge-primary">Top 1</span>}
                                        </div>

                                        <h3 className="font-medium text-lg mb-1 truncate" title={project.title}>{project.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4 truncate">by {project.author || 'Unknown'}</p>
                                    </div>

                                    <div className="flex gap-4 text-sm text-gray-500 pt-4 border-t border-gray-800">
                                        <div className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {project.likes_count}</div>
                                        <div className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {project.views_count}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Rankings Table */}
                    {rest.length > 0 ? (
                        <div className="card overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium p-4">Rank</th>
                                        <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium p-4">Project</th>
                                        <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium p-4 hidden md:table-cell">Author</th>
                                        <th className="text-right text-xs uppercase tracking-wider text-gray-500 font-medium p-4">Stats</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rest.map((project, index) => (
                                        <tr key={project.id} className="border-b border-gray-900 last:border-0 hover:bg-gray-900/50 transition-colors">
                                            <td className="p-4 font-medium text-gray-400">#{index + 4}</td>
                                            <td className="p-4">
                                                <Link href={`/project/${project.id}`} className="flex items-center gap-3 hover:text-white transition-colors group">
                                                    <div className="p-2 bg-gray-900 rounded group-hover:bg-gray-800 transition-colors">
                                                        <Folder className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    <span className="font-medium">{project.title}</span>
                                                </Link>
                                            </td>
                                            <td className="p-4 text-gray-500 hidden md:table-cell">
                                                {project.author || 'Unknown'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {project.likes_count}</span>
                                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {project.views_count}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        top3.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-500">No trending projects yet.</p>
                            </div>
                        )
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">© 2026 ShowWork. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="nav-link">Privacy</Link>
                            <Link href="#" className="nav-link">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
