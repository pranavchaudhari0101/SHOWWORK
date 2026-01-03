import Link from 'next/link'
import { MapPin, Building2, Briefcase, Github, Linkedin, Globe, Heart, Eye } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function ProfilePage({ params }: { params: { username: string } }) {
    return (
        <>
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="container max-w-4xl">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row gap-8 mb-12">
                        <div className="avatar w-32 h-32 text-3xl shrink-0">JD</div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl font-medium mb-1">John Doe</h1>
                                    <p className="text-gray-400">@{params.username}</p>
                                </div>
                                <span className="tag tag-accent">Open to Work</span>
                            </div>

                            <p className="text-gray-300 mb-4 max-w-lg">
                                Full-Stack Developer passionate about building products that matter. Currently exploring AI/ML integration in web applications.
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> San Francisco, CA</span>
                                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Stanford University</span>
                                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Full-Stack Developer</span>
                            </div>

                            <div className="flex gap-3">
                                <a href="#" className="btn btn-ghost p-2"><Github className="w-5 h-5" /></a>
                                <a href="#" className="btn btn-ghost p-2"><Linkedin className="w-5 h-5" /></a>
                                <a href="#" className="btn btn-ghost p-2"><Globe className="w-5 h-5" /></a>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <div className="card p-4 text-center">
                            <p className="text-2xl font-medium">6</p>
                            <p className="text-xs text-gray-500">Projects</p>
                        </div>
                        <div className="card p-4 text-center">
                            <p className="text-2xl font-medium">1.4k</p>
                            <p className="text-xs text-gray-500">Likes</p>
                        </div>
                        <div className="card p-4 text-center">
                            <p className="text-2xl font-medium">5.8k</p>
                            <p className="text-xs text-gray-500">Views</p>
                        </div>
                        <div className="card p-4 text-center">
                            <p className="text-2xl font-medium">#12</p>
                            <p className="text-xs text-gray-500">Ranking</p>
                        </div>
                    </div>

                    {/* Projects */}
                    <h2 className="text-xl font-medium mb-6">Projects</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { id: 1, title: 'AI Chat Application', desc: 'Real-time AI assistant', likes: 234, views: '1.2k' },
                            { id: 2, title: 'Analytics Dashboard', desc: 'Data visualization tool', likes: 189, views: '980' },
                            { id: 3, title: 'E-commerce Platform', desc: 'Full-stack marketplace', likes: 156, views: '850' },
                            { id: 4, title: 'Task Management App', desc: 'Productivity tool', likes: 98, views: '620' },
                        ].map((project) => (
                            <Link key={project.id} href={`/project/${project.id}`} className="project-card">
                                <div className="project-image h-32">
                                    <div className="w-8 h-8 bg-gray-800 rounded-lg relative z-10" />
                                </div>
                                <div className="project-body">
                                    <h3 className="font-medium mb-1">{project.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{project.desc}</p>
                                    <div className="flex gap-4 text-xs text-gray-600">
                                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {project.likes}</span>
                                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {project.views}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">© 2026 ShowWork. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
