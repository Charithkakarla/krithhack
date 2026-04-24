import { useState } from 'react'

const BASE = 'http://127.0.0.1:8000/api/v1'

export default function App() {
  const [studentId, setStudentId] = useState('1')
  const [message, setMessage] = useState('Show attendance')
  const [output, setOutput] = useState('')

  const call = async (path, options) => {
    try {
      const res = await fetch(`${BASE}${path}`, options)
      const text = await res.text()
      setOutput(`Status: ${res.status}\n\n${text}`)
    } catch (err) {
      setOutput(`Request failed: ${err}`)
    }
  }

  return (
    <main className="shell">
      <h1>WhatsApp Assistant React Console</h1>
      <p>This is an optional React control panel. Official user channel remains WhatsApp webhook.</p>

      <section className="card">
        <label>Student ID</label>
        <input value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <div className="row">
          <button onClick={() => call(`/attendance/${studentId}`)}>Get Attendance</button>
          <button onClick={() => call(`/generate-report/${studentId}`)}>Generate Report</button>
        </div>
      </section>

      <section className="card">
        <label>Simulate Webhook Message</label>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button
          onClick={() =>
            call('/webhook', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ From: 'whatsapp:+919900000001', Body: message })
            })
          }
        >
          Send to /webhook
        </button>
      </section>

      <pre className="output">{output || 'Output will appear here...'}</pre>
    </main>
  )
}
