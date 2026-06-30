export const MOCK_EMPLOYEE = {
  name: 'Carlos Mendes',
  email: 'colaborador@kpiengenharia.com',
  role: 'BIM Specialist',
}

// Mock credentials for demo login
export const MOCK_EMPLOYEE_CREDENTIALS = {
  email: 'colaborador@kpiengenharia.com',
  password: 'colaborador123',
}

export type HistoryEntry = {
  id: string
  project: string
  activityKey: string
  start: string
  end: string
  netHours: string
  rate: string
  cost: string
}

export const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: '1',
    project: 'Linha 3 — Expansão',
    activityKey: 'emp_activity_bim',
    start: '08:30',
    end: '12:00',
    netHours: '3.50 h',
    rate: 'R$ 120,00',
    cost: 'R$ 420,00',
  },
  {
    id: '2',
    project: 'KPI Engenharia',
    activityKey: 'emp_activity_meeting',
    start: '13:00',
    end: '14:00',
    netHours: '1.00 h',
    rate: 'R$ 120,00',
    cost: 'R$ 120,00',
  },
  {
    id: '3',
    project: 'Retrofit Galpão B',
    activityKey: 'emp_activity_compat',
    start: '14:15',
    end: '16:45',
    netHours: '2.50 h',
    rate: 'R$ 120,00',
    cost: 'R$ 300,00',
  },
  {
    id: '4',
    project: 'Documentação OS-204',
    activityKey: 'emp_activity_docs',
    start: '17:00',
    end: '18:00',
    netHours: '1.00 h',
    rate: 'R$ 120,00',
    cost: 'R$ 120,00',
  },
  {
    id: '5',
    project: 'Metrô SP — Linha 6',
    activityKey: 'emp_activity_review',
    start: '08:00',
    end: '10:30',
    netHours: '2.50 h',
    rate: 'R$ 120,00',
    cost: 'R$ 300,00',
  },
  {
    id: '6',
    project: 'Linha 3 — Expansão',
    activityKey: 'emp_activity_planning',
    start: '11:00',
    end: '12:30',
    netHours: '1.50 h',
    rate: 'R$ 120,00',
    cost: 'R$ 180,00',
  },
]
