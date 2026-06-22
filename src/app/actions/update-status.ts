'use server'

import { revalidatePath } from 'next/cache'
import { updateCandidateStatus } from '@/lib/candidate-store'
import { CandidateStatus } from '@/lib/types'

export async function updateStatusAction(id: string, status: CandidateStatus) {
  updateCandidateStatus(id, status)
  revalidatePath(`/dashboard/candidates/${id}`)
  revalidatePath('/dashboard')
}
