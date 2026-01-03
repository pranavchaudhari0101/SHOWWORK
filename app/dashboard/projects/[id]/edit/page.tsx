'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Loader2, Check, X, Plus, Github, ExternalLink, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Project {
    id: string
    title: string
    short_desc: string
    full_desc: string
    cover_image_url: string | null
    github_url: string | null
    live_url: string | null
    visibility: string
    status: string
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [project, setProject] = useState<Project | null>(null)
    const [tags, setTags] = useState<string[]>([])
    const [newTag, setNewTag] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        shortDesc: '',
        fullDesc: '',
        githubUrl: '',
        liveUrl: '',
        visibility: 'PUBLIC',
        status: 'COMPLETED'
    })

    useEffect(() => {
        const fetchProject = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (!profile) {
                setError('Profile not found')
                setLoading(false)
                return
            }

            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('*')
                .eq('id', params.id)
                .eq('profile_id', profile.id)
                .single()

            if (projectError || !projectData) {
                setError('Project not found or you do not have permission to edit it')
                setLoading(false)
                return
            }

            setProject(projectData)
            setFormData({
                title: projectData.title || '',
                shortDesc: projectData.short_desc || '',
                fullDesc: projectData.full_desc || '',
                githubUrl: projectData.github_url || '',
                liveUrl: projectData.live_url || '',
                visibility: projectData.visibility || 'PUBLIC',
                status: projectData.status || 'COMPLETED'
            })

            // Fetch tags
            const { data: projectSkills } = await supabase
                .from('project_skills')
                .select('skills(name)')
                .eq('project_id', params.id)

            if (projectSkills) {
                const tagNames = projectSkills
                    .map((ps: { skills: { name: string } | null }) => ps.skills?.name)
                    .filter(Boolean) as string[]
                setTags(tagNames)
            }

            setLoading(false)
        }

        fetchProject()
    }, [params.id, router, supabase])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
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

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        setSuccess(null)

        try {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')

            const { error: updateError } = await supabase
                .from('projects')
                .update({
                    title: formData.title,
                    slug: slug,
                    short_desc: formData.shortDesc,
                    full_desc: formData.fullDesc,
                    github_url: formData.githubUrl || null,
                    live_url: formData.liveUrl || null,
                    visibility: formData.visibility,
                    status: formData.status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', params.id)

            if (updateError) {
                setError('Failed to update project: ' + updateError.message)
                return
            }

            setSuccess('Project updated successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return
        }

        setDeleting(true)
        try {
            const { error: deleteError } = await supabase
                .from('projects')
                .delete()
                .eq('id', params.id)

            if (deleteError) {
                setError('Failed to delete project: ' + deleteError.message)
                return
            }

            router.push('/dashboard/projects')
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setDeleting(false)
        }
    }

    const handlePublish = async () => {
        setSaving(true)
        try {
            const { error: publishError } = await supabase
                .from('projects')
                .update({ visibility: 'PUBLIC' })
                .eq('id', params.id)

            if (publishError) {
                setError('Failed to publish: ' + publishError.message)
                return
            }

            setFormData({ ...formData, visibility: 'PUBLIC' })
            setSuccess('Project published! It will now appear in Explore.')
            setTimeout(() => setSuccess(null), 3000)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        )
    }

    if (error && !project) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Link href="/dashboard/projects" className="btn btn-secondary">
                    Back to Projects
                </Link>
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/projects" className="btn btn-ghost">
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-medium">Edit Project</h1>
                        <p className="text-gray-500 text-sm">Update your project details</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {formData.visibility === 'DRAFT' && (
                        <button onClick={handlePublish} disabled={saving} className="btn btn-primary">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Publish
                        </button>
                    )}
                    <button onClick={handleSave} disabled={saving} className="btn btn-secondary">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            {success && (
                <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <h2 className="text-lg font-medium mb-4">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="form-label">Project Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="My Awesome Project"
                                />
                            </div>

                            <div>
                                <label htmlFor="shortDesc" className="form-label">Short Description</label>
                                <input
                                    type="text"
                                    id="shortDesc"
                                    value={formData.shortDesc}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="A brief one-line description"
                                />
                            </div>

                            <div>
                                <label htmlFor="fullDesc" className="form-label">Full Description</label>
                                <textarea
                                    id="fullDesc"
                                    value={formData.fullDesc}
                                    onChange={handleChange}
                                    rows={6}
                                    className="input resize-none"
                                    placeholder="Describe your project in detail..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-lg font-medium mb-4">Links</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="githubUrl" className="form-label flex items-center gap-2">
                                    <Github className="w-4 h-4" />
                                    GitHub Repository
                                </label>
                                <input
                                    type="url"
                                    id="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="https://github.com/username/repo"
                                />
                            </div>

                            <div>
                                <label htmlFor="liveUrl" className="form-label flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    Live Demo URL
                                </label>
                                <input
                                    type="url"
                                    id="liveUrl"
                                    value={formData.liveUrl}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="https://myproject.vercel.app"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-lg font-medium mb-4">Tech Stack</h2>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map(tag => (
                                <span key={tag} className="tag flex items-center gap-1">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="input flex-1"
                                placeholder="Add a technology..."
                            />
                            <button onClick={addTag} className="btn btn-secondary">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="card p-6">
                        <h2 className="text-lg font-medium mb-4">Settings</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="visibility" className="form-label">Visibility</label>
                                <select
                                    id="visibility"
                                    value={formData.visibility}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="PUBLIC">Public</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="PRIVATE">Private</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Public projects appear in Explore
                                </p>
                            </div>

                            <div>
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="COMPLETED">Completed</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="ON_HOLD">On Hold</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {project?.cover_image_url && (
                        <div className="card p-6">
                            <h2 className="text-lg font-medium mb-4">Cover Image</h2>
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                                <Image
                                    src={project.cover_image_url}
                                    alt="Cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div className="card p-6 border-red-500/20">
                        <h2 className="text-lg font-medium mb-4 text-red-500">Danger Zone</h2>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="btn w-full justify-center bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete Project
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
