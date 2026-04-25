import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useFilters } from '../../context/FilterContext'
import { classAverageTrend, examLabels, marksFallbackByStudent } from '../../data/students'
import { getStudentMarks, sendStudentReport } from '../../services/studentApi'

const distribution = [
  { range: '90% and above', students: 2, color: '#22c55e' },
  { range: '80-89%', students: 8, color: '#3b82f6' },
  { range: '70-79%', students: 14, color: '#a855f7' },
  { range: '60-69%', students: 11, color: '#f59e0b' },
  { range: 'Below 60%', students: 7, color: '#ef4444' }
]

export default function MarksResultsView() {
  const { classOptions, selectedClass, setSelectedClass, classStudents, selectedStudent, setSelectedStudent } = useFilters()
  const [marksData, setMarksData] = useState(null)
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState('')

  async function handleSendResult() {
    if (!selectedStudent) {
      setToast('Please select a student first.')
      setTimeout(() => setToast(''), 3000)
      return
    }
    setSending(true)
    setToast('')
    try {
      await sendStudentReport(selectedStudent.id, 'exam_report')
      setToast(`Result sent to ${selectedStudent.name}'s parent on WhatsApp.`)
    } catch {
      setToast('Failed to send. Check backend logs.')
    } finally {
      setSending(false)
      setTimeout(() => setToast(''), 4000)
    }
  }

  useEffect(() => {
    let active = true

    async function loadMarks() {
      if (!selectedStudent) {
        setMarksData(null)
        return
      }

      try {
        const response = await getStudentMarks(selectedStudent.id)
        if (!active) {
          return
        }
        setMarksData(response)
      } catch {
        if (!active) {
          return
        }
        setMarksData(marksFallbackByStudent[selectedStudent.id] || null)
      }
    }

    loadMarks()
    return () => {
      active = false
    }
  }, [selectedStudent])

  const stats = useMemo(() => {
    if (!marksData) {
      return []
    }

    return [
      { title: 'Overall Percentage', value: `${marksData.overallPercentage.toFixed(1)}%` },
      { title: 'Grade', value: marksData.grade },
      { title: 'Rank', value: marksData.rank },
      { title: 'Total Marks', value: `${marksData.obtained}/${marksData.total}` }
    ]
  }, [marksData])

  const trend = useMemo(() => {
    const studentTrend = marksData?.trend || []
    return examLabels.map((exam, index) => ({ exam, student: studentTrend[index] || 0, classAvg: classAverageTrend[index] || 0 }))
  }, [marksData])

  return (
    <div className="module-page">
      <header className="module-header panel">
        <div>
          <h2>Marks & Results</h2>
          <p>Student performance analytics and class benchmarking.</p>
        </div>
        <button
          className="generate-btn"
          type="button"
          disabled={sending}
          onClick={handleSendResult}
        >
          <Download size={16} />
          {sending ? 'Sending...' : 'Send Result PDF'}
        </button>
      </header>
      {toast && <div className="toast-notification">{toast}</div>}

      <section className="panel generator-bar student-filter-bar">
        <div className="filter-compact">
          <label>Class</label>
          <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
            {classOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-compact">
          <label>Student</label>
          <select
            value={selectedStudent?.id || ''}
            onChange={(event) => {
              const student = classStudents.find((item) => item.id === event.target.value) || null
              setSelectedStudent(student)
            }}
          >
            {classStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="module-card-grid four">
        {stats.map((item) => (
          <article key={item.title} className="panel stat-card-soft">
            <h4>{item.title}</h4>
            <p>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="module-two-col">
        <article className="panel">
          <div className="panel-header compact">
            <h3>Subject Scores</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Max Marks</th>
                <th>Obtained</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {(marksData?.subjects || []).map((row) => (
                <tr key={row.subject}>
                  <td>{row.subject}</td>
                  <td>{row.max}</td>
                  <td>{row.obtained}</td>
                  <td>
                    <span className="grade-chip">{row.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel">
          <div className="panel-header compact">
            <h3>Marks Distribution</h3>
          </div>
          <div className="chart-wrap medium">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="students" nameKey="range" innerRadius={62} outerRadius={95} paddingAngle={4}>
                  {distribution.map((entry) => (
                    <Cell key={entry.range} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header compact">
          <h3>Performance Trend: {selectedStudent?.name || 'Student'} vs Class Average</h3>
        </div>
        <div className="chart-wrap large">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 14, right: 18, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#eaf0f9" strokeDasharray="3 3" />
              <XAxis dataKey="exam" tickLine={false} axisLine={false} />
              <YAxis domain={[60, 90]} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="student" stroke="#2563eb" strokeWidth={3} name={selectedStudent?.name || 'Student'} />
              <Line type="monotone" dataKey="classAvg" stroke="#22c55e" strokeWidth={3} name="Class Average" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
