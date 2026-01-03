'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugPage() {
    const supabase = createClient()
    const [debug, setDebug] = useState<{
        user: unknown
        profile: unknown
        projects: unknown
        publicProjects: unknown
        error: string | null
    }>({
        user: null,
        profile: null,
        projects: null,
        publicProjects: null,
        error: null
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function runDebug() {
            try {
                // 1. Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser()

                if (userError) {
                    setDebug(prev => ({ ...prev, error: `User error: ${userError.message}` }))
                    return
                }

                setDebug(prev => ({ ...prev, user: user ? { id: user.id, email: user.email } : null }))

                // 2. Get profile if user exists
                if (user) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('id, username, full_name')
                        .eq('user_id', user.id)
                        .single()

                    if (profileError) {
                        setDebug(prev => ({ ...prev, error: `Profile error: ${profileError.message}` }))
                    } else {
                        setDebug(prev => ({ ...prev, profile }))

                        // 3. Get user's projects
                        const { data: projects, error: projectsError } = await supabase
                            .from('projects')
                            .select('id, title, visibility, profile_id')
                            .eq('profile_id', profile.id)

                        if (projectsError) {
                            setDebug(prev => ({ ...prev, error: `Projects error: ${projectsError.message}` }))
                        } else {
                            setDebug(prev => ({ ...prev, projects }))
                        }
                    }
                }

                // 4. Get all public projects (regardless of user)
                const { data: publicProjects, error: publicError } = await supabase
                    .from('projects')
                    .select('id, title, visibility, profile_id')
                    .eq('visibility', 'PUBLIC')
                    .limit(10)

                if (publicError) {
                    setDebug(prev => ({ ...prev, error: `Public projects error: ${publicError.message}` }))
                } else {
                    setDebug(prev => ({ ...prev, publicProjects }))
                }

            } catch (err) {
                setDebug(prev => ({ ...prev, error: `Unexpected: ${err}` }))
            } finally {
                setLoading(false)
            }
        }

        runDebug()
    }, [supabase])

    if (loading) {
        return <div className="p-8 text-white">Loading debug info...</div>
    }

    return (
        <div className="p-8 text-white max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">🔍 Debug Page</h1>

            {debug.error && (
                <div className="bg-red-900/50 border border-red-500 p-4 rounded mb-6">
                    <strong>Error:</strong> {debug.error}
                </div>
            )}

            <div className="space-y-6">
                <section className="bg-gray-800 p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">1. Current User</h2>
                    <pre className="text-sm overflow-auto">{JSON.stringify(debug.user, null, 2)}</pre>
                </section>

                <section className="bg-gray-800 p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">2. User Profile</h2>
                    <pre className="text-sm overflow-auto">{JSON.stringify(debug.profile, null, 2)}</pre>
                </section>

                <section className="bg-gray-800 p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">3. User Projects (by profile_id)</h2>
                    <pre className="text-sm overflow-auto">{JSON.stringify(debug.projects, null, 2)}</pre>
                </section>

                <section className="bg-gray-800 p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">4. Public Projects (visibility=PUBLIC)</h2>
                    <pre className="text-sm overflow-auto">{JSON.stringify(debug.publicProjects, null, 2)}</pre>
                </section>
            </div>

            <div className="mt-8 text-sm text-gray-400">
                <p>If sections 3 or 4 show an empty array [], check:</p>
                <ul className="list-disc ml-6 mt-2">
                    <li>Did you run fix_rls_v2.sql in Supabase?</li>
                    <li>Are there any projects in the database?</li>
                    <li>Is the visibility column set correctly (PUBLIC vs DRAFT)?</li>
                </ul>
            </div>
        </div>
    )
}
