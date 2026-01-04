'use server'

import { revalidatePath } from 'next/cache'

/**
 * Revalidate explore and main pages
 * Call after publishing or creating projects
 */
export async function revalidateExplore() {
    revalidatePath('/', 'layout')
    revalidatePath('/explore')
    revalidatePath('/dashboard')
}

/**
 * Revalidate a specific project and related pages
 * Call after updating a project's visibility or content
 */
export async function revalidateProject(projectId: string) {
    revalidatePath(`/project/${projectId}`)
    revalidatePath('/explore')
    revalidatePath('/dashboard')
}

/**
 * Revalidate a user's profile and explore pages
 * Call after profile changes or when project visibility affects profile view
 */
export async function revalidateProfile(username: string) {
    revalidatePath(`/profile/${username}`)
    revalidatePath('/explore')
}

/**
 * Revalidate all project-related paths
 * Use sparingly - only for major changes
 */
export async function revalidateAll() {
    revalidatePath('/', 'layout')
    revalidatePath('/explore')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/projects')
}
