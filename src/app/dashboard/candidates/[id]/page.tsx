import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { getCandidateById } from '@/lib/candidate-store'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/candidates/StatusBadge'
import { StatusSelector } from '@/components/candidates/StatusSelector'
import { InternalNotesPanel } from '@/components/candidates/InternalNotesPanel'
import { ProfileSection } from '@/components/candidates/ProfileSection'
import { cn } from '@/lib/utils'

interface PageProps {
  params: { id: string }
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function CandidateDetailPage({ params }: PageProps) {
  const candidate = getCandidateById(params.id)
  if (!candidate) notFound()

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <DashboardShell
      title={candidate.fullName}
      subtitle={`${candidate.desiredRole} · Submitted ${fmt(candidate.submittedAt)}`}
    >
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-5 -ml-2 text-muted-foreground')}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to candidates
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <ProfileSection
            title="Basic Information"
            fields={[
              { label: 'Full Name', value: candidate.fullName },
              { label: 'Email', value: candidate.email },
              { label: 'Phone', value: candidate.phone },
              { label: 'Location', value: `${candidate.city}, ${candidate.state}` },
              { label: 'LinkedIn', value: candidate.linkedIn },
              { label: 'Portfolio / Website', value: candidate.portfolio },
            ]}
          />
          <ProfileSection
            title="Professional Information"
            fields={[
              { label: 'Desired Role', value: candidate.desiredRole },
              { label: 'Area of Expertise', value: candidate.areaOfExpertise },
              { label: 'Years of Experience', value: `${candidate.yearsOfExperience} years` },
              { label: 'Employment Status', value: candidate.currentEmploymentStatus },
              { label: 'Salary Expectation', value: candidate.salaryExpectation },
              { label: 'Availability Date', value: candidate.availabilityDate },
              { label: 'Work Model', value: candidate.preferredWorkModel },
            ]}
          />
          <ProfileSection
            title="Education & Qualifications"
            fields={[
              { label: 'Degree Level', value: candidate.degreeLevel },
              { label: 'Course / Major', value: candidate.courseMajor },
              { label: 'Institution', value: candidate.institution },
              { label: 'Certifications', value: candidate.certifications },
              { label: 'Languages', value: candidate.languages },
            ]}
          />
          <ProfileSection
            title="Experience Summary"
            fields={[
              { label: 'Professional Summary', value: candidate.professionalSummary },
              { label: 'Key Technical Skills', value: candidate.keyTechnicalSkills },
              { label: 'Software / Tools', value: candidate.softwareTools },
              { label: 'Main Projects & Achievements', value: candidate.mainAchievements },
            ]}
          />
        </div>

        <div className="space-y-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {initials(candidate.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{candidate.fullName}</p>
                  <p className="text-sm text-muted-foreground">{candidate.desiredRole}</p>
                </div>
                <StatusBadge status={candidate.status} />
              </div>

              <Separator className="my-4" />

              <dl className="space-y-3 text-sm">
                {[
                  { label: 'Submitted', value: fmt(candidate.submittedAt) },
                  { label: 'Last Updated', value: fmt(candidate.lastUpdatedAt) },
                  { label: 'Work Model', value: candidate.preferredWorkModel },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd className="font-medium">{item.value}</dd>
                  </div>
                ))}
              </dl>

              {candidate.resumeFileName && (
                <>
                  <Separator className="my-4" />
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    {candidate.resumeFileName}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <StatusSelector candidateId={candidate.id} currentStatus={candidate.status} />
            </CardContent>
          </Card>

          <InternalNotesPanel notes={candidate.internalNotes} />
        </div>
      </div>
    </DashboardShell>
  )
}
