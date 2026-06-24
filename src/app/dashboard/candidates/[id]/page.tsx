import { notFound } from 'next/navigation'
import { getCandidateById, getNotes } from '@/lib/candidate-store'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CandidateDetailContent } from '@/components/candidates/CandidateDetailContent'

interface PageProps {
  params: { id: string }
}

export default async function CandidateDetailPage({ params }: PageProps) {
  const [candidate, notes] = await Promise.all([
    getCandidateById(params.id),
    getNotes(params.id),
  ])

  if (!candidate) notFound()

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  const subtitle = candidate.seniority ?? candidate.knowledgeAreas[0] ?? ''

  return (
    <DashboardShell
      title={candidate.fullName}
      subtitle={subtitle ? `${subtitle} · ${fmt(candidate.submittedAt)}` : fmt(candidate.submittedAt)}
    >
      <CandidateDetailContent candidate={candidate} notes={notes} />
    </DashboardShell>
  )
}
