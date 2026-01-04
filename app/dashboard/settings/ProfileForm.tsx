'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Loader2, Camera, User } from 'lucide-react'
import Image from 'next/image'

interface Profile {
    id: string
    username: string
    full_name: string
    headline: string | null
    bio: string | null
    location: string | null
    avatar_url: string | null
    github_url: string | null
    linkedin_url: string | null
    website_url: string | null
    twitter_url: string | null
}

export default function ProfileForm({ profile, userEmail }: { profile: Profile | null, userEmail: string }) {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        full_name: profile?.full_name || '',
        username: profile?.username || '',
        headline: profile?.headline || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        avatar_url: profile?.avatar_url || '',
        github_url: profile?.github_url || '',
        linkedin_url: profile?.linkedin_url || '',
        website_url: profile?.website_url || '',
        twitter_url: profile?.twitter_url || '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            setError(null)

            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${profile?.id}/avatar-${Math.random()}.${fileExt}`

            // Upload to Supabase
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            // Get Public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }))
        } catch (error: any) {
            setError(error.message || 'Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    username: formData.username,
                    headline: formData.headline || null,
                    bio: formData.bio || null,
                    location: formData.location || null,
                    avatar_url: formData.avatar_url || null,
                    github_url: formData.github_url || null,
                    linkedin_url: formData.linkedin_url || null,
                    website_url: formData.website_url || null,
                    twitter_url: formData.twitter_url || null,
                })
                .eq('id', profile?.id)

            if (error) {
                setError(error.message)
            } else {
                setSuccess(true)
                router.refresh()
            }
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-lg">
                    Profile updated successfully!
                </div>
            )}

            <div className="card p-6 space-y-6">
                <h3 className="font-medium border-b border-gray-800 pb-4">Basic Information</h3>

                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700">
                            {formData.avatar_url ? (
                                <Image
                                    src={formData.avatar_url}
                                    alt="Avatar"
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <label
                            htmlFor="avatar-upload"
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                        >
                            <Camera className="w-6 h-6 text-white" />
                        </label>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </div>
                    <div>
                        <p className="font-medium mb-1">Profile Photo</p>
                        <p className="text-sm text-gray-500 mb-2">Recommended: Square JPG, PNG</p>
                        {uploading && <p className="text-xs text-accent-blue flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</p>}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label" htmlFor="full_name">Full Name</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="input w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="input w-full"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={userEmail}
                        className="input w-full bg-gray-800 cursor-not-allowed"
                        disabled
                    />
                    <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
                </div>

                <div>
                    <label className="form-label" htmlFor="headline">Headline</label>
                    <input
                        type="text"
                        id="headline"
                        name="headline"
                        value={formData.headline}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="Full-Stack Developer | Open Source Enthusiast"
                        maxLength={200}
                    />
                </div>

                <div>
                    <label className="form-label" htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="input w-full min-h-[100px]"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <div>
                    <label className="form-label" htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="San Francisco, CA"
                    />
                </div>
            </div>

            <div className="card p-6 space-y-6">
                <h3 className="font-medium border-b border-gray-800 pb-4">Social Links</h3>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="form-label" htmlFor="github_url">GitHub</label>
                        <input
                            type="url"
                            id="github_url"
                            name="github_url"
                            value={formData.github_url}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="https://github.com/username"
                        />
                    </div>
                    <div>
                        <label className="form-label" htmlFor="linkedin_url">LinkedIn</label>
                        <input
                            type="url"
                            id="linkedin_url"
                            name="linkedin_url"
                            value={formData.linkedin_url}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>
                    <div>
                        <label className="form-label" htmlFor="website_url">Website</label>
                        <input
                            type="url"
                            id="website_url"
                            name="website_url"
                            value={formData.website_url}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="https://yourwebsite.com"
                        />
                    </div>
                    <div>
                        <label className="form-label" htmlFor="twitter_url">Twitter</label>
                        <input
                            type="url"
                            id="twitter_url"
                            name="twitter_url"
                            value={formData.twitter_url}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="https://twitter.com/username"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || uploading}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    )
}
