import { notFound } from 'next/navigation'
import { getCandidateById } from '@/lib/candidate-store'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CandidateDetailContent } from '@/components/candidates/CandidateDetailContent'

interface PageProps {
  params: { id: string }
}

export default function CandidateDetailPage({ params }: PageProps) {
  const candidate = getCandidateById(params.id)
  if (!candidate) notFound()

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <DashboardShell
      title={candidate.fullName}
      subtitle={`${candidate.desiredRole} · ${fmt(candidate.submittedAt)}`}
    >
      <CandidateDetailContent candidate={candidate} />
    </DashboardShell>
  )
}
