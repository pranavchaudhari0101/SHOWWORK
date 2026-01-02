import { createClient } from '@/lib/supabase/server'

export default async function TestDbPage() {
    const supabase = await createClient()

    // Attempt to query the projects table
    const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true })

    return (
        <div className="min-h-screen bg-black text-white p-20 font-sans">
            <h1 className="text-3xl font-bold mb-6">Supabase Connection Status</h1>

            {error ? (
                <div className="p-6 border border-red-500 rounded-lg bg-red-900/20">
                    <h2 className="text-xl text-red-500 mb-2">❌ Connection Failed</h2>
                    <p className="font-mono text-sm text-red-300">{error.message}</p>
                    <p className="mt-4 text-sm text-gray-400">
                        Check your .env.local file and make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct.
                    </p>
                </div>
            ) : (
                <div className="p-6 border border-green-500 rounded-lg bg-green-900/20">
                    <h2 className="text-xl text-green-500 mb-2">✅ Connection Successful!</h2>
                    <p className="text-gray-300">Successfully connected to Supabase.</p>
                </div>
            )}

            <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Environment Variables Detected:</h3>
                <ul className="list-disc list-inside text-gray-400 font-mono text-sm">
                    <li>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Defined' : '❌ Missing'}</li>
                    <li>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Defined' : '❌ Missing'}</li>
                </ul>
            </div>
        </div>
    )
}
