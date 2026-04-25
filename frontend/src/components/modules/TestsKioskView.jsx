import { useMemo, useState } from 'react'
import { CheckCircle2, Link2, Send, Smartphone } from 'lucide-react'
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

const studentsAttempting = [
  { name: 'Aarav Sharma', status: 'In Progress' },
  { name: 'Ananya Rao', status: 'Completed' },
  { name: 'Rahul Mehta', status: 'Not Started' },
  { name: 'Sneha Kapoor', status: 'In Progress' }
]

export default function TestsKioskView() {
  const { classOptions, selectedClass, setSelectedClass, classStudents } = useFilters()
  const [testName, setTestName] = useState('Mathematics - Unit Test 3')
  const [subject, setSubject] = useState('Mathematics')
  const [recipientStudentId, setRecipientStudentId] = useState('')
  const [sendMessage, setSendMessage] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')

  const recipientStudent = useMemo(
    () => classStudents.find((student) => student.id === recipientStudentId) || classStudents[0] || null,
    [classStudents, recipientStudentId]
  )

  async function handleSendLink() {
    const selected = recipientStudent || classStudents[0]
    if (!selected) {
      setSendMessage('No student found in this class.')
      return
    }

    const sanitizedUserId = TARGET_NUMBER.replace(/[^0-9]/g, '')

    try {
      const started = await startStudentTest(sanitizedUserId, selected.name, subject)
      setGeneratedLink(started.link || '')
      setSendMessage(`Test link for ${subject} sent to ${TARGET_NUMBER}.`)
    } catch {
      setGeneratedLink('')
      setSendMessage('Backend unavailable. Could not create test link.')
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
              <label>
                Select Student (Optional)
                <select value={recipientStudentId} onChange={(event) => setRecipientStudentId(event.target.value)}>
                  <option value="">Default student in class</option>
                  {classStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="generate-btn" type="button" onClick={handleSendLink}>
                <Send size={16} />
                Send Link to {TARGET_NUMBER}
              </button>
              {sendMessage ? <p className="hint-text compact">{sendMessage}</p> : null}
            </div>

            <div className="phone-preview">
              <div className="phone-header">
                <Smartphone size={15} /> WhatsApp Preview
              </div>
              <p>Hello Parent,</p>
              <p>
                {subject} test link for {recipientStudent?.name || 'Class 10-A students'} is ready.
                <br />
                Click: {generatedLink || `${window.location.origin}/#/test/${testName.toLowerCase().replace(/\s+/g, '-')}`}
              </p>
              <small>Sent via VNR Smart School</small>
            </div>
          </div>
        </article>

        <article className="panel live-tracking-card">
          <div className="panel-header compact">
            <h3>Students Attempting</h3>
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
    </div>
  )
}
