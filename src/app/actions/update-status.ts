'use server'

import { revalidatePath } from 'next/cache'
import { updateCandidateStatus, type ApprovalNotification } from '@/lib/candidate-store'
import { CandidateStatus } from '@/lib/types'

export async function updateStatusAction(
  id: string,
  status: CandidateStatus,
): Promise<{ error?: string; notification?: ApprovalNotification | null }> {
  let notification: ApprovalNotification | null = null
  try {
    notification = await updateCandidateStatus(id, status)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update status'
    return { error: message }
  }
  revalidatePath(`/dashboard/candidates/${id}`)
  revalidatePath('/dashboard/candidates')
  revalidatePath('/dashboard')
  return { notification }
}
