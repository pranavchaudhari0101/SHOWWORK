import Link from 'next/link'
import { TrendingUp, Heart, Eye, ArrowUp, ArrowDown } from 'lucide-react'
import Navbar from '@/components/Navbar'

const topProjects = [
    { rank: 1, title: 'AI Code Review Bot', author: 'Alex Martinez', growth: 234, likes: '12.4k', views: '89k' },
    { rank: 2, title: 'Real-time Collaboration Editor', author: 'Sarah Kim', growth: 189, likes: '9.8k', views: '67k' },
    { rank: 3, title: 'ML Powered Search Engine', author: 'David Chen', growth: 156, likes: '8.2k', views: '54k' },
]

const rankings = [
    { rank: 4, title: 'Serverless CMS Platform', author: 'Marcus Lee', growth: 124, likes: '6.5k', views: '42k' },
    { rank: 5, title: 'Blockchain Voting System', author: 'Aisha Patel', growth: 98, likes: '5.8k', views: '38k' },
    { rank: 6, title: 'Smart Home Dashboard', author: 'James Wilson', growth: 87, likes: '4.9k', views: '31k' },
    { rank: 7, title: 'E-commerce Analytics Tool', author: 'Lisa Thompson', growth: -12, likes: '4.2k', views: '28k' },
    { rank: 8, title: 'Fitness AI Coach', author: 'Michael Brown', growth: 45, likes: '3.8k', views: '25k' },
    { rank: 9, title: 'Social Media Scheduler', author: 'Emma Davis', growth: 32, likes: '3.4k', views: '22k' },
    { rank: 10, title: 'Open Source Design System', author: 'Chris Anderson', growth: 78, likes: '3.1k', views: '19k' },
]

export default function TrendingPage() {
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
                            <button className="btn btn-primary">This Week</button>
                            <button className="btn btn-ghost">This Month</button>
                            <button className="btn btn-ghost">All Time</button>
                        </div>
                    </div>

                    {/* Top 3 Podium */}
                    <div className="grid md:grid-cols-3 gap-4 mb-12">
                        {topProjects.map((project, i) => (
                            <Link
                                key={project.rank}
                                href={`/project/${project.rank}`}
                                className={`card p-6 ${i === 0 ? 'md:order-2 border-accent-blue/30' : i === 1 ? 'md:order-1' : 'md:order-3'}`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`text-2xl font-bold ${i === 0 ? 'text-accent-blue' : 'text-gray-500'}`}>#{project.rank}</span>
                                    <span className="text-xs text-accent-green flex items-center gap-1">
                                        <ArrowUp className="w-3 h-3" /> +{project.growth}%
                                    </span>
                                </div>
                                <h3 className="font-medium mb-1">{project.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">by {project.author}</p>
                                <div className="flex gap-4 text-xs text-gray-600">
                                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {project.likes}</span>
                                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {project.views}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Rankings Table */}
                    <div className="card overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium p-4">Rank</th>
                                    <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium p-4">Project</th>
                                    <th className="text-left text-xs uppercase tracking-wider text-gray-500 font-medium p-4 hidden md:table-cell">Author</th>
                                    <th className="text-right text-xs uppercase tracking-wider text-gray-500 font-medium p-4">Growth</th>
                                    <th className="text-right text-xs uppercase tracking-wider text-gray-500 font-medium p-4 hidden sm:table-cell">Likes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings.map((project) => (
                                    <tr key={project.rank} className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-400">#{project.rank}</td>
                                        <td className="p-4">
                                            <Link href={`/project/${project.rank}`} className="hover:text-white transition-colors">
                                                {project.title}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-gray-500 hidden md:table-cell">{project.author}</td>
                                        <td className="p-4 text-right">
                                            <span className={`flex items-center justify-end gap-1 text-sm ${project.growth >= 0 ? 'text-accent-green' : 'text-red-400'}`}>
                                                {project.growth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                                {Math.abs(project.growth)}%
                                            </span>
                                        </td>
                                        <td className="p-4 text-right text-gray-400 hidden sm:table-cell">{project.likes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
