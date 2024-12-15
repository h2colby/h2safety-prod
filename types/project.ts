import { Timestamp } from 'firebase/firestore'

export interface Milestone {
  name: string
  dueDate: Date
  status: string
}

export interface CustomField {
  key: string
  value: string
}

export interface ProjectData {
  projectName: string
  description: string
  currentPhase: string
  facilityName: string
  facilityLocation: string
  facilitySize: string
  facilityType: string
  projectType: string
  projectPriority: string
  status: string
  startDate: Timestamp | null
  endDate: Timestamp | null
  complianceDeadline: Timestamp | null
  teamMembers: string[]
  milestones: Milestone[]
  budget: number
  expenditure: number
  createdAt: Timestamp
  updatedAt: Timestamp
  lastUpdatedBy: string
  customFields: CustomField[]
  ownerId: string
} 