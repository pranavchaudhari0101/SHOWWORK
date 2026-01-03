'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Upload, X, Plus, Github, ExternalLink, ChevronLeft, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { revalidateExplore } from '@/app/actions'

export default function UploadPage() {
    const router = useRouter()
    const supabase = createClient()

    const [publishLoading, setPublishLoading] = useState(false)
    const [draftLoading, setDraftLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const [tags, setTags] = useState<string[]>([])
    const [newTag, setNewTag] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        shortDesc: '',
        fullDesc: '',
        githubUrl: '',
        liveUrl: '',
        category: ''
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setCoverImage(file)
            setCoverPreview(URL.createObjectURL(file))
        }
    }

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag])
            setNewTag('')
        }
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault()
        if (isDraft) {
            setDraftLoading(true)
        } else {
            setPublishLoading(true)
        }
        setError(null)

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // Get user's profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (!profile) {
                setError('Profile not found. Please try logging in again.')
                return
            }

            // Upload cover image if exists
            let coverImageUrl = null
            if (coverImage) {
                const fileExt = coverImage.name.split('.').pop()
                const fileName = `${user.id}/${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('project-images')
                    .upload(fileName, coverImage)

                if (uploadError) {
                    setError('Failed to upload image: ' + uploadError.message)
                    return
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('project-images')
                    .getPublicUrl(fileName)

                coverImageUrl = publicUrl
            }

            // Create slug from title
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')

            // Insert project
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .insert({
                    profile_id: profile.id,
                    title: formData.title,
                    slug: slug,
                    short_desc: formData.shortDesc,
                    full_desc: formData.fullDesc,
                    cover_image_url: coverImageUrl,
                    github_url: formData.githubUrl || null,
                    live_url: formData.liveUrl || null,
                    visibility: isDraft ? 'DRAFT' : 'PUBLIC',
                    status: isDraft ? 'IN_PROGRESS' : 'COMPLETED'
                })
                .select()
                .single()

            if (projectError) {
                setError('Failed to create project: ' + projectError.message)
                return
            }

            // Add skills/tags if any
            if (tags.length > 0) {
                for (const tagName of tags) {
                    // Find or we'll skip if skill doesn't exist
                    const { data: skill } = await supabase
                        .from('skills')
                        .select('id')
                        .eq('name', tagName)
                        .single()

                    if (skill) {
                        await supabase
                            .from('project_skills')
                            .insert({ project_id: project.id, skill_id: skill.id })
                    }
                }
            }

            // Revalidate explore page to show new project
            await revalidateExplore()

            // Success! Redirect based on publish type
            router.push(isDraft ? '/dashboard' : '/explore')
            router.refresh()

        } catch {
            setError('An unexpected error occurred')
        } finally {
            setPublishLoading(false)
            setDraftLoading(false)
        }
    }

    return (
        <>
            {/* Navigation */}
            <nav className="navbar">
                <div className="container flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="ShowWork" width={140} height={40} className="h-8 w-auto" />
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="btn btn-ghost">Cancel</Link>
                        <button
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={publishLoading || draftLoading || !formData.title}
                            className="btn btn-primary disabled:opacity-50"
                        >
                            {publishLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Publish Project
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="container max-w-2xl">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6">
                        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>

                    <h1 className="text-2xl font-medium mb-8">Upload New Project</h1>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
                        {/* Cover Image */}
                        <div>
                            <label className="form-label">Cover Image</label>
                            <label className="border-2 border-dashed border-gray-800 rounded-xl p-8 text-center hover:border-gray-700 transition-colors cursor-pointer block">
                                {coverPreview ? (
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={coverPreview}
                                            alt="Preview"
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setCoverImage(null); setCoverPreview(null); }}
                                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/80 z-10"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500 mb-1">Drag and drop or click to upload</p>
                                        <p className="text-xs text-gray-600">PNG, JPG up to 5MB (16:10 recommended)</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="form-label" htmlFor="title">Project Title *</label>
                            <input
                                type="text"
                                id="title"
                                className="input"
                                placeholder="My Awesome Project"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="form-label" htmlFor="shortDesc">Short Description *</label>
                            <input
                                type="text"
                                id="shortDesc"
                                className="input"
                                placeholder="A brief description of your project"
                                value={formData.shortDesc}
                                onChange={handleChange}
                                maxLength={200}
                                required
                            />
                            <p className="text-xs text-gray-600 mt-1">{formData.shortDesc.length}/200 characters</p>
                        </div>

                        {/* Full Description */}
                        <div>
                            <label className="form-label" htmlFor="fullDesc">Full Description</label>
                            <textarea
                                id="fullDesc"
                                className="input min-h-[200px]"
                                placeholder="Describe your project in detail. You can use markdown."
                                value={formData.fullDesc}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <label className="form-label">Tech Stack</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tags.map((tag) => (
                                    <span key={tag} className="tag flex items-center gap-1.5">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="input flex-1"
                                    placeholder="Add technology (e.g., React, Python)..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <button type="button" onClick={addTag} className="btn btn-secondary">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="form-label" htmlFor="githubUrl">
                                    <Github className="w-4 h-4 inline mr-1" /> GitHub URL
                                </label>
                                <input
                                    type="url"
                                    id="githubUrl"
                                    className="input"
                                    placeholder="https://github.com/..."
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="liveUrl">
                                    <ExternalLink className="w-4 h-4 inline mr-1" /> Live Demo URL
                                </label>
                                <input
                                    type="url"
                                    id="liveUrl"
                                    className="input"
                                    placeholder="https://..."
                                    value={formData.liveUrl}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="form-label" htmlFor="category">Category</label>
                            <select
                                id="category"
                                className="input cursor-pointer"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select a category</option>
                                <option value="fullstack">Full-Stack</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="ml">AI/ML</option>
                                <option value="mobile">Mobile</option>
                                <option value="devops">DevOps</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={publishLoading || draftLoading || !formData.title}
                                className="btn btn-secondary flex-1 disabled:opacity-50"
                            >
                                {draftLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Save as Draft
                            </button>
                            <button
                                type="submit"
                                disabled={publishLoading || draftLoading || !formData.title}
                                className="btn btn-primary flex-1 disabled:opacity-50"
                            >
                                {publishLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Publish Project
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}
