export type CandidateStatus = 'New' | 'Under Review' | 'Approved' | 'Rejected'

export interface Candidate {
  id: string

  // 1. Contact Information
  fullName: string
  email: string
  phone: string
  city: string
  state?: string
  country?: string
  linkedIn?: string
  birthDate?: string

  // 2. Resume
  resumeFileName?: string
  resumeUrl?: string

  // 3. Work Type & Availability
  employmentTypes: string[]
  hoursPerDay: number
  workMode?: string
  availabilityStart?: string
  travelAvailability: string

  // 4. Areas of Expertise
  knowledgeAreas: string[]
  softwareSkills?: string
  seniority?: string

  // 5. Experience & Skills
  workDone: string
  workCapable?: string
  yearsExperience?: number

  // 6. Compensation & Notes
  hourlyRate: string
  monthlyExpectation?: string
  observations?: string

  // Meta
  submittedAt: string
  lastUpdatedAt: string
  status: CandidateStatus
}

export interface Note {
  id: string
  body: string
  createdAt: string
  admin: { id: string; email: string }
}
