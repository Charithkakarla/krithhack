import { useState } from 'react'
import { useFilters } from '../../context/FilterContext'
import { attendanceFallbackByStudent, marksFallbackByStudent } from '../../data/students'

const stats = [
  { title: 'Total Students', value: '512' },
  { title: 'Boys / Girls', value: '278 / 234' },
  { title: 'Active Students', value: '496' },
  { title: 'New Admissions', value: '21' }
]

const teachers = [
  { name: 'Mr. Rahul', className: 'Mathematics', phone: '+91 99888 11001', attendance: '98.8%', marks: '-', status: 'Active' },
  { name: 'Ms. Neha', className: 'Science', phone: '+91 99888 11002', attendance: '97.9%', marks: '-', status: 'Active' },
  { name: 'Mrs. Priya', className: 'English', phone: '+91 99888 11003', attendance: '96.1%', marks: '-', status: 'On Leave' }
]

export default function StudentsView({ onNavigate }) {
  const { classStudents, selectedClassLabel, setSelectedStudent } = useFilters()
  const [mode, setMode] = useState('students')
  const students = classStudents.map((student) => {
    const attendance = attendanceFallbackByStudent[student.id]
    const marks = marksFallbackByStudent[student.id]
    return {
      ...student,
      attendance: `${attendance?.attendancePercentage?.toFixed(1) || '0.0'}%`,
      marks: `${marks?.overallPercentage?.toFixed(1) || '0.0'}%`,
      status: (attendance?.attendancePercentage || 0) < 75 ? 'Watchlist' : 'Active'
    }
  })

  const rows = mode === 'students' ? students : teachers

  function handleViewProfile(row, targetModule = 'attendance') {
    if (mode !== 'students') {
      return
    }
    setSelectedStudent(row)
    if (onNavigate) {
      onNavigate(targetModule)
    }
  }

  return (
    <div className="module-page">
      <header className="module-header panel">
        <div>
          <h2>Student & Teacher Management</h2>
          <p>Directory and operational actions for classroom administration.</p>
        </div>
      </header>

      <section className="module-card-grid four">
        {stats.map((item) => (
          <article key={item.title} className="panel stat-card-soft">
            <h4>{item.title}</h4>
            <p>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header compact">
          <h3>Master Directory</h3>
          <div className="segmented">
            <button type="button" className={mode === 'students' ? 'active' : ''} onClick={() => setMode('students')}>
              Students
            </button>
            <button type="button" className={mode === 'teachers' ? 'active' : ''} onClick={() => setMode('teachers')}>
              Teachers
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>{mode === 'students' ? 'Student Name' : 'Teacher Name'}</th>
              <th>{mode === 'students' ? 'Class' : 'Subject'}</th>
              <th>Phone</th>
              <th>Attendance %</th>
              <th>Avg Marks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.className}</td>
                <td>{row.phone}</td>
                <td>{row.attendance}</td>
                <td>{row.marks}</td>
                <td>
                  <span className="grade-chip">{row.status}</span>
                </td>
                <td>
                  <div className="table-actions wide">
                    <button type="button" onClick={() => handleViewProfile(row, 'attendance')}>
                      View Profile
                    </button>
                    {mode === 'students' ? (
                      <button type="button" onClick={() => handleViewProfile(row, 'marks')}>
                        View Marks
                      </button>
                    ) : (
                      <button type="button">Edit</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel quick-action-row">
        <button type="button" onClick={() => onNavigate && onNavigate('attendance')}>
          View Attendance
        </button>
        <button type="button" onClick={() => onNavigate && onNavigate('marks')}>
          View Marks
        </button>
        <button type="button">Send Message to Parent</button>
        <button type="button" className="danger-btn">
          Deactivate Student
        </button>
      </section>

      <section className="panel status-message">Current active class: {selectedClassLabel}</section>
    </div>
  )
}
