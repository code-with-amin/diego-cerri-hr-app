export type CandidateStatus = 'New' | 'Under Review' | 'Approved' | 'Rejected'

export interface Candidate {
  id: string
  fullName: string
  email: string
  phone: string
  city: string
  state: string
  linkedIn?: string
  portfolio?: string
  desiredRole: string
  areaOfExpertise: string
  yearsOfExperience: number
  currentEmploymentStatus: string
  salaryExpectation: string
  availabilityDate: string
  preferredWorkModel: 'Onsite' | 'Hybrid' | 'Remote'
  degreeLevel: string
  courseMajor: string
  institution: string
  certifications: string[]
  languages: string[]
  professionalSummary: string
  keyTechnicalSkills: string[]
  softwareTools: string[]
  mainAchievements: string
  resumeFileName?: string
  submittedAt: string
  lastUpdatedAt: string
  status: CandidateStatus
  internalNotes?: string
}
