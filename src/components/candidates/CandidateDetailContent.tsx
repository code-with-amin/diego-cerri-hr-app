'use client'

import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from './StatusBadge'
import { StatusSelector } from './StatusSelector'
import { InternalNotesPanel } from './InternalNotesPanel'
import { ProfileSection } from './ProfileSection'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { cn } from '@/lib/utils'
import { Candidate } from '@/lib/types'

interface CandidateDetailContentProps {
  candidate: Candidate
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export function CandidateDetailContent({ candidate }: CandidateDetailContentProps) {
  const { t } = useLanguage()

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <>
      <Link
        href="/dashboard/candidates"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-5 -ml-2 text-muted-foreground')}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t('back_to_candidates')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <ProfileSection
            title={t('section_basic')}
            fields={[
              { label: t('field_full_name'), value: candidate.fullName },
              { label: t('field_email'), value: candidate.email },
              { label: t('field_phone'), value: candidate.phone },
              { label: t('field_location'), value: `${candidate.city}, ${candidate.state}` },
              { label: t('field_linkedin'), value: candidate.linkedIn },
              { label: t('field_portfolio'), value: candidate.portfolio },
            ]}
          />
          <ProfileSection
            title={t('section_professional')}
            fields={[
              { label: t('field_desired_role'), value: candidate.desiredRole },
              { label: t('field_expertise'), value: candidate.areaOfExpertise },
              { label: t('field_years_exp'), value: `${candidate.yearsOfExperience} ${t('field_years_suffix')}` },
              { label: t('field_employment_status'), value: candidate.currentEmploymentStatus },
              { label: t('field_salary'), value: candidate.salaryExpectation },
              { label: t('field_availability'), value: candidate.availabilityDate },
              { label: t('field_work_model'), value: candidate.preferredWorkModel },
            ]}
          />
          <ProfileSection
            title={t('section_education')}
            fields={[
              { label: t('field_degree'), value: candidate.degreeLevel },
              { label: t('field_course'), value: candidate.courseMajor },
              { label: t('field_institution'), value: candidate.institution },
              { label: t('field_certifications'), value: candidate.certifications },
              { label: t('field_languages'), value: candidate.languages },
            ]}
          />
          <ProfileSection
            title={t('section_experience')}
            fields={[
              { label: t('field_summary'), value: candidate.professionalSummary },
              { label: t('field_skills'), value: candidate.keyTechnicalSkills },
              { label: t('field_tools'), value: candidate.softwareTools },
              { label: t('field_achievements'), value: candidate.mainAchievements },
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
                  { label: t('detail_submitted'), value: fmt(candidate.submittedAt) },
                  { label: t('detail_last_updated'), value: fmt(candidate.lastUpdatedAt) },
                  { label: t('field_work_model'), value: candidate.preferredWorkModel },
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
                  <Button variant="default" size="lg" className="w-full">
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
    </>
  )
}
