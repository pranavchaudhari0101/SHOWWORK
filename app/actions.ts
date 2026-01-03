'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateExplore() {
    revalidatePath('/explore')
    revalidatePath('/dashboard')
}
