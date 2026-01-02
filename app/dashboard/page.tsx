import Link from 'next/link'
import { Plus, Eye, Heart, Folder, Trophy, Code2, BarChart3, Smartphone } from 'lucide-react'

export default function DashboardPage() {
    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-medium mb-1">Welcome back, John</h1>
                    <p className="text-gray-500">Here's what's happening with your portfolio</p>
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
                    <p className="text-3xl font-medium">5,847</p>
                    <p className="text-xs text-accent-green mt-1">+23% from last week</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500">Total Likes</span>
                        <Heart className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-3xl font-medium">1,423</p>
                    <p className="text-xs text-accent-green mt-1">+18% from last week</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500">Projects</span>
                        <Folder className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-3xl font-medium">6</p>
                    <p className="text-xs text-gray-500 mt-1">4 published, 2 drafts</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500">Ranking</span>
                        <Trophy className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-3xl font-medium">#12</p>
                    <p className="text-xs text-accent-green mt-1">↑ 5 positions</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Projects */}
                <div className="lg:col-span-2 card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-medium">Recent Projects</h2>
                        <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:text-white">View all →</Link>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: 'AI Chat Application', time: '2 hours ago', likes: 234, views: '1.2k', icon: Code2 },
                            { title: 'Analytics Dashboard', time: '1 day ago', likes: 189, views: '980', icon: BarChart3 },
                            { title: 'Fitness Tracker App', time: '3 days ago', likes: 0, views: 0, draft: true, icon: Smartphone },
                        ].map((project, i) => {
                            const Icon = project.icon
                            return (
                                <Link key={i} href={`/project/${i + 1}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-900 transition-colors">
                                    <div className="w-12 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-0.5">{project.title}</p>
                                        <p className="text-xs text-gray-500">{project.draft ? 'Draft • ' : ''}Updated {project.time}</p>
                                    </div>
                                    {project.draft ? (
                                        <span className="tag">Draft</span>
                                    ) : (
                                        <div className="text-right">
                                            <p className="text-sm">{project.likes} likes</p>
                                            <p className="text-xs text-gray-500">{project.views} views</p>
                                        </div>
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Activity */}
                <div className="card p-6">
                    <h2 className="font-medium mb-6">Recent Activity</h2>

                    <div className="space-y-4">
                        {[
                            { text: 'Sarah Kim liked your project', time: '2 min ago', accent: true },
                            { text: '3 new views on AI Chat Application', time: '15 min ago' },
                            { text: 'Alex Martinez saved your project', time: '1 hour ago' },
                            { text: 'You published Analytics Dashboard', time: 'Yesterday' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-3 text-sm">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${activity.accent ? 'bg-accent-blue' : 'bg-gray-700'}`} />
                                <div>
                                    <p dangerouslySetInnerHTML={{ __html: activity.text.replace(/(\w+\s\w+)/, '<strong>$1</strong>') }} />
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
