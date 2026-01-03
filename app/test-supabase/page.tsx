import { createClient } from '@/lib/supabase/server'

export default async function TestSupabasePage() {
    const supabase = await createClient()

    // Test database connection by fetching from todos table
    const { data: todos, error } = await supabase.from('todos').select()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                    <h1 className="text-4xl font-bold text-white mb-6">
                        Supabase Connection Test
                    </h1>

                    {error ? (
                        <div className="bg-red-500/20 border border-red-500 text-red-100 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-2">❌ Connection Error</h2>
                            <p className="font-mono text-sm">{error.message}</p>
                            <div className="mt-4 text-sm opacity-80">
                                <p><strong>Troubleshooting:</strong></p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Check your .env.local file has correct NEXT_PUBLIC_SUPABASE_URL</li>
                                    <li>Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct</li>
                                    <li>Ensure the &apos;todos&apos; table exists in your Supabase database</li>
                                    <li>Restart your development server after changing .env.local</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-500/20 border border-green-500 text-green-100 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">✅ Connection Successful!</h2>

                            {todos && todos.length > 0 ? (
                                <div>
                                    <p className="mb-4">Found {todos.length} todo(s) in your database:</p>
                                    <ul className="space-y-2">
                                        {todos.map((todo, index) => (
                                            <li
                                                key={todo.id || index}
                                                className="bg-white/10 rounded-lg p-4 font-mono text-sm"
                                            >
                                                {JSON.stringify(todo, null, 2)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div>
                                    <p className="mb-2">✅ Connected to Supabase successfully!</p>
                                    <p className="text-sm opacity-80">
                                        The &apos;todos&apos; table exists but contains no data yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8 text-white/60 text-sm">
                        <p><strong>Environment Variables Being Used:</strong></p>
                        <code className="block mt-2 bg-black/30 p-4 rounded-lg">
                            NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Not Set'}<br />
                            NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not Set'}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    )
}
