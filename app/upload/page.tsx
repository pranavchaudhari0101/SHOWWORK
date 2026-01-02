'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Upload, X, Plus, Github, ExternalLink, ChevronLeft } from 'lucide-react'

export default function UploadPage() {
    const [tags, setTags] = useState<string[]>(['React', 'TypeScript'])
    const [newTag, setNewTag] = useState('')

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag])
            setNewTag('')
        }
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
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
                        <button className="btn btn-primary">Publish Project</button>
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

                    <form className="space-y-8">
                        {/* Cover Image */}
                        <div>
                            <label className="form-label">Cover Image</label>
                            <div className="border-2 border-dashed border-gray-800 rounded-xl p-8 text-center hover:border-gray-700 transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                                <p className="text-sm text-gray-500 mb-1">Drag and drop or click to upload</p>
                                <p className="text-xs text-gray-600">PNG, JPG up to 5MB (16:10 recommended)</p>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="form-label" htmlFor="title">Project Title</label>
                            <input type="text" id="title" className="input" placeholder="My Awesome Project" />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="form-label" htmlFor="description">Short Description</label>
                            <input type="text" id="description" className="input" placeholder="A brief description of your project" maxLength={160} />
                            <p className="text-xs text-gray-600 mt-1">0/160 characters</p>
                        </div>

                        {/* Full Description */}
                        <div>
                            <label className="form-label" htmlFor="content">Full Description</label>
                            <textarea id="content" className="input min-h-[200px]" placeholder="Describe your project in detail. You can use markdown." />
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
                                    placeholder="Add technology..."
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
                                <label className="form-label" htmlFor="github">
                                    <Github className="w-4 h-4 inline mr-1" /> GitHub URL
                                </label>
                                <input type="url" id="github" className="input" placeholder="https://github.com/..." />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="demo">
                                    <ExternalLink className="w-4 h-4 inline mr-1" /> Live Demo URL
                                </label>
                                <input type="url" id="demo" className="input" placeholder="https://..." />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="form-label" htmlFor="category">Category</label>
                            <select id="category" className="input cursor-pointer">
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
                            <button type="button" className="btn btn-secondary flex-1">Save as Draft</button>
                            <button type="submit" className="btn btn-primary flex-1">Publish Project</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}
