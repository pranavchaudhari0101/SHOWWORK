import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Github, Play, ExternalLink, BarChart2, Search, LinkIcon, Brain, Layout, Server, Smartphone, Plus, Layers } from 'lucide-react'
import Navbar from '@/components/Navbar'

import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering to ensure fresh counts
export const dynamic = 'force-dynamic'

export default async function HomePage() {
    const supabase = await createClient()

    // Fetch counts for categories
    const categoriesToCheck = [
        { id: 'fullstack', label: 'Full-Stack Developer', icon: Layers },
        { id: 'ml', label: 'AI/ML Engineer', icon: Brain },
        { id: 'frontend', label: 'Frontend Developer', icon: Layout },
        { id: 'backend', label: 'Backend Developer', icon: Server },
        { id: 'mobile', label: 'Mobile Developer', icon: Smartphone },
    ]

    const categoryStats = await Promise.all(
        categoriesToCheck.map(async (cat) => {
            const { count } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('category', cat.id)
                .eq('visibility', 'PUBLIC')

            return {
                ...cat,
                count: count || 0
            }
        })
    )

    return (
        <>
            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="max-w-2xl">
                        <div className="hero-badge fade-up fade-up-1">
                            <span className="dot" />
                            <span>Join 10,000+ students</span>
                        </div>

                        <h1 className="text-display mb-6 fade-up fade-up-2">
                            Showcase your work<span className="accent-dot">.</span><br />
                            Get discovered<span className="accent-dot">.</span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-8 max-w-lg fade-up fade-up-3">
                            The portfolio platform built for ambitious students. Share your projects, connect with recruiters, and land your dream role.
                        </p>

                        <div className="flex flex-wrap gap-4 fade-up fade-up-4">
                            <Link href="/register" className="btn btn-primary">
                                Start for free
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/explore" className="btn btn-secondary">
                                Explore projects
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section border-t border-gray-900">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl md:text-5xl font-medium mb-2">10k+</p>
                            <p className="text-sm text-gray-500">Active Students</p>
                        </div>
                        <div>
                            <p className="text-4xl md:text-5xl font-medium mb-2">25k+</p>
                            <p className="text-sm text-gray-500">Projects Shared</p>
                        </div>
                        <div>
                            <p className="text-4xl md:text-5xl font-medium mb-2">500+</p>
                            <p className="text-sm text-gray-500">Partner Companies</p>
                        </div>
                        <div>
                            <p className="text-4xl md:text-5xl font-medium mb-2">89%</p>
                            <p className="text-sm text-gray-500">Hire Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section">
                <div className="container">
                    <div className="max-w-lg mx-auto text-center mb-16">
                        <p className="section-label">Features</p>
                        <h2 className="section-title">Everything you need to stand out</h2>
                        <p className="section-desc">Built for developers who ship. Designed for recruiters who hire.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="feature-card">
                            <div className="feature-icon accent">
                                <Github className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-medium mb-3">GitHub Integration</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Connect your repositories. Auto-import your best work with a single click.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Play className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-medium mb-3">Video Demos</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Show, don&apos;t tell. Upload 2-minute demos that showcase your projects in action.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <ExternalLink className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-medium mb-3">Live Previews</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Let recruiters interact with your deployed apps. No downloads needed.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <BarChart2 className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-medium mb-3">Analytics</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Track who&apos;s viewing your work. Understand what resonates with recruiters.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Search className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-medium mb-3">Discovery</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Get found by recruiters searching for your exact skill set.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <LinkIcon className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-medium mb-3">Custom URL</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Your personal showwork.dev/username. One link for your entire portfolio.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section bg-gray-950">
                <div className="container">
                    <div className="max-w-lg mb-16">
                        <p className="section-label">Categories</p>
                        <h2 className="section-title">Find your community</h2>
                        <p className="section-desc">Browse projects by specialization. Connect with peers in your field.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryStats.map((cat) => (
                            <Link key={cat.id} href={`/explore?category=${cat.id}`} className="category-card">
                                <div className="category-icon">
                                    <cat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium mb-1">{cat.label}</p>
                                    <p className="text-sm text-gray-500">{cat.count} projects</p>
                                </div>
                            </Link>
                        ))}

                        <Link href="/explore" className="category-card border-dashed">
                            <div className="category-icon">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-medium mb-1">View All Categories</p>
                                <p className="text-sm text-gray-500">12 specializations</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section">
                <div className="container">
                    <div className="max-w-lg mx-auto text-center mb-16">
                        <p className="section-label">How it works</p>
                        <h2 className="section-title">Three steps to your dream job</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center mx-auto mb-6 text-accent-blue font-medium">1</div>
                            <h3 className="text-lg font-medium mb-3">Create your profile</h3>
                            <p className="text-sm text-gray-500">Sign up in 30 seconds. Add your skills, education, and professional links.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center mx-auto mb-6 text-accent-blue font-medium">2</div>
                            <h3 className="text-lg font-medium mb-3">Upload your projects</h3>
                            <p className="text-sm text-gray-500">Add descriptions, tech stack, demos, and GitHub links. Let your work speak.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center mx-auto mb-6 text-accent-blue font-medium">3</div>
                            <h3 className="text-lg font-medium mb-3">Get discovered</h3>
                            <p className="text-sm text-gray-500">Recruiters find you through search, trending projects, and referrals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-gray-950 border-t border-b border-gray-900 text-center">
                <div className="container">
                    <h2 className="text-3xl md:text-4xl font-medium mb-4">
                        Ready to showcase your work<span className="accent-dot">?</span>
                    </h2>
                    <p className="text-lg text-gray-400 mb-8">Join thousands of students who&apos;ve already landed their dream roles.</p>
                    <Link href="/register" className="btn btn-primary px-8 py-4 text-base">
                        Create your portfolio
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-1">
                            <Link href="/" className="inline-flex mb-4">
                                <Image src="/logo.png" alt="ShowWork" width={140} height={40} className="h-8 w-auto" />
                            </Link>
                            <p className="text-sm text-gray-500 mt-4">The portfolio platform for ambitious students.</p>
                        </div>


                        <div>
                            <h4 className="footer-heading">Product</h4>
                            <ul className="space-y-3">
                                <li><Link href="/explore" className="footer-link">Explore</Link></li>
                                <li><Link href="/categories" className="footer-link">Categories</Link></li>
                                <li><Link href="/trending" className="footer-link">Trending</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-heading">Company</h4>
                            <ul className="space-y-3">
                                <li><Link href="#" className="footer-link">About</Link></li>
                                <li><Link href="#" className="footer-link">Blog</Link></li>
                                <li><Link href="#" className="footer-link">Careers</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-heading">Legal</h4>
                            <ul className="space-y-3">
                                <li><Link href="#" className="footer-link">Privacy</Link></li>
                                <li><Link href="#" className="footer-link">Terms</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-900">
                        <p className="text-sm text-gray-600">© 2026 ShowWork. All rights reserved.</p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
