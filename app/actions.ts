'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateExplore() {
    revalidatePath('/')
    revalidatePath('/explore')
    revalidatePath('/dashboard')
}
