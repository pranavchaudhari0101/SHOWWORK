import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { MapPin, Clock, Briefcase, ArrowRight, Heart, Zap, Users } from 'lucide-react'

const openPositions = [
    {
        id: 1,
        title: "Frontend Developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description: "We're looking for a passionate Frontend Developer to help build the next generation of ShowWork. You'll work on our React/Next.js codebase, creating beautiful and performant user experiences.",
        requirements: [
            "3+ years of experience with React and TypeScript",
            "Strong understanding of modern CSS and responsive design",
            "Experience with Next.js and server-side rendering",
            "Passion for clean, maintainable code",
            "Good eye for design and attention to detail"
        ],
        niceToHave: [
            "Experience with Tailwind CSS",
            "Familiarity with Supabase or similar BaaS",
            "Open source contributions",
            "Portfolio of side projects"
        ]
    }
]

const benefits = [
    {
        icon: Heart,
        title: "Health & Wellness",
        desc: "Comprehensive health insurance for you and your family"
    },
    {
        icon: Zap,
        title: "Flexible Work",
        desc: "Work from anywhere, on your schedule"
    },
    {
        icon: Users,
        title: "Great Team",
        desc: "Work with passionate, talented people"
    }
]

export default function CareersPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container max-w-4xl">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Help us build the platform where developers showcase their best work.
                            We're a small, remote team making a big impact.
                        </p>
                    </div>

                    {/* Why Join */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-semibold mb-8 text-center">Why ShowWork?</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="card p-6 text-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                                        <benefit.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="font-medium mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-gray-500">{benefit.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Open Positions */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-8">Open Positions</h2>

                        {openPositions.length > 0 ? (
                            <div className="space-y-6">
                                {openPositions.map((position) => (
                                    <div key={position.id} className="card p-6">
                                        {/* Header */}
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                                                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase className="w-4 h-4" />
                                                        {position.department}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {position.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {position.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="tag bg-green-500/10 text-green-400 border-green-500/20">
                                                Now Hiring
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-300 mb-6">{position.description}</p>

                                        {/* Requirements */}
                                        <div className="mb-6">
                                            <h4 className="font-medium mb-3">Requirements</h4>
                                            <ul className="space-y-2">
                                                {position.requirements.map((req, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                                        <span className="text-blue-400 mt-1">•</span>
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Nice to Have */}
                                        <div className="mb-6">
                                            <h4 className="font-medium mb-3">Nice to Have</h4>
                                            <ul className="space-y-2">
                                                {position.niceToHave.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                                        <span className="text-green-400 mt-1">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Apply */}
                                        <a
                                            href="mailto:careers@showwork.dev?subject=Application: Frontend Developer"
                                            className="btn btn-primary inline-flex"
                                        >
                                            Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card p-8 text-center">
                                <p className="text-gray-400 mb-4">No open positions at the moment.</p>
                                <p className="text-sm text-gray-500">
                                    Check back later or follow us for updates!
                                </p>
                            </div>
                        )}
                    </section>

                    {/* General Application */}
                    <section className="mt-12 text-center">
                        <div className="card p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                            <h3 className="text-xl font-semibold mb-3">Don't see a role for you?</h3>
                            <p className="text-gray-400 mb-6">
                                We're always looking for talented people. Send us your resume and we'll keep you in mind.
                            </p>
                            <a
                                href="mailto:careers@showwork.dev?subject=General Application"
                                className="btn btn-secondary"
                            >
                                Send General Application
                            </a>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}
