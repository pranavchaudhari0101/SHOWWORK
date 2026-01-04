import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, User } from 'lucide-react'
import ProfileForm from './ProfileForm'

export default async function SettingsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    return (
        <>
            <div className="mb-8">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-4">
                    <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-medium">Profile Settings</h1>
                <p className="text-gray-500">Manage your public profile information</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Form */}
                <div className="lg:col-span-2">
                    <ProfileForm profile={profile} userEmail={user.email || ''} />
                </div>

                {/* Preview Card */}
                <div className="card p-6 h-fit">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile Preview
                    </h3>
                    <div className="text-center py-6">
                        <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden flex items-center justify-center mx-auto mb-4">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.full_name || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-medium text-white">
                                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <h4 className="font-medium text-lg">{profile?.full_name || 'Your Name'}</h4>
                        <p className="text-sm text-gray-500">@{profile?.username || 'username'}</p>
                        {profile?.headline && (
                            <p className="text-sm text-gray-400 mt-2">{profile.headline}</p>
                        )}
                    </div>
                    <Link
                        href={`/profile/${profile?.username || 'me'}`}
                        className="btn btn-secondary w-full justify-center mt-4"
                    >
                        View Public Profile
                    </Link>
                </div>
            </div>
        </>
    )
}
