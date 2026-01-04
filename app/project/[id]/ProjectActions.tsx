'use client'

import { useState, useEffect } from 'react'
import { Heart, Bookmark, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProjectActionsProps {
    projectId: string
    initialLikeCount: number
    initialSaveCount: number
}

export default function ProjectActions({
    projectId,
    initialLikeCount,
    initialSaveCount
}: ProjectActionsProps) {
    const supabase = createClient()
    const [isLiked, setIsLiked] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [likeCount, setLikeCount] = useState(initialLikeCount)
    const [saveCount, setSaveCount] = useState(initialSaveCount)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Check authentication and social status on mount
    useEffect(() => {
        async function checkStatus() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setIsAuthenticated(false)
                return
            }
            setIsAuthenticated(true)

            // Get profile id
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (!profile) return

            // Check if liked
            const { data: likeData } = await supabase
                .from('project_likes')
                .select('profile_id')
                .eq('project_id', projectId)
                .eq('profile_id', profile.id)
                .single()

            setIsLiked(!!likeData)

            // Check if saved
            const { data: saveData } = await supabase
                .from('project_saves')
                .select('profile_id')
                .eq('project_id', projectId)
                .eq('profile_id', profile.id)
                .single()

            setIsSaved(!!saveData)
        }

        checkStatus()
    }, [projectId, supabase])

    // Increment view count on mount (once per session)
    useEffect(() => {
        const viewedKey = `viewed_project_${projectId}`
        const hasViewed = sessionStorage.getItem(viewedKey)

        if (!hasViewed) {
            sessionStorage.setItem(viewedKey, 'true')
            supabase.rpc('increment_views', { project_id: projectId }).then(({ error }) => {
                if (error) console.error('Error incrementing views:', error)
            })
        }
    }, [projectId, supabase])

    const handleLike = async () => {
        if (!isAuthenticated) {
            window.location.href = '/login'
            return
        }

        // Optimistic update
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!profile) return

        if (isLiked) {
            await supabase
                .from('project_likes')
                .delete()
                .eq('project_id', projectId)
                .eq('profile_id', profile.id)
        } else {
            await supabase
                .from('project_likes')
                .insert({
                    project_id: projectId,
                    profile_id: profile.id
                })
        }
    }

    const handleSave = async () => {
        if (!isAuthenticated) {
            window.location.href = '/login'
            return
        }

        // Optimistic update
        setIsSaved(!isSaved)
        setSaveCount(prev => isSaved ? prev - 1 : prev + 1)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!profile) return

        if (isSaved) {
            await supabase
                .from('project_saves')
                .delete()
                .eq('project_id', projectId)
                .eq('profile_id', profile.id)
        } else {
            await supabase
                .from('project_saves')
                .insert({
                    project_id: projectId,
                    profile_id: profile.id
                })
        }
    }

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <div className="flex gap-2 w-full sm:w-auto">
            <button
                onClick={handleLike}
                className={`btn flex-1 sm:flex-none justify-center ${isLiked ? 'bg-red-500/10 text-red-500 border-red-500/50' : 'btn-secondary'}`}
            >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="ml-2">{likeCount}</span>
            </button>
            <button
                onClick={handleSave}
                className={`btn flex-1 sm:flex-none justify-center ${isSaved ? 'bg-blue-500/10 text-blue-500 border-blue-500/50' : 'btn-secondary'}`}
            >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span className="ml-2">{saveCount}</span>
            </button>
            <button
                onClick={handleShare}
                className="btn btn-ghost flex-1 sm:flex-none justify-center"
            >
                <Share2 className="w-4 h-4" />
            </button>
        </div>
    )
}
