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
import { Candidate, Note } from '@/lib/types'

interface CandidateDetailContentProps {
  candidate: Candidate
  notes: Note[]
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export function CandidateDetailContent({ candidate, notes }: CandidateDetailContentProps) {
  const { t } = useLanguage()

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })

  const subtitle = candidate.seniority ?? candidate.knowledgeAreas[0] ?? ''

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
              { label: t('field_location'), value: candidate.city },
              { label: t('field_state'), value: candidate.state },
              { label: t('field_country'), value: candidate.country },
              { label: t('field_linkedin'), value: candidate.linkedIn },
              { label: t('field_birth_date'), value: candidate.birthDate },
            ]}
          />
          <ProfileSection
            title={t('section_professional')}
            fields={[
              { label: t('field_employment_types'), value: candidate.employmentTypes },
              { label: t('field_hours_per_day'), value: candidate.hoursPerDay ? `${candidate.hoursPerDay}h` : undefined },
              { label: t('field_work_mode'), value: candidate.workMode },
              { label: t('field_availability_start'), value: candidate.availabilityStart },
              { label: t('field_travel'), value: candidate.travelAvailability },
              { label: t('field_hourly_rate'), value: candidate.hourlyRate },
              { label: t('field_monthly_expectation'), value: candidate.monthlyExpectation },
            ]}
          />
          <ProfileSection
            title={t('section_education')}
            fields={[
              { label: t('field_knowledge_areas'), value: candidate.knowledgeAreas },
              { label: t('field_software_skills'), value: candidate.softwareSkills },
              { label: t('field_seniority'), value: candidate.seniority },
            ]}
          />
          <ProfileSection
            title={t('section_experience')}
            fields={[
              { label: t('field_work_done'), value: candidate.workDone },
              { label: t('field_work_capable'), value: candidate.workCapable },
              { label: t('field_years_exp'), value: candidate.yearsExperience != null ? `${candidate.yearsExperience} ${t('field_years_suffix')}` : undefined },
              { label: t('field_observations'), value: candidate.observations },
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
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
                <StatusBadge status={candidate.status} />
              </div>

              <Separator className="my-4" />

              <dl className="space-y-3 text-sm">
                {[
                  { label: t('detail_submitted'), value: fmt(candidate.submittedAt) },
                  { label: t('detail_last_updated'), value: fmt(candidate.lastUpdatedAt) },
                  { label: t('field_hours_per_day'), value: candidate.hoursPerDay ? `${candidate.hoursPerDay}h/day` : '—' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd className="font-medium">{item.value}</dd>
                  </div>
                ))}
              </dl>

              {(
                <>
                  <Separator className="my-4" />
                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="default" size="lg" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      {t('download_resume')}
                    </Button>
                  </a>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <StatusSelector candidateId={candidate.id} currentStatus={candidate.status} />
            </CardContent>
          </Card>

          <InternalNotesPanel notes={notes} candidateId={candidate.id} />
        </div>
      </div>
    </>
  )
}
