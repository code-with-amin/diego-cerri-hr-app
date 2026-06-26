'use server'

import { revalidatePath } from 'next/cache'
import { deleteCandidate } from '@/lib/candidate-store'

export async function deleteCandidateAction(id: string): Promise<{ error?: string }> {
  try {
    await deleteCandidate(id)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete candidate'
    return { error: message }
  }
  revalidatePath('/dashboard/candidates')
  revalidatePath('/dashboard')
  return {}
}
