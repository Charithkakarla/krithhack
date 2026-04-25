import { useMemo, useState } from 'react'
import { Download, Eye, Send } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useFilters } from '../../context/FilterContext'
import { marksFallbackByStudent } from '../../data/students'
import { sendStudentReport } from '../../services/studentApi'

const actionCards = [
  { label: 'Weekly Report', type: 'weekly_report' },
  { label: 'Exam Report', type: 'exam_report' },
  { label: 'Overall Report Card', type: 'overall_report_card' }
]

const recentReports = [
  { name: 'Weekly Performance - Class 10-A', date: '24 Apr 2026' },
  { name: 'Attendance Summary - March', date: '22 Apr 2026' },
  { name: 'Term Progress - Class 9-B', date: '18 Apr 2026' }
]

const performance = [
  { subject: 'Maths', value: 82 },
  { subject: 'Science', value: 78 },
  { subject: 'English', value: 74 },
  { subject: 'Social', value: 71 },
  { subject: 'Computer', value: 85 }
]

const reportLabels = {
  weekly_report: 'Weekly Academic Report',
  exam_report: 'Exam Report',
  overall_report_card: 'Overall Report Card'
}

export default function ReportsView() {
  const { classOptions, selectedClass, setSelectedClass, classStudents, selectedStudent, setSelectedStudent, selectedClassLabel, dataSource } = useFilters()
  const [studentOverride, setStudentOverride] = useState('')
  const [reportType, setReportType] = useState('weekly_report')
  const [reportStatus, setReportStatus] = useState('')
  const [recentGenerated, setRecentGenerated] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const topPerformers = useMemo(() => {
    return classStudents
      .map((student) => {
        const fallbackMarks = marksFallbackByStudent[student.id]
        const marks = fallbackMarks?.overallPercentage ?? Math.round(((Number(student.mathGrade) || 0) + (Number(student.scienceGrade) || 0)) / 2)
        return `${student.name} - ${Number.isFinite(marks) ? marks : 0}%`
      })
      .slice(0, 4)
  }, [classStudents])

  const reportStudent = useMemo(() => {
    if (studentOverride) {
      return classStudents.find((item) => item.id === studentOverride) || null
    }
    return selectedStudent || classStudents[0] || null
  }, [classStudents, selectedStudent, studentOverride])

  async function handleGenerateReport() {
    if (!reportStudent) {
      setReportStatus('Select a student before generating a PDF.')
      return
    }

    const payload = {
      class_id: selectedClassLabel,
      report_type: reportType,
      student_id: reportStudent.id
    }

    try {
      setIsGenerating(true)
      const result = await sendStudentReport(reportStudent.id, reportType)
      const sentCount = (result.results || []).filter((item) => item.sent).length
      const generated = {
        name: `${reportLabels[reportType] || 'Report'} - ${reportStudent.name}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        studentId: reportStudent.id,
        reportType
      }
      setRecentGenerated((items) => [generated, ...items].slice(0, 5))
      setReportStatus(`PDF generated and sent on WhatsApp for ${reportStudent.name}. Sent to ${sentCount}/${(result.results || []).length} recipient. ${JSON.stringify(payload)}`)
    } catch {
      setReportStatus(`Could not send the PDF on WhatsApp. Check backend and Evolution API. ${JSON.stringify(payload)}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="module-page">
      <header className="module-header panel">
        <div>
          <h2>Reports</h2>
          <p>Generate, review, and distribute school reports.</p>
        </div>
      </header>

      <section className="module-card-grid four">
        {actionCards.map((item) => (
          <button key={item.type} className="panel action-card" type="button" onClick={() => setReportType(item.type)}>
            <strong>{item.label}</strong>
            <span>{item.type === 'exam_report' ? 'PDF without graph' : 'PDF with graphs and academic recommendations'}</span>
          </button>
        ))}
      </section>

      <section className="panel generator-bar">
        <div className="filter-compact">
          <label>Report Type</label>
          <select value={reportType} onChange={(event) => setReportType(event.target.value)}>
            <option value="weekly_report">Weekly Report PDF</option>
            <option value="exam_report">Exam Report PDF</option>
            <option value="overall_report_card">Overall Report Card PDF</option>
          </select>
        </div>
        <div className="filter-compact">
          <label>Class</label>
          <select
            value={selectedClass}
            onChange={(event) => {
              setSelectedClass(event.target.value)
              setStudentOverride('')
            }}
          >
            {classOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-compact">
          <label>Student (Optional)</label>
          <select
            value={studentOverride}
            onChange={(event) => {
              setStudentOverride(event.target.value)
              const student = classStudents.find((item) => item.id === event.target.value) || null
              if (student) {
                setSelectedStudent(student)
              }
            }}
          >
            <option value="">Current Student</option>
            {classStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-compact">
          <label>Year</label>
          <select defaultValue="2026">
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>
        <button className="generate-btn" type="button" onClick={handleGenerateReport}>
          {isGenerating ? 'Sending...' : 'Send PDF on WhatsApp'}
        </button>
      </section>

      {reportStatus ? <section className="panel status-message">{reportStatus}</section> : null}
      <section className="panel status-message">Student data source: {dataSource === 'supabase' ? 'Supabase live database' : 'local fallback data'}</section>

      <section className="panel">
        <div className="panel-header compact">
          <h3>Recent Reports</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Generated On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...recentGenerated, ...recentReports].map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td>
                  <div className="table-actions">
                    <button type="button" aria-label="View">
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Send on WhatsApp"
                      onClick={() => {
                        if (item.studentId) {
                          sendStudentReport(item.studentId, item.reportType)
                        }
                      }}
                    >
                      <Download size={16} />
                    </button>
                    <button type="button" aria-label="Send">
                      <Send size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="module-two-col">
        <article className="panel">
          <div className="panel-header compact">
            <h3>Class Performance Overview</h3>
          </div>
          <div className="chart-wrap medium">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performance} margin={{ top: 18, right: 10, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#eef2f8" strokeDasharray="3 3" />
                <XAxis dataKey="subject" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel performers-card">
          <div className="panel-header compact">
            <h3>Top Performers</h3>
          </div>
          <ul>
            {topPerformers.map((performer) => (
              <li key={performer}>{performer}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
