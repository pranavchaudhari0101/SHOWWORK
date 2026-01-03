import Link from 'next/link'
import { Heart, Bookmark, Share2, ExternalLink, Github, ChevronLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function ProjectPage({ params: _params }: { params: { id: string } }) {
    return (
        <>
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="container max-w-4xl">
                    {/* Breadcrumb */}
                    <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6">
                        <ChevronLeft className="w-4 h-4" /> Back to Explore
                    </Link>

                    {/* Project Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-medium mb-2">AI Chat Application</h1>
                        <p className="text-gray-400">A real-time AI-powered chat assistant built with modern technologies</p>
                    </div>

                    {/* Cover Image */}
                    <div className="aspect-video bg-gray-900 rounded-xl mb-8 flex items-center justify-center">
                        <span className="text-gray-700">Project Cover</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-900">
                        <div className="flex gap-2">
                            <button className="btn btn-secondary">
                                <Heart className="w-4 h-4" /> Like
                            </button>
                            <button className="btn btn-secondary">
                                <Bookmark className="w-4 h-4" /> Save
                            </button>
                            <button className="btn btn-ghost">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <a href="#" className="btn btn-secondary">
                                <Github className="w-4 h-4" /> Source Code
                            </a>
                            <a href="#" className="btn btn-primary">
                                <ExternalLink className="w-4 h-4" /> Live Demo
                            </a>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <h2 className="font-medium mb-4">About this project</h2>
                            <div className="prose prose-invert max-w-none text-gray-300 space-y-4">
                                <p>
                                    This AI Chat Application is a sophisticated real-time assistant that leverages the power of modern language models to provide intelligent, context-aware responses.
                                </p>
                                <p>
                                    Built with React for the frontend and Node.js for the backend, it features seamless integration with OpenAI&apos;s API, real-time message streaming, and a beautiful, responsive interface.
                                </p>
                                <h3 className="text-white font-medium mt-6 mb-2">Key Features</h3>
                                <ul className="list-disc list-inside text-gray-400 space-y-1">
                                    <li>Real-time message streaming</li>
                                    <li>Context-aware conversations</li>
                                    <li>Code syntax highlighting</li>
                                    <li>Dark/Light mode support</li>
                                    <li>Export conversation history</li>
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Author Card */}
                            <div className="card p-6">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">Created by</p>
                                <Link href="/profile/alexmartinez" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <div className="avatar">AM</div>
                                    <div>
                                        <p className="font-medium">Alex Martinez</p>
                                        <p className="text-sm text-gray-500">Full-Stack Developer</p>
                                    </div>
                                </Link>
                            </div>

                            {/* Tech Stack */}
                            <div className="card p-6">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">Tech Stack</p>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'TypeScript', 'Node.js', 'OpenAI', 'Tailwind CSS', 'Socket.io'].map((tech) => (
                                        <span key={tech} className="tag">{tech}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="card p-6">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">Stats</p>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Views</span>
                                        <span>12,456</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Likes</span>
                                        <span>1,823</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Saves</span>
                                        <span>342</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Published</span>
                                        <span>Jan 15, 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>
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
