'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch } from '@/lib/api-client'

export async function addNoteAction(candidateId: string, body: string) {
  await apiFetch(`/candidates/${candidateId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  })
  revalidatePath(`/dashboard/candidates/${candidateId}`)
}

export async function updateNoteAction(candidateId: string, noteId: string, body: string) {
  await apiFetch(`/notes/${noteId}`, {
    method: 'PATCH',
    body: JSON.stringify({ body }),
  })
  revalidatePath(`/dashboard/candidates/${candidateId}`)
}

export async function deleteNoteAction(candidateId: string, noteId: string) {
  await apiFetch(`/notes/${noteId}`, { method: 'DELETE' })
  revalidatePath(`/dashboard/candidates/${candidateId}`)
}
