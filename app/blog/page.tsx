import Navbar from '@/components/Navbar'
import { Calendar, ArrowRight } from 'lucide-react'

const blogPosts = [
    {
        id: 1,
        title: "How to Build a Portfolio That Gets You Hired",
        excerpt: "Learn the key elements that make a developer portfolio stand out to recruiters and hiring managers.",
        date: "2026-01-02",
        category: "Career",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Top 10 Project Ideas for Your Portfolio",
        excerpt: "Stuck on what to build? Here are 10 impressive project ideas that showcase different skills.",
        date: "2025-12-28",
        category: "Projects",
        readTime: "7 min read"
    },
    {
        id: 3,
        title: "Why Side Projects Matter More Than Ever",
        excerpt: "In a competitive job market, side projects can be your secret weapon. Here's why.",
        date: "2025-12-20",
        category: "Career",
        readTime: "4 min read"
    },
    {
        id: 4,
        title: "Introducing ShowWork 2.0: Faster, Smarter, Better",
        excerpt: "We've completely rebuilt ShowWork from the ground up. Here's what's new.",
        date: "2025-12-15",
        category: "Product",
        readTime: "3 min read"
    }
]

export default function BlogPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Blog</h1>
                        <p className="text-gray-400">
                            Insights, tips, and updates from the ShowWork team
                        </p>
                    </div>

                    {/* Blog Posts */}
                    <div className="space-y-6">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="card p-6 hover:border-gray-700 transition-colors group">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="tag text-xs">{post.category}</span>
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    <span className="text-xs text-gray-600">•</span>
                                    <span className="text-xs text-gray-500">{post.readTime}</span>
                                </div>
                                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                                <span className="text-sm text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Read more <ArrowRight className="w-4 h-4" />
                                </span>
                            </article>
                        ))}
                    </div>

                    {/* Coming Soon */}
                    <div className="text-center mt-12 py-8 border-t border-gray-800">
                        <p className="text-gray-500">More articles coming soon!</p>
                    </div>
                </div>
            </main>
        </>
    )
}
