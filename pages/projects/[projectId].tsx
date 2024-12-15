import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { db } from '@/lib/firebase'
import {
  doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, serverTimestamp, addDoc
} from 'firebase/firestore'
import { useUser } from '@/lib/context/UserContext'
import Link from 'next/link'
import { Timestamp } from 'firebase/firestore'
import type { ProjectData } from '@/types/project'
import Header from '@/components/Header'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isAfter, isBefore } from "date-fns";
import type { MouseEvent, KeyboardEvent } from 'react'
import type { ReactDatePickerCustomHeaderProps } from 'react-datepicker'

interface Milestone {
  name: string
  dueDate: Date
  status: string
}

interface CustomField {
  key: string
  value: string
}

const styles = {
  statusIcon: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px',
  },
  statusColors: {
    active: '#22c55e',    // green-500
    completed: '#ef4444', // red-500
    archived: '#f59e0b',  // amber-500
    unknown: '#6b7280',   // gray-500
  }
}

const THREAD_CATEGORIES = [
  "Engineering Code Question",
  "Project-Specific Question",
  "Permitting Process Question",
  "Compliance Support",
  "Other"
] as const

const datePickerStyles = {
  input: `w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    hover:border-gray-600 transition-colors duration-200`,
  calendar: {
    backgroundColor: '#1f2937',
    color: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #374151',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    fontSize: '0.875rem'
  }
};

type CustomModifier = {
  name: string;
  options: {
    offset: [number, number];
  };
  fn?: (state: any) => any;
};

