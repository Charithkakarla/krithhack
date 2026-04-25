import { useState } from 'react'
import { Target, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react'
import { useFilters } from '../../context/FilterContext'
import { getRuntimeApiBase } from '../../services/runtimeConfig'

const API_BASE = getRuntimeApiBase()
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api/v1'

async function fetchJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

function setGoalApi(phone, goalType, value) {
  return fetchJson('/goals/set', {
    method: 'POST',
    body: JSON.stringify({ phone, goal_type: goalType, value }),
  })
}

function getProgressApi(phone, studentId) {
  return fetchJson('/goals/progress', {
    method: 'POST',
    body: JSON.stringify({ phone, student_id: studentId }),
  })
}

function ProgressBar({ current, target, tone }) {
  const pct = Math.min(100, Math.round((current / 100) * 100))
  const color = tone === 'success' ? '#22c55e' : '#f97316'
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span>Current: {current}%</span>
        <span>Target: {target}%</span>
      </div>
      <div style={{ background: '#e2e8f0', borderRadius: 8, height: 10 }}>
        <div style={{ width: `${pct}%`, background: color, borderRadius: 8, height: 10, transition: 'width 0.4s' }} />
      </div>
    </div>
  )
}

export default function GoalTrackerView() {
  const { classStudents } = useFilters()
  const [selectedStudent, setSelectedStudent] = useState('')
  const [phone, setPhone] = useState('')
  const [goalType, setGoalType] = useState('attendance')
  const [goalValue, setGoalValue] = useState('')
  const [goals, setGoals] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const allStudents = classStudents || []

  async function handleSetGoal(e) {
    e.preventDefault()
    if (!phone || !goalValue) return
    setLoading(true)
    setMessage('')
    try {
      const res = await setGoalApi(phone, goalType, parseFloat(goalValue))
      setGoals(res.goals)
      setMessage('✅ Goal set successfully!')
    } catch {
      setMessage('Failed to set goal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckProgress() {
    if (!phone) return
    setLoading(true)
    setMessage('')
    try {
      const res = await getProgressApi(phone, selectedStudent || undefined)
      setGoals(res.goals)
      setMessage(res.report)
    } catch {
      setMessage('Failed to fetch progress.')
    } finally {
      setLoading(false)
    }
  }

  const student = allStudents.find((s) => s.id === selectedStudent)
  const currentAttendance = student ? parseFloat(student.attendancePercentage || 0) : null
  const currentMarks = student
    ? Math.round(((parseFloat(student.mathGrade || 0) + parseFloat(student.scienceGrade || 0)) / 2))
    : null

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Target size={24} color="#6366f1" />
        <h2 style={{ margin: 0, fontSize: 22 }}>Goal Tracker</h2>
      </div>

      <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ marginTop: 0, fontSize: 16 }}>Set a New Goal</h3>
        <form onSubmit={handleSetGoal} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Student (optional)</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}
              >
                <option value="">-- Select Student --</option>
                {allStudents.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Parent Phone *</label>
              <input
                type="text"
                placeholder="e.g. 917799663979"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Goal Type</label>
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}
              >
                <option value="attendance">Attendance</option>
                <option value="marks">Marks</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Target % *</label>
              <input
                type="number"
                min="1"
                max="100"
                placeholder="e.g. 90"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              disabled={loading}
              style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
            >
              {loading ? 'Saving...' : 'Set Goal'}
            </button>
            <button
              type="button"
              onClick={handleCheckProgress}
              disabled={loading || !phone}
              style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
            >
              <TrendingUp size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Check Progress
            </button>
          </div>
        </form>
      </div>

      {goals && Object.keys(goals).length > 0 && (
        <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ marginTop: 0, fontSize: 16 }}>Active Goals</h3>
          {goals.attendance != null && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {currentAttendance != null && currentAttendance >= goals.attendance
                  ? <CheckCircle size={16} color="#22c55e" />
                  : <AlertTriangle size={16} color="#f97316" />}
                <strong>Attendance Goal: {goals.attendance}%</strong>
              </div>
              {currentAttendance != null && (
                <ProgressBar
                  current={currentAttendance}
                  target={goals.attendance}
                  tone={currentAttendance >= goals.attendance ? 'success' : 'warning'}
                />
              )}
            </div>
          )}
          {goals.marks != null && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {currentMarks != null && currentMarks >= goals.marks
                  ? <CheckCircle size={16} color="#22c55e" />
                  : <AlertTriangle size={16} color="#f97316" />}
                <strong>Marks Goal: {goals.marks}%</strong>
              </div>
              {currentMarks != null && (
                <ProgressBar
                  current={currentMarks}
                  target={goals.marks}
                  tone={currentMarks >= goals.marks ? 'success' : 'warning'}
                />
              )}
            </div>
          )}
        </div>
      )}

      {message && (
        <div className="panel" style={{ padding: 16, whiteSpace: 'pre-wrap', fontSize: 14, borderLeft: '4px solid #6366f1' }}>
          {message}
        </div>
      )}

      <div className="panel" style={{ padding: 16, marginTop: 20, background: '#f8fafc' }}>
        <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
          <strong>Via WhatsApp:</strong> Parents can also set goals by sending messages like:<br />
          <em>"Set goal: 90% attendance"</em> or <em>"Set goal: 80% marks"</em><br />
          And check progress with: <em>"My goal progress"</em>
        </p>
      </div>
    </div>
  )
}
