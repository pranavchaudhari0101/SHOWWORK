import Link from 'next/link'
import { Layers, Brain, Layout, Server, Smartphone, Database, Cloud, Palette, Shield, Cpu, Globe, Code2 } from 'lucide-react'
import Navbar from '@/components/Navbar'

import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering to ensure fresh counts
export const dynamic = 'force-dynamic'

const categoryConfig = [
    { slug: 'fullstack', name: 'Full-Stack Developer', icon: Layers, desc: 'End-to-end web applications' },
    { slug: 'frontend', name: 'Frontend Developer', icon: Layout, desc: 'User interfaces and experiences' },
    { slug: 'backend', name: 'Backend Developer', icon: Server, desc: 'APIs and server architecture' },
    { slug: 'ml', name: 'AI/ML Engineer', icon: Brain, desc: 'Machine learning and AI models' },
    { slug: 'mobile', name: 'Mobile Developer', icon: Smartphone, desc: 'iOS and Android applications' },
    { slug: 'data', name: 'Data Scientist', icon: Database, desc: 'Data analysis and visualization' },
    { slug: 'devops', name: 'DevOps Engineer', icon: Cloud, desc: 'Infrastructure and deployment' },
    { slug: 'uiux', name: 'UX/UI Designer', icon: Palette, desc: 'Design systems and prototypes' },
    { slug: 'security', name: 'Security Engineer', icon: Shield, desc: 'Security audits and penetration testing' },
    { slug: 'embedded', name: 'Embedded Systems', icon: Cpu, desc: 'Hardware and IoT projects' },
    { slug: 'web3', name: 'Web3 Developer', icon: Globe, desc: 'Blockchain and decentralized apps' },
    { slug: 'game', name: 'Game Developer', icon: Code2, desc: 'Games and interactive media' },
]

export default async function CategoriesPage() {
    const supabase = await createClient()

    // Fetch counts for all categories
    const categories = await Promise.all(
        categoryConfig.map(async (cat) => {
            const { count } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('category', cat.slug)
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

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="container">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-headline mb-4">Categories</h1>
                        <p className="text-lg text-gray-400">Browse projects by specialization</p>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => {
                            const Icon = category.icon
                            return (
                                <Link
                                    key={category.slug}
                                    href={`/explore?category=${category.slug}`}
                                    className="category-card group"
                                >
                                    <div className="category-icon group-hover:border-gray-700 transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">{category.name}</p>
                                        <p className="text-sm text-gray-500 mb-1">{category.desc}</p>
                                        <p className="text-xs text-gray-600">{category.count.toLocaleString()} projects</p>
                                    </div>
                                </Link>
                            )
                        })}
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
