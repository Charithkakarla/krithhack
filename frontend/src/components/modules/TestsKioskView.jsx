import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Link2, Send } from 'lucide-react'
import { useFilters } from '../../context/FilterContext'
import { startStudentTest } from '../../services/studentApi'

const steps = ['Create', 'Send Link', 'Take Test', 'Analysis']
const TARGET_NUMBER = '7799663979'

const subjects = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Computer Science'
]

const studentStatuses = ['In Progress', 'Completed', 'Not Started', 'In Progress']

export default function TestsKioskView() {
  const { classOptions, selectedClass, setSelectedClass, classStudents } = useFilters()
  const [testName, setTestName] = useState('Mathematics - Unit Test 3')
  const [subject, setSubject] = useState('Mathematics')
  const [recipientStudentId, setRecipientStudentId] = useState('all')
  const [notification, setNotification] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [studentPickerOpen, setStudentPickerOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const studentPickerRef = useRef(null)

  const recipientStudent = useMemo(
    () =>
      recipientStudentId === 'all'
        ? null
        : classStudents.find((student) => student.id === recipientStudentId) || null,
    [classStudents, recipientStudentId]
  )

  const selectedRecipients = useMemo(() => {
    if (recipientStudentId === 'all') {
      return classStudents.slice(0, 3)
    }

    return recipientStudent ? [recipientStudent] : []
  }, [classStudents, recipientStudent, recipientStudentId])

  const studentsAttempting = useMemo(
    () =>
      classStudents.slice(0, 4).map((student, index) => ({
        name: student.name,
        status: studentStatuses[index % studentStatuses.length]
      })),
    [classStudents]
  )

  useEffect(() => {
    if (!notification) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setNotification('')
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [notification])

  useEffect(() => {
    if (recipientStudentId === 'all') {
      return
    }

    if (recipientStudentId && !classStudents.some((student) => student.id === recipientStudentId)) {
      setRecipientStudentId('all')
    }
  }, [classStudents, recipientStudentId])

  useEffect(() => {
    function handlePointerDown(event) {
      if (!studentPickerRef.current) {
        return
      }

      if (!studentPickerRef.current.contains(event.target)) {
        setStudentPickerOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setStudentPickerOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  async function handleSendLink() {
    if (isSending) {
      return
    }

    const recipients = selectedRecipients
    if (recipients.length === 0) {
      setNotification('No student found in this class.')
      return
    }

    const sanitizedUserId = TARGET_NUMBER.replace(/[^0-9]/g, '')
    setIsSending(true)

    try {
      const results = await Promise.all(
        recipients.map((student) => startStudentTest(sanitizedUserId, student.name, subject))
      )
      setGeneratedLink(results[0]?.link || '')
      setNotification(
        recipientStudentId === 'all'
          ? 'Test link sent to all students.'
          : `Test link sent to ${recipients[0].name}.`
      )
    } catch {
      setGeneratedLink('')
      setNotification('Backend unavailable. Could not create test link.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="module-page">
      <header className="module-header panel">
        <div>
          <h2>Tests (Kiosk)</h2>
          <p>Create and monitor subject-based tests delivered through digital links.</p>
        </div>
      </header>

      <section className="panel stepper-card">
        <div className="stepper-row">
          {steps.map((step, index) => (
            <div key={step} className={`step-item ${index < 3 ? 'done' : ''}`}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="module-two-col">
        <article className="panel whatsapp-card">
          <div className="panel-header compact">
            <h3>Send Test Link on WhatsApp</h3>
          </div>
          <div className="whatsapp-layout">
            <div className="filter-stack">
              <label>
                Select Test
                <select value={testName} onChange={(event) => setTestName(event.target.value)}>
                  <option>Mathematics - Unit Test 3</option>
                  <option>Science - Midterm Revision</option>
                  <option>English - Grammar Practice</option>
                  <option>Social Studies - Chapter Test</option>
                  <option>Computer Science - Lab Quiz</option>
                </select>
              </label>
              <label>
                Select Subject
                <select value={subject} onChange={(event) => setSubject(event.target.value)}>
                  {subjects.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Select Class
                <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
                  {classOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      Class {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button className="generate-btn" type="button" onClick={handleSendLink} disabled={isSending}>
                <Send size={16} />
                {isSending ? 'Sending...' : 'Send Test Link'}
              </button>
              <p className="hint-text compact">
                {recipientStudent ? `Selected student: ${recipientStudent.name}` : 'Selected student: all students'}
              </p>
            </div>
          </div>
        </article>

        <article className="panel live-tracking-card">
          <div className="panel-header compact tracking-header">
            <h3>Students Attempting</h3>
            <div className="student-picker-wrap student-picker-wrap-right" ref={studentPickerRef}>
              <button
                className="generate-btn student-picker-trigger"
                type="button"
                onClick={() => setStudentPickerOpen((open) => !open)}
              >
                Select Student
              </button>
              {studentPickerOpen ? (
                <div className="student-picker-menu panel">
                  <button
                    type="button"
                    className={`student-picker-option ${recipientStudentId === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setRecipientStudentId('all')
                      setStudentPickerOpen(false)
                    }}
                  >
                    Select all students
                  </button>
                  {classStudents.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      className={`student-picker-option ${recipientStudentId === student.id ? 'active' : ''}`}
                      onClick={() => {
                        setRecipientStudentId(student.id)
                        setStudentPickerOpen(false)
                      }}
                    >
                      {student.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="tracking-list">
            {studentsAttempting.map((student) => (
              <div key={student.name} className="tracking-item">
                <span>{student.name}</span>
                <span className={`tracking-badge ${student.status.toLowerCase().replace(' ', '-')}`}>{student.status}</span>
              </div>
            ))}
          </div>

          <div className="results-summary">
            <article>
              <h4>Average Score</h4>
              <p>74.2%</p>
            </article>
            <article>
              <h4>Pass Percentage</h4>
              <p>87.5%</p>
            </article>
          </div>
          <p className="hint-text">
            <CheckCircle2 size={14} /> Live updates every 30 seconds
          </p>
        </article>
      </section>

      <section className="panel integration-note">
        <Link2 size={16} />
        <span>WhatsApp template approved and delivery status tracking is enabled.</span>
      </section>

      {notification ? (
        <div className="popup-toast" role="status" aria-live="polite">
          {notification}
        </div>
      ) : null}
    </div>
  )
}
