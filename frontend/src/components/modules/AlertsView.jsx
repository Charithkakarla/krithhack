import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Bell,
  CalendarDays,
  CheckCircle2,
  Filter,
  Mail,
  Menu,
  MessageCircle,
  MoreVertical,
  Search,
  Send,
  Smartphone,
  TriangleAlert,
  X
} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useFilters } from '../../context/FilterContext'
import { sendStudentAlert } from '../../services/studentApi'

const metrics = [
  {
    icon: Bell,
    title: 'Active Alerts',
    value: '12',
    subtext: 'Needs attention',
    className: 'am-red'
  },
  {
    icon: AlertCircle,
    title: 'Warning Alerts',
    value: '18',
    subtext: 'Monitor closely',
    className: 'am-orange'
  },
  {
    icon: CheckCircle2,
    title: 'Resolved Alerts',
    value: '45',
    subtext: 'This month',
    className: 'am-green'
  },
  {
    icon: Send,
    title: 'Total Sent',
    value: '128',
    subtext: 'This month',
    className: 'am-blue'
  }
]

const tabs = ['Active Alerts', 'All Notifications', 'Sent History', 'Alert Rules']

const donutData = [
  { name: 'High', value: 12, color: '#ef4444' },
  { name: 'Medium', value: 18, color: '#f59e0b' },
  { name: 'Low', value: 8, color: '#22c55e' },
  { name: 'Resolved', value: 45, color: '#3b82f6' }
]

const channels = [
  { name: 'WhatsApp', count: 96, share: '75%', icon: MessageCircle, tone: 'ch-green' },
  { name: 'SMS', count: 20, share: '16%', icon: Smartphone, tone: 'ch-blue' },
  { name: 'Email', count: 12, share: '9%', icon: Mail, tone: 'ch-purple' }
]

const ALERT_PHONE = '7799663979'
const ATTENDANCE_THRESHOLD = 80
const MARKS_THRESHOLD = 75

function Badge({ value, tone }) {
  return <span className={`alert-badge ${tone}`}>{value}</span>
}

function splitDateTime(text) {
  const [date, time] = text.split('\n')
  return { date, time }
}

