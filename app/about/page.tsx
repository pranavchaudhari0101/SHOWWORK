import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Users, Target, Lightbulb, Heart } from 'lucide-react'

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container max-w-4xl">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">About ShowWork</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            We&apos;re building the platform where students and developers showcase their best work and get discovered by the world.
                        </p>
                    </div>

                    {/* Mission */}
                    <section className="mb-16">
                        <div className="card p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="w-6 h-6 text-blue-400" />
                                <h2 className="text-2xl font-semibold">Our Mission</h2>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                ShowWork exists to bridge the gap between talented developers and opportunities.
                                We believe that your work should speak for itself. Whether you&apos;re a student
                                building your first project or an experienced developer with a portfolio of
                                impressive work, ShowWork gives you a platform to showcase your skills and
                                get noticed.
                            </p>
                        </div>
                    </section>

                    {/* Values */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-semibold mb-8 text-center">What We Believe</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="card p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Lightbulb className="w-6 h-6 text-green-400" />
                                </div>
                                <h3 className="font-medium mb-2">Skills Over Credentials</h3>
                                <p className="text-sm text-gray-500">
                                    What you can build matters more than where you studied.
                                </p>
                            </div>
                            <div className="card p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="font-medium mb-2">Community First</h3>
                                <p className="text-sm text-gray-500">
                                    Learn, share, and grow together with fellow developers.
                                </p>
                            </div>
                            <div className="card p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-6 h-6 text-red-400" />
                                </div>
                                <h3 className="font-medium mb-2">Passion Driven</h3>
                                <p className="text-sm text-gray-500">
                                    Built by developers, for developers who love what they do.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Story */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 mb-4">
                                ShowWork started with a simple observation: talented students were building
                                amazing projects but had no good way to showcase them. GitHub is great for
                                code, but it doesn&apos;t tell the story of what you built and why.
                            </p>
                            <p className="text-gray-300 mb-4">
                                We created ShowWork to be the place where developers can present their work
                                beautifully - with context, visuals, and the narrative behind each project.
                                It&apos;s portfolio meets social network, designed specifically for the developer community.
                            </p>
                            <p className="text-gray-300">
                                Today, ShowWork is home to thousands of projects from developers around the
                                world. Every day, new talent is discovered and opportunities are created
                                through the power of showcasing great work.
                            </p>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center">
                        <div className="card p-8">
                            <h2 className="text-2xl font-semibold mb-4">Ready to showcase your work?</h2>
                            <p className="text-gray-400 mb-6">
                                Join thousands of developers sharing their best projects.
                            </p>
                            <Link href="/register" className="btn btn-primary">
                                Get Started Free
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}