const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select option",
  required = false,
  name,
  id,
  className = ""
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      required={required}
      name={name}
      id={id}
      className={`w-full appearance-none bg-gray-800 text-gray-100 border border-gray-700 
        rounded-lg py-2.5 px-3 pr-10 leading-tight transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        hover:border-gray-600 ${className}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map(option => (
        <option 
          key={option} 
          value={option}
          className="py-2 px-3 hover:bg-gray-700"
        >
          {option}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg 
        className="w-5 h-5 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
);

export default function ProjectPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const { projectId } = router.query

  const [project, setProject] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [projectLoading, setProjectLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<ProjectData>>({})
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [customFields, setCustomFields] = useState<CustomField[]>([])

  const [threads, setThreads] = useState<any[]>([])
  const [threadsLoading, setThreadsLoading] = useState(true)
  const [threadError, setThreadError] = useState<string | null>(null)

  const [creatingThread, setCreatingThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadCategory, setNewThreadCategory] = useState<string>('')

  const PHASE_OPTIONS = ["Design", "Construction", "Testing", "Operation"]
  const FACILITY_TYPES = ["Generation", "Storage", "Distribution"]
  const PROJECT_TYPES = ["Compliance", "Permitting", "Risk Assessment"]
  const PRIORITY_OPTIONS = ["High", "Medium", "Low"]
  const STATUS_OPTIONS = ["active", "completed", "archived"]

  const handleChange = (field: keyof ProjectData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setEditData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const addMilestone = () => {
    setMilestones([...milestones, { name: '', dueDate: new Date(), status: 'pending' }])
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }])
  }

  useEffect(() => {
    if (loading) return
    if (!user) {
      setError('Please log in to view this project.')
      setProjectLoading(false)
      return
    }

    if (typeof projectId !== 'string') {
      setError('Invalid project ID')
      setProjectLoading(false)
      return
    }

    const pid = projectId

    async function loadProject() {
      try {
        const snap = await getDoc(doc(db, 'projects', pid))
        if (snap.exists()) {
          const projectData = snap.data()
          setProject(projectData)
          setError(null)

          setEditData({
            projectName: projectData.projectName || '',
            description: projectData.description || '',
            currentPhase: projectData.currentPhase || '',
            facilityName: projectData.facilityName || '',
            facilityLocation: projectData.facilityLocation || '',
            facilitySize: projectData.facilitySize || '',
            facilityType: projectData.facilityType || '',
            projectType: projectData.projectType || '',
            projectPriority: projectData.projectPriority || '',
            status: projectData.status || 'active',
            startDate: projectData.startDate || null,
            endDate: projectData.endDate || null,
            complianceDeadline: projectData.complianceDeadline || null,
            teamMembers: projectData.teamMembers || [],
            milestones: projectData.milestones || [],
            budget: projectData.budget || 0,
            expenditure: projectData.expenditure || 0,
            createdAt: projectData.createdAt || Timestamp.fromDate(new Date()),
            updatedAt: projectData.updatedAt || Timestamp.fromDate(new Date()),
            lastUpdatedBy: projectData.lastUpdatedBy || '',
            customFields: projectData.customFields || [],
            ownerId: projectData.ownerId || ''
          })
        } else {
          setError('Project not found')
        }
      } catch (err: any) {
        setError(err.message || 'Error loading project')
      } finally {
        setProjectLoading(false)
      }
    }

    loadProject()
  }, [user, loading, projectId])

  useEffect(() => {
    if (!user || typeof projectId !== 'string') {
      setThreadsLoading(false)
      return
    }

    const pid = projectId

    async function loadThreads() {
      try {
        const threadsQuery = query(collection(db, 'threads'), where('projectId', '==', pid))
        const snap = await getDocs(threadsQuery)
        const threadData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setThreads(threadData)
        setThreadError(null)
      } catch (err: any) {
        setThreadError(err.message || 'Error loading threads')
      } finally {
        setThreadsLoading(false)
      }
    }

    loadThreads()
  }, [user, projectId])

  if (projectLoading) return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="p-8">Loading project...</div>
    </div>
  )
  if (error) return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="p-8">{error}</div>
    </div>
  )
  if (!project) return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="p-8">Project not found</div>
    </div>
  )

  const isOwner = user && user.uid === project.ownerId

  async function handleSaveProject() {
    if (!isOwner || typeof projectId !== 'string') return

    try {
      const updatedData = {
        ...editData,
        milestones,
        customFields,
        updatedAt: serverTimestamp(),
        lastUpdatedBy: user?.uid
      }

      await updateDoc(doc(db, 'projects', projectId), updatedData)
      setProject((prev: ProjectData) => ({ ...prev, ...updatedData }))
      setEditing(false)
    } catch (err: any) {
      setError(err.message || 'Error updating project')
    }
  }

  async function handleDeleteProject() {
    if (!isOwner) return
    if (typeof projectId !== 'string') return
    const pid = projectId

    const confirmDelete = window.confirm('Are you sure you want to delete this project? This action cannot be undone.')
    if (!confirmDelete) return

    try {
      await deleteDoc(doc(db, 'projects', pid))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error deleting project')
    }
  }

  async function handleCreateThread(e: React.FormEvent) {
    e.preventDefault()
    if (!isOwner || typeof projectId !== 'string') return

    if (newThreadTitle.trim() === '') {
      setThreadError('Thread title is required.')
      return
    }

    try {
      const threadRef = await addDoc(collection(db, 'threads'), {
        title: newThreadTitle.trim(),
        category: newThreadCategory,
        projectId: projectId,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
        messageCount: 0,
      })

      // Reset form and refresh threads
      setNewThreadTitle('')
      setNewThreadCategory('')
      setCreatingThread(false)
      
      // Refresh threads list
      const threadsQuery = query(collection(db, 'threads'), where('projectId', '==', projectId))
      const snap = await getDocs(threadsQuery)
      const threadData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setThreads(threadData)

      // Navigate to the new thread
      router.push(`/threads/${threadRef.id}`)
    } catch (err: any) {
      setThreadError(err.message || 'Error creating thread')
    }
  }

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "Not provided";
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="p-8 flex-1">
        {editing ? (
          <form className="space-y-8" onSubmit={(e) => {
            e.preventDefault()
            handleSaveProject()
          }}>
            <section className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">General Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block mb-1">Project Name*</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700"
                    value={editData.projectName || ''}
                    onChange={handleChange('projectName')}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Status*</label>
                  <CustomSelect
                    value={editData.status || ''}
                    onChange={handleChange('status')}
                    options={STATUS_OPTIONS}
                    placeholder="Select status"
                    required
                    name="status"
                    id="status"
                  />
                </div>

                <div>
                  <label className="block mb-1">Priority</label>
                  <CustomSelect
                    value={editData.projectPriority || ''}
                    onChange={handleChange('projectPriority')}
                    options={PRIORITY_OPTIONS}
                    placeholder="Select priority"
                    name="priority"
                    id="priority"
                  />
                </div>

                <div>
                  <label className="block mb-1">Current Phase</label>
                  <CustomSelect
                    value={editData.currentPhase || ''}
                    onChange={handleChange('currentPhase')}
                    options={PHASE_OPTIONS}
                    placeholder="Select phase"
                    name="phase"
                    id="phase"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700"
                    rows={4}
                    value={editData.description || ''}
                    onChange={handleChange('description')}
                    placeholder="Enter project description"
                  />
                </div>
              </div>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Facility Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Facility Name*</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700"
                    value={editData.facilityName || ''}
                    onChange={handleChange('facilityName')}
                    placeholder="Enter facility name"
                  />
                </div>

                <div>
                  <label className="block mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700"
                    value={editData.facilityLocation || ''}
                    onChange={handleChange('facilityLocation')}
                    placeholder="Enter facility location"
                  />
                </div>

                <div>
                  <label className="block mb-1">Size (e.g., 10 MW, 1000 m²)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700"
                    value={editData.facilitySize || ''}
                    onChange={handleChange('facilitySize')}
                    placeholder="Enter facility size"
                  />
                </div>

                <div>
                  <label className="block mb-1">Type</label>
                  <CustomSelect
                    value={editData.facilityType || ''}
                    onChange={handleChange('facilityType')}
                    options={FACILITY_TYPES}
                    placeholder="Select type"
                    name="facilityType"
                    id="facilityType"
                  />
                </div>
              </div>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Start Date</label>
                  <DatePicker
                    selected={editData.startDate ? new Date(editData.startDate.seconds * 1000) : null}
                    onChange={(date: Date | null, event?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
                      if (!date) {
                        setEditData(prev => ({ ...prev, startDate: null }));
                        return;
                      }
                      if (editData.endDate && isAfter(date, new Date(editData.endDate.seconds * 1000))) {
                        alert('Start date cannot be after end date');
                        return;
                      }
                      if (editData.complianceDeadline && 
                          isAfter(date, new Date(editData.complianceDeadline.seconds * 1000))) {
                        alert('Start date cannot be after compliance deadline');
                        return;
                      }
                      setEditData(prev => ({
                        ...prev,
                        startDate: Timestamp.fromDate(date)
                      }));
                    }}
                    dateFormat="MMMM d, yyyy"
                    className={datePickerStyles.input}
                    calendarClassName="!shadow-xl !rounded-lg !border-gray-600"
                    showPopperArrow={false}
                    placeholderText="Select start date"
                    isClearable
                    todayButton="Today"
                    popperModifiers={[
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 8]
                        },
                        fn: (state: any) => state
                      }
                    ]}
                    popperProps={{
                      strategy: 'fixed'
                    }}
                    wrapperClassName="w-full"
                    customInput={
                      <input
                        aria-label="Select start date"
                        className={datePickerStyles.input}
                      />
                    }
                    ariaLabelledBy="start-date-label"
                    enableTabLoop
                    monthsShown={1}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    previousMonthButtonLabel="Previous Month"
                    nextMonthButtonLabel="Next Month"
                    renderCustomHeader={({
                      date,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled
                    }) => (
                      <div className="flex items-center justify-between px-2 py-2">
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          type="button"
                          className="p-1 hover:bg-gray-700 rounded-full disabled:opacity-50"
                          aria-label="Previous Month"
                        >
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h3 className="text-gray-100 font-semibold">
                          {format(date, 'MMMM yyyy')}
                        </h3>
                        <button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          type="button"
                          className="p-1 hover:bg-gray-700 rounded-full disabled:opacity-50"
                          aria-label="Next Month"
                        >
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block mb-1">End Date</label>
                  <DatePicker
                    selected={editData.endDate ? new Date(editData.endDate.seconds * 1000) : null}
                    onChange={(date: Date | null, event?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
                      if (!date) {
                        setEditData(prev => ({ ...prev, endDate: null }));
                        return;
                      }
                      if (editData.startDate && isBefore(date, new Date(editData.startDate.seconds * 1000))) {
                        alert('End date cannot be before start date');
                        return;
                      }
                      setEditData(prev => ({
                        ...prev,
                        endDate: Timestamp.fromDate(date)
                      }));
                    }}
                    dateFormat="MMMM d, yyyy"
                    className={datePickerStyles.input}
                    calendarClassName="!shadow-xl !rounded-lg !border-gray-600"
                    showPopperArrow={false}
                    placeholderText="Select end date"
                    isClearable
                    todayButton="Today"
                    popperModifiers={[
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 8]
                        },
                        fn: (state: any) => state
                      }
                    ]}
                    popperProps={{
                      strategy: 'fixed'
                    }}
                    wrapperClassName="w-full"
                    customInput={
                      <input
                        aria-label="Select end date"
                        className={datePickerStyles.input}
                      />
                    }
                    ariaLabelledBy="end-date-label"
                    enableTabLoop
                    monthsShown={1}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    previousMonthButtonLabel="Previous Month"
                    nextMonthButtonLabel="Next Month"
                    renderCustomHeader={({
                      date,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled
                    }) => (
                      <div className="flex items-center justify-between px-2 py-2">
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          type="button"
                          className="p-1 hover:bg-gray-700 rounded-full disabled:opacity-50"
                          aria-label="Previous Month"
                        >
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h3 className="text-gray-100 font-semibold">
                          {format(date, 'MMMM yyyy')}
                        </h3>
                        <button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          type="button"
                          className="p-1 hover:bg-gray-700 rounded-full disabled:opacity-50"
                          aria-label="Next Month"
                        >
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block mb-1">Compliance Deadline</label>
                  <DatePicker
                    selected={editData.complianceDeadline ? new Date(editData.complianceDeadline.seconds * 1000) : null}
                    onChange={(date: Date | null, event?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
                      if (!date) {
                        setEditData(prev => ({ ...prev, complianceDeadline: null }));
                        return;
                      }
                      if (editData.startDate && isBefore(date, new Date(editData.startDate.seconds * 1000))) {
                        alert('Compliance deadline cannot be before start date');
                        return;
                      }
                      setEditData(prev => ({
                        ...prev,
                        complianceDeadline: Timestamp.fromDate(date)
                      }));
                    }}
                    dateFormat="MMMM d, yyyy"
                    className={datePickerStyles.input}
                    calendarClassName="!shadow-xl !rounded-lg !border-gray-600"
                    showPopperArrow={false}
                    placeholderText="Select compliance deadline"
                    isClearable
                    todayButton="Today"
                    popperModifiers={[
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 8]
                        },
                        fn: (state: any) => state
                      }
                    ]}
                    popperProps={{
                      strategy: 'fixed'
                    }}
                    wrapperClassName="w-full"
                    customInput={
                      <input
                        aria-label="Select compliance deadline"
                        className={datePickerStyles.input}
                      />
                    }
                    ariaLabelledBy="compliance-deadline-label"
                    enableTabLoop
                    monthsShown={1}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    previousMonthButtonLabel="Previous Month"
                    nextMonthButtonLabel="Next Month"
                    renderCustomHeader={({
                      date,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled
                    }) => (
                      <div className="flex items-center justify-between px-2 py-2">
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          type="button"
                          className="p-1 hover:bg-gray-700 rounded-full disabled:opacity-50"
                          aria-label="Previous Month"
                        >
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h3 className="text-gray-100 font-semibold">
                          {format(date, 'MMMM yyyy')}
                        </h3>
                        <button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          type="button"
                          className="p-1 hover:bg-gray-700 rounded-full disabled:opacity-50"
                          aria-label="Next Month"
                        >
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Milestones</h3>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-800 rounded">
                    <div>
                      <label className="block mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600"
                        value={milestone.name}
                        onChange={(e) => {
                          const newMilestones = [...milestones]
                          newMilestones[index].name = e.target.value
                          setMilestones(newMilestones)
                        }}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600"
                        value={new Date(milestone.dueDate).toISOString().split('T')[0]}
                        onChange={(e) => {
                          const newMilestones = [...milestones]
                          newMilestones[index].dueDate = new Date(e.target.value)
                          setMilestones(newMilestones)
                        }}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block mb-1">Status</label>
                        <select
                          className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600"
                          value={milestone.status}
                          onChange={(e) => {
                            const newMilestones = [...milestones]
                            newMilestones[index].status = e.target.value
                            setMilestones(newMilestones)
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        className="self-end px-3 py-2 bg-red-600 hover:bg-red-700 rounded"
                        onClick={() => removeMilestone(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center gap-2"
                  onClick={addMilestone}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Milestone
                </button>
              </div>
            </section>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold">
                  {project.projectName || "Untitled Project"}
                </h1>
                <div className="flex items-center">
                  <span 
                    style={{
                      ...styles.statusIcon,
                      backgroundColor: styles.statusColors[project.status as keyof typeof styles.statusColors] || styles.statusColors.unknown
                    }}
                    title={`Status: ${project.status || "Unknown"}`}
                  />
                  <span className="text-gray-400">
                    {project.status || "Unknown status"}
                  </span>
                </div>
                <div className="bg-gray-800 px-3 py-1 rounded">
                  Priority: <span className="font-semibold">{project.projectPriority || "Not set"}</span>
                </div>
              </div>
              
              {isOwner && !creatingThread && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  onClick={() => setCreatingThread(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Thread
                </button>
              )}
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="mb-4">
                <span className="text-gray-400">Current Phase:</span>
                <p className="text-xl font-medium mt-1">{project.currentPhase || "Not specified"}</p>
              </div>

              <div>
                <span className="text-gray-400">Description:</span>
                <p className="mt-1 text-lg leading-relaxed whitespace-pre-wrap">
                  {project.description || "No description provided"}
                </p>
              </div>
            </div>

            <section className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Facility Information</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <span className="text-gray-400">Facility Name:</span>
                  <p className="font-medium">{project.facilityName || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-gray-400">Location:</span>
                  <p className="font-medium">{project.facilityLocation || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-gray-400">Size:</span>
                  <p className="font-medium">{project.facilitySize || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <p className="font-medium">{project.facilityType || "Not provided"}</p>
                </div>
              </div>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Timeline</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <span className="text-gray-400">Start Date:</span>
                  <p className="font-medium">{formatDate(project.startDate)}</p>
                </div>
                <div>
                  <span className="text-gray-400">End Date:</span>
                  <p className="font-medium">{formatDate(project.endDate)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Compliance Deadline:</span>
                  <p className="font-medium">{formatDate(project.complianceDeadline)}</p>
                </div>
              </div>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Milestones</h3>
              {project.milestones?.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Due Date</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.milestones.map((milestone: Milestone, index: number) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-2">{milestone.name}</td>
                        <td className="py-2">{new Date(milestone.dueDate).toLocaleDateString()}</td>
                        <td className="py-2">{milestone.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">No milestones have been added</p>
              )}
            </section>

            {isOwner && (
              <div className="flex gap-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => setEditing(true)}
                >
                  Edit Project
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={handleDeleteProject}
                >
                  Delete Project
                </button>
              </div>
            )}
          </div>
        )}

        <hr className="my-8 border-gray-700" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Threads</h2>
            {isOwner && !creatingThread && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={() => setCreatingThread(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Thread
              </button>
            )}
          </div>
          
          {isOwner && creatingThread && (
            <form 
              id="thread-creation-form"
              onSubmit={handleCreateThread} 
              className="mb-8 bg-gray-900 p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Create New Thread</h3>
              
              <div className="text-gray-400 text-sm mb-6 space-y-2">
                <p>
                  A thread allows you to ask specific questions or document project-related discussions. 
                  Threads can be used for:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Engineering Code Questions (e.g., ASME, ISO, NFPA interpretations)</li>
                  <li>Project-Specific Queries (e.g., timelines, milestones, tasks)</li>
                  <li>Permitting Process Issues (e.g., water, air permits, local regulations)</li>
                  <li>Compliance Support (e.g., OSHA PSM, EPA RMP documentation)</li>
                </ul>
                <p className="mt-4">
                  Threads help your team centralize project communications and maintain clear records. 
                  Provide a clear and concise title for your thread to keep it organized.
                </p>
              </div>

              {threadError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
                  {threadError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Thread Category</label>
                  <CustomSelect
                    value={newThreadCategory}
                    onChange={(e) => setNewThreadCategory(e.target.value)}
                    options={[...THREAD_CATEGORIES]}
                    placeholder="Select a category (optional)"
                    name="threadCategory"
                    id="threadCategory"
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    Thread Title
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800 rounded border ${
                      threadError ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter a descriptive title for your thread..."
                    required
                  />
                  {threadError && threadError.includes('title') && (
                    <p className="mt-1 text-sm text-red-500">{threadError}</p>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Thread
                  </button>
                  <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setCreatingThread(false)
                      setThreadError(null)
                      setNewThreadTitle('')
                      setNewThreadCategory('')
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {threadsLoading ? (
            <div>Loading threads...</div>
          ) : threadError ? (
            <div>{threadError}</div>
          ) : threads.length > 0 ? (
            <ul className="space-y-2">
              {threads.map((thread) => (
                <li key={thread.id} className="bg-gray-900 p-4 rounded hover:bg-gray-800 transition">
                  <Link href={`/threads/${thread.id}`}>
                    <span className="font-semibold hover:underline cursor-pointer">{thread.title}</span>
                  </Link>
                  {thread.lastModified && thread.lastModified.toDate &&
                    <p className="text-sm text-gray-400">
                      Last Modified: {thread.lastModified.toDate().toLocaleString()}
                    </p>
                  }
                  <p className="text-sm text-gray-400">Messages: {thread.messageCount || 0}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No threads found for this project.</p>
          )}
        </div>
      </main>

      <footer className="p-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} H2Safety.ai
      </footer>
    </div>
  )
}
