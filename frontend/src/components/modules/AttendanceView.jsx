import { useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useFilters } from '../../context/FilterContext'
import { attendanceFallbackByStudent } from '../../data/students'
import { getStudentAttendance } from '../../services/studentApi'

function sparklineData(values) {
  return values.map((value, index) => ({ i: index, value }))
}

export default function AttendanceView() {
  const {
    classOptions,
    selectedClass,
    setSelectedClass,
    classStudents,
    selectedStudent,
    setSelectedStudent,
    selectedClassLabel
  } = useFilters()
  const [attendanceData, setAttendanceData] = useState(null)

  useEffect(() => {
    let active = true

    async function loadAttendance() {
      if (!selectedStudent) {
        setAttendanceData(null)
        return
      }

      try {
        const response = await getStudentAttendance(selectedStudent.id)
        if (!active) {
          return
        }
        setAttendanceData(response)
      } catch {
        if (!active) {
          return
        }
        setAttendanceData(attendanceFallbackByStudent[selectedStudent.id] || null)
      }
    }

    loadAttendance()
    return () => {
      active = false
    }
  }, [selectedStudent])

  const averageCards = useMemo(() => {
    if (!attendanceData) {
      return []
    }

    const weekly = attendanceData.weeklyAverage || []
    const monthly = attendanceData.monthlyAverage || []
    const overall = attendanceData.overallAverage || []

    const avg = (list) => {
      if (!list.length) {
        return 0
      }
      return list.reduce((sum, value) => sum + value, 0) / list.length
    }

    return [
      { title: 'Weekly Average', value: `${avg(weekly).toFixed(1)}%`, data: weekly },
      { title: 'Monthly Average', value: `${avg(monthly).toFixed(1)}%`, data: monthly },
      { title: 'Overall Average', value: `${avg(overall).toFixed(1)}%`, data: overall }
    ]
  }, [attendanceData])

  return (
    <div className="module-page">
      <header className="module-header panel">
        <div>
          <h2>Attendance Module</h2>
          <p>Detailed student attendance analytics and records.</p>
        </div>
      </header>

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

      <section className="panel attendance-profile">
        <div className="student-profile-head">
          <div className="profile-avatar">{selectedStudent?.name?.slice(0, 2).toUpperCase() || '--'}</div>
          <div>
            <h3>{selectedStudent?.name || 'Select Student'}</h3>
            <p>Class {selectedClassLabel}</p>
          </div>
        </div>
        <div className="profile-metrics">
          <article>
            <h4>Total Present</h4>
            <p>
              {attendanceData?.totalPresent ?? 0}/{attendanceData?.totalDays ?? 0}
            </p>
          </article>
          <article>
            <h4>Attendance %</h4>
            <p>{attendanceData?.attendancePercentage?.toFixed(1) ?? '0.0'}%</p>
          </article>
          <article>
            <h4>Total Absent</h4>
            <p>{attendanceData?.totalAbsent ?? 0}</p>
          </article>
          <article>
            <h4>Late Coming</h4>
            <p>{attendanceData?.lateCount ?? 0}</p>
          </article>
        </div>
      </section>

      <section className="module-two-col">
        <article className="panel attendance-table-card">
          <div className="panel-header compact">
            <h3>Attendance History</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
                <th>Period Present</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {(attendanceData?.history || []).map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td>{row.day}</td>
                  <td>
                    <span className={`status-badge status-${row.status.toLowerCase()}`}>{row.status}</span>
                  </td>
                  <td>{row.periods}</td>
                  <td>{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel attendance-trend-card">
          <div className="panel-header compact">
            <h3>Attendance Trend</h3>
            <button className="ghost-select" type="button">
              Last 30 Days
              <ChevronDown size={14} />
            </button>
          </div>
          <div className="chart-wrap medium">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData?.trend || []} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#ebf0f8" strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[65, 90]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} labelFormatter={(label) => `${label} 2026`} />
                <Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="hint-text">
            {attendanceData?.trend?.[1]?.day || '6 Apr'} 2026 Attendance: {attendanceData?.trend?.[1]?.attendance || 0}%
          </p>
        </article>
      </section>

      <section className="module-card-grid three">
        {averageCards.map((item) => (
          <article key={item.title} className="panel average-card">
            <h4>{item.title}</h4>
            <p>{item.value}</p>
            <div className="spark-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData(item.data)}>
                  <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
