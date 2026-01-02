import Link from 'next/link'
import Image from 'next/image'
import { Search, Heart, Eye, Code2, BarChart3, Smartphone, Brain, Cloud, Lock } from 'lucide-react'

export default function ExplorePage() {
    const projects = [
        { id: 1, title: 'AI Code Assistant', author: 'Alex Martinez', tags: ['React', 'OpenAI', 'TypeScript'], likes: '1.8k', views: '12k', icon: Code2 },
        { id: 2, title: 'Real-time Analytics', author: 'Sarah Kim', tags: ['Next.js', 'D3.js'], likes: '892', views: '5.4k', icon: BarChart3 },
        { id: 3, title: 'Fitness Tracker', author: 'James Wilson', tags: ['React Native', 'Firebase'], likes: '654', views: '3.2k', icon: Smartphone },
        { id: 4, title: 'ML Image Classifier', author: 'David Chen', tags: ['Python', 'TensorFlow'], likes: '1.2k', views: '8.1k', icon: Brain },
        { id: 5, title: 'Serverless Deploy CLI', author: 'Marcus Lee', tags: ['Go', 'Docker', 'AWS'], likes: '567', views: '2.9k', icon: Cloud },
        { id: 6, title: 'Password Manager', author: 'Aisha Patel', tags: ['Rust', 'React'], likes: '423', views: '2.1k', icon: Lock },
    ]

    return (
        <>
            {/* Navigation */}
            <nav className="navbar">
                <div className="container flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="ShowWork" width={140} height={40} className="h-8 w-auto" />
                    </Link>


                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/explore" className="nav-link text-white">Explore</Link>
                        <Link href="/categories" className="nav-link">Categories</Link>
                        <Link href="/trending" className="nav-link">Trending</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="nav-link hidden md:block">Sign in</Link>
                        <Link href="/register" className="btn btn-primary">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="container">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-headline mb-4">Explore Projects</h1>
                        <p className="text-lg text-gray-400">Discover what students are building</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-900">
                        {/* Search */}
                        <div className="flex-1 max-w-xs relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input type="text" className="input pl-12" placeholder="Search projects..." />
                        </div>

                        {/* Filter buttons */}
                        <div className="flex gap-2">
                            <select className="input w-auto cursor-pointer">
                                <option>All Categories</option>
                                <option>Full-Stack</option>
                                <option>Frontend</option>
                                <option>Backend</option>
                                <option>AI/ML</option>
                                <option>Mobile</option>
                            </select>

                            <select className="input w-auto cursor-pointer">
                                <option>Most Recent</option>
                                <option>Most Liked</option>
                                <option>Most Viewed</option>
                            </select>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => {
                            const Icon = project.icon
                            return (
                                <Link key={project.id} href={`/project/${project.id}`} className="project-card">
                                    <div className="project-image">
                                        <Icon className="w-8 h-8 text-gray-700 relative z-10" />
                                    </div>
                                    <div className="project-body">
                                        <h3 className="font-medium mb-1">{project.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">by {project.author}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="flex gap-4 text-xs text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-3.5 h-3.5" /> {project.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" /> {project.views}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-12">
                        <button className="btn btn-secondary">Load more projects</button>
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