function toNumeric(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function getMarksPercentage(student) {
  if (Number.isFinite(toNumeric(student.overallPercentage))) {
    return toNumeric(student.overallPercentage)
  }

  if (Array.isArray(student.subjects) && student.subjects.length > 0) {
    const percentages = student.subjects
      .map((row) => {
        const max = toNumeric(row.max) || 100
        const obtained = toNumeric(row.obtained)
        if (obtained === null || max <= 0) {
          return null
        }
        return (obtained / max) * 100
      })
      .filter((value) => value !== null)

    if (percentages.length > 0) {
      return percentages.reduce((sum, value) => sum + value, 0) / percentages.length
    }
  }

  const directMarks = [student.mathGrade, student.scienceGrade]
    .map((value) => {
      const parsed = toNumeric(value)
      if (parsed !== null) {
        return parsed
      }

      const normalized = String(value || '').trim().toUpperCase()
      const gradeMap = {
        'A+': 96,
        A: 90,
        'B+': 82,
        B: 75,
        'C+': 68,
        C: 60,
        D: 50,
        F: 35
      }

      return gradeMap[normalized] ?? null
    })
    .filter((value) => value !== null)

  if (directMarks.length > 0) {
    return directMarks.reduce((sum, value) => sum + value, 0) / directMarks.length
  }

  return null
}

function getAlertRows(students) {
  const rows = []

  students.forEach((student, index) => {
    const attendance = toNumeric(student.attendancePercentage ?? student.attendance_percentage)
    const marks = getMarksPercentage(student)
    const className = student.className || '10-A'
    const phone = student.phone || student.parent_phone || '-'

    if (attendance !== null && attendance < ATTENDANCE_THRESHOLD) {
      rows.push({
        id: `attendance-${student.id}`,
        alert: 'Low Attendance Alert',
        description: `Attendance is below ${ATTENDANCE_THRESHOLD}%`,
        type: 'Attendance',
        priority: 'High',
        color: 'row-red',
        person: student.name,
        contact: phone,
        className,
        datetime: `${24 - Math.min(index, 2)} Apr 2026\n${String(10 + index).padStart(2, '0')}:30 AM`,
        status: 'Active',
        attendance,
        marks,
        student,
        note: 'Please review attendance and inform the parent immediately.'
      })
    }

    if (marks !== null && marks < MARKS_THRESHOLD) {
      rows.push({
        id: `marks-${student.id}`,
        alert: 'Low Marks Alert',
        description: `Marks are below ${MARKS_THRESHOLD}%`,
        type: 'Marks',
        priority: 'High',
        color: 'row-pink',
        person: student.name,
        contact: phone,
        className,
        datetime: `${24 - Math.min(index, 2)} Apr 2026\n${String(11 + index).padStart(2, '0')}:00 AM`,
        status: 'Active',
        attendance,
        marks,
        student,
        note: 'Please share subject-wise improvement guidance with the parent.'
      })
    }
  })

  if (!rows.length) {
    return [
      {
        id: 'no-alerts',
        alert: 'No Active Alerts',
        description: 'All tracked students are above alert thresholds.',
        type: 'Info',
        priority: 'Low',
        color: 'row-blue',
        person: 'All Students',
        contact: '-',
        className: '10-A',
        datetime: '24 Apr 2026\n10:30 AM',
        status: 'Resolved',
        attendance: null,
        marks: null,
        student: null,
        note: 'No delivery needed.'
      }
    ]
  }

  return rows.slice(0, 8)
}

export default function AlertsView() {
  const { classStudents } = useFilters()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [sendingId, setSendingId] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const alertRows = useMemo(() => {
    const templates = [
      { alert: 'Low Attendance Alert', description: 'Attendance is below 75%', type: 'Attendance', priority: 'High', color: 'row-red' },
      { alert: 'Performance Drop Alert', description: 'Marks dropped below class target', type: 'Performance', priority: 'Medium', color: 'row-orange' },
      { alert: 'Low Marks Alert', description: 'Scored below 75% in core subjects', type: 'Marks', priority: 'High', color: 'row-pink' },
      { alert: 'Fee Due Reminder', description: 'Term fee payment is pending', type: 'Fee', priority: 'Medium', color: 'row-yellow' },
      { alert: 'Test Reminder', description: 'Upcoming unit test reminder', type: 'Reminder', priority: 'Low', color: 'row-blue' }
    ]

    return classStudents.slice(0, 5).map((student, index) => {
      const template = templates[index % templates.length]
      return {
        ...template,
        person: template.type === 'Fee' ? `Parent of ${student.name}` : student.name,
        contact: student.phone || '-',
        className: student.className || '10-A',
        datetime: `${24 - Math.min(index, 2)} Apr 2026\n${String(10 + index).padStart(2, '0')}:30 AM`,
        status: template.type === 'Reminder' ? 'Scheduled' : 'Active'
      }
    })
  }, [classStudents])

  const notificationRows = useMemo(() => getAlertRows(classStudents), [classStudents])

  async function handleSendAlert(row) {
    if (!row.student) {
      setStatusMessage('No student selected for this notification.')
      return
    }

    setSendingId(row.id)
    setStatusMessage('Sending alert to 7799663979...')

    try {
      const result = await sendStudentAlert({
        student_id: row.student.id,
        student_name: row.student.name,
        alert_type: row.alert,
        attendance_percentage: row.attendance,
        marks_percentage: row.marks,
        note: row.note
      })

      setStatusMessage(`${row.student.name}: alert sent to ${result.target_number}.`)
    } catch {
      setStatusMessage(`Failed to send alert for ${row.student.name}.`)
    } finally {
      setSendingId('')
    }
  }

  return (
    <div className="module-page alerts-page">
      <section className="alerts-topbar panel">
        <button type="button" className="icon-outline" aria-label="Menu">
          <Menu size={17} />
        </button>

        <div className="alerts-search">
          <Search size={16} />
          <input type="search" placeholder="Search students, parents, alerts..." />
        </div>

        <div className="alerts-top-actions">
          <span className="date-pill">
            <CalendarDays size={16} />
            24 April 2026, Thursday
          </span>
          <button
            className="icon-button notification-toggle"
            type="button"
            aria-label="Notifications"
            onClick={() => setNotificationOpen((value) => !value)}
          >
            <Bell size={17} />
            <span className="dot-badge" />
          </button>
          <div className="admin-chip">
            <div className="avatar tiny">AD</div>
            <div>
              <strong>Admin</strong>
              <small>Super Admin</small>
            </div>
          </div>

          {notificationOpen ? (
            <div className="notifications-popover panel">
              <div className="notifications-header">
                <div>
                  <strong>Notifications</strong>
                  <p>Low attendance and low marks</p>
                </div>
                <button type="button" className="icon-outline compact" aria-label="Close notifications" onClick={() => setNotificationOpen(false)}>
                  <X size={14} />
                </button>
              </div>

              <div className="notifications-list">
                {notificationRows.map((row) => (
                  <article key={row.id} className="notification-item">
                    <div className="notification-copy">
                      <span className={`alert-dot ${row.color}`}>
                        <TriangleAlert size={12} />
                      </span>
                      <div>
                        <strong>{row.alert}</strong>
                        <p>
                          {row.person} {row.attendance !== null ? `- Attendance ${row.attendance.toFixed(1)}%` : ''}
                          {row.marks !== null ? `- Marks ${row.marks.toFixed(1)}%` : ''}
                        </p>
                        <small>{row.note}</small>
                      </div>
                    </div>
                    <button type="button" className="send-alert-btn" onClick={() => handleSendAlert(row)} disabled={sendingId === row.id}>
                      {sendingId === row.id ? 'Sending...' : `Send to ${ALERT_PHONE}`}
                    </button>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="alerts-title-row">
        <h2>Alerts & Notifications</h2>
        <p>Dashboard &gt; Alerts & Notifications</p>
      </section>

      <section className="alert-metrics">
        {metrics.map(({ icon: Icon, title, value, subtext, className }) => (
          <article key={title} className="panel alert-metric-card">
            <div className={`metric-icon ${className}`}>
              <Icon size={20} />
            </div>
            <div>
              <h3>{value}</h3>
              <h4>{title}</h4>
              <p>{subtext}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="alerts-main-grid">
        <article className="panel alerts-table-card">
          <div className="alerts-tabs">
            {tabs.map((tab, index) => (
              <button key={tab} type="button" className={index === 0 ? 'active' : ''}>
                {tab}
              </button>
            ))}
          </div>

          <div className="alerts-filter-row">
            <div className="left-filters">
              <select defaultValue="All Types">
                <option>All Types</option>
                <option>Attendance</option>
                <option>Performance</option>
                <option>Marks</option>
                <option>Fee</option>
              </select>
              <select defaultValue="All Classes">
                <option>All Classes</option>
                <option>10-A</option>
                <option>10-B</option>
                <option>9-B</option>
              </select>
              <select defaultValue="All Priority">
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="right-filters">
              <div className="alerts-search small">
                <Search size={14} />
                <input type="search" placeholder="Search alerts..." />
              </div>
              <button type="button" className="filter-btn">
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          <div className="alerts-table-wrap">
            <table className="alerts-table">
              <thead>
                <tr>
                  <th />
                  <th>Alert</th>
                  <th>Student / Parent</th>
                  <th>Class</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alertRows.map((row) => {
                  const dateTime = splitDateTime(row.datetime)
                  return (
                    <tr key={row.alert + row.person}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>
                        <div className="alert-cell">
                          <span className={`alert-dot ${row.color}`}>
                            <TriangleAlert size={12} />
                          </span>
                          <div>
                            <strong>{row.alert}</strong>
                            <small>{row.description}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="person-cell">
                          <span className="mini-avatar">{row.person.slice(0, 2).toUpperCase()}</span>
                          <div>
                            <strong>{row.person}</strong>
                            <small>{row.contact}</small>
                          </div>
                        </div>
                      </td>
                      <td>{row.className}</td>
                      <td>
                        <Badge value={row.type} tone="soft" />
                      </td>
                      <td>
                        <Badge
                          value={row.priority}
                          tone={
                            row.priority === 'High' ? 'high' : row.priority === 'Medium' ? 'medium' : 'low'
                          }
                        />
                      </td>
                      <td>
                        <div className="date-time-cell">
                          <strong>{dateTime.date}</strong>
                          <small>{dateTime.time}</small>
                        </div>
                      </td>
                      <td>
                        <Badge value={row.status} tone={row.status === 'Active' ? 'high' : 'low'} />
                      </td>
                      <td>
                        <div className="table-actions">
                          <button type="button" aria-label="WhatsApp">
                            <MessageCircle size={14} />
                          </button>
                          <button type="button" aria-label="Message">
                            <Mail size={14} />
                          </button>
                          <button type="button" aria-label="More">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="alerts-table-footer">
            <p>Showing 1 to 5 of 12 alerts</p>
            <div className="pager">
              <button type="button">&lt;</button>
              <button type="button" className="active">
                1
              </button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">&gt;</button>
            </div>
          </div>

          <div className="alerts-info-strip">
            <div>
              <h4>About Alerts & Notifications</h4>
              <p>
                Alerts help you stay on top of important student activities. You can customize alert rules and send
                instant notifications to parents via their preferred channels.
              </p>
            </div>
            <button type="button">View Alert Rules</button>
          </div>
        </article>

        <aside className="alerts-right-stack">
          <article className="panel quick-actions-panel">
            <h3>Quick Actions</h3>
            <button type="button" className="qa-action qa-blue">
              <Send size={15} /> Send Alert to Selected
            </button>
            <button type="button" className="qa-action qa-green">
              <CheckCircle2 size={15} /> Create New Alert
            </button>
            <button type="button" className="qa-action qa-purple">
              <AlertCircle size={15} /> Manage Alert Rules
            </button>
          </article>

          <article className="panel alert-summary-panel">
            <h3>Alert Summary</h3>
            <div className="summary-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62}>
                    {donutData.map((slice) => (
                      <Cell key={slice.name} fill={slice.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="summary-total">
                <strong>83</strong>
                <span>Total</span>
              </div>
            </div>
            <ul>
              {donutData.map((item) => (
                <li key={item.name}>
                  <i style={{ background: item.color }} />
                  <span>
                    {item.name} ({item.value})
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel notification-channels">
            <h3>Notification Channels</h3>
            {channels.map(({ name, count, share, icon: Icon, tone }) => (
              <div key={name} className="channel-row">
                <div className="channel-name">
                  <span className={`channel-icon ${tone}`}>
                    <Icon size={13} />
                  </span>
                  <span>{name}</span>
                </div>
                <strong>{count}</strong>
                <small>{share}</small>
              </div>
            ))}
          </article>
        </aside>
      </section>

      {statusMessage ? <div className="toast-notification">{statusMessage}</div> : null}
    </div>
  )
}
