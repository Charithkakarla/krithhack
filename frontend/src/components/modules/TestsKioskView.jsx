import { useMemo, useState } from 'react'
import { CheckCircle2, Link2, Send, Smartphone } from 'lucide-react'
import { useFilters } from '../../context/FilterContext'

const steps = ['Create', 'Send Link', 'Take Test', 'Analysis']

const studentsAttempting = [
  { name: 'Aarav Sharma', status: 'In Progress' },
  { name: 'Ananya Rao', status: 'Completed' },
  { name: 'Rahul Mehta', status: 'Not Started' },
  { name: 'Sneha Kapoor', status: 'In Progress' }
]

export default function TestsKioskView() {
  const { classOptions, selectedClass, setSelectedClass, classStudents } = useFilters()
  const [testName, setTestName] = useState('Mathematics - Unit Test 3')
  const [recipientStudentId, setRecipientStudentId] = useState('')
  const [sendMessage, setSendMessage] = useState('')

  const recipientStudent = useMemo(
    () => classStudents.find((student) => student.id === recipientStudentId) || null,
    [classStudents, recipientStudentId]
  )

  function handleSendLink() {
    if (recipientStudent) {
      setSendMessage(`Test link sent to ${recipientStudent.name} only.`)
      return
    }
    setSendMessage(`Test link sent to all students in class ${classOptions.find((item) => item.id === selectedClass)?.label}.`)
  }

  return (
    <div className="module-page">
      <header className="module-header panel">
        <div>
          <h2>Tests (Kiosk)</h2>
          <p>Create and monitor tests delivered through digital links.</p>
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
                  <option value="">All Students</option>
                  {classStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="generate-btn" type="button" onClick={handleSendLink}>
                <Send size={16} />
                Send Link
              </button>
              {sendMessage ? <p className="hint-text compact">{sendMessage}</p> : null}
            </div>

            <div className="phone-preview">
              <div className="phone-header">
                <Smartphone size={15} /> WhatsApp Preview
              </div>
              <p>Hello Parent,</p>
              <p>
                Test link for {recipientStudent?.name || 'Class 10-A students'} is ready.
                <br />
                Click: https://vnr.school/test/{testName.toLowerCase().replace(/\s+/g, '-')}
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
